import React, { useEffect, useRef, useState, useMemo } from 'react';
import * as d3 from 'd3';
import { 
  Network, 
  BookOpen, 
  ZoomIn, 
  ZoomOut, 
  RotateCcw, 
  X, 
  Sparkles, 
  Filter, 
  Layers, 
  ExternalLink,
  MessageSquare,
  Compass,
  ArrowRight,
  HelpCircle,
  Maximize2,
  Minimize2,
  Copy,
  Check,
  Scale,
  BrainCircuit,
  ShieldCheck,
  ShieldAlert,
  FileText,
  ChevronRight,
  ChevronLeft,
  Quote,
  MapPin
} from 'lucide-react';
import { Citation, SlideItem, DocumentChunk } from '../types';
import { CORE_DOCUMENTS } from '../data/knowledgeBase';
import { resolveRagLiteratureThesis, RagLiteratureThesis } from '../data/ragLiteratureAnalyzer';

export interface OntologyNode extends d3.SimulationNodeDatum {
  id: string;
  label: string;
  fullTitle: string;
  category: 'topic' | 'citation' | 'knowledge' | 'concept';
  paradigm: 'logic' | 'pde' | 'agent' | 'physics' | 'general';
  year?: number;
  authors?: string;
  sectionOrPage?: string;
  quote?: string;
  similarity?: number;
  description?: string;
  radius: number;
  color: string;
}

export interface OntologyLink extends d3.SimulationLinkDatum<OntologyNode> {
  source: string | OntologyNode;
  target: string | OntologyNode;
  relation: string;
  relationType: 'foundation' | 'mapping' | 'verification' | 'tension' | 'direct';
  description: string;
  strength?: number;
}

interface LiteratureOntologyGraphProps {
  currentSlide: SlideItem;
  slideCitations: Citation[];
  initialSelectedCitation?: Citation | null;
  onClose: () => void;
  onInjectQuestion?: (question: string) => void;
  onSelectNodeThesis?: (node: OntologyNode, thesis: RagLiteratureThesis) => void;
  onNavigateSlide?: (slideIndex: number) => void;
}

export const LiteratureOntologyGraph: React.FC<LiteratureOntologyGraphProps> = ({
  currentSlide,
  slideCitations,
  initialSelectedCitation,
  onClose,
  onInjectQuestion,
  onSelectNodeThesis,
  onNavigateSlide
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const simulationRef = useRef<d3.Simulation<OntologyNode, OntologyLink> | null>(null);

  const [selectedNode, setSelectedNode] = useState<OntologyNode | null>(null);
  const [hoveredNode, setHoveredNode] = useState<OntologyNode | null>(null);
  const [selectedParadigm, setSelectedParadigm] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [showRelationLabels, setShowRelationLabels] = useState<boolean>(true);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [drawerTab, setDrawerTab] = useState<'thesis' | 'formal' | 'chunk' | 'socratic'>('thesis');
  const [isDrawerWide, setIsDrawerWide] = useState<boolean>(false);
  const [copiedFeedback, setCopiedFeedback] = useState<boolean>(false);
  const [locateSuccessFeedback, setLocateSuccessFeedback] = useState<string | null>(null);

  // Active Thesis analysis computed for selected node
  const activeThesis = useMemo<RagLiteratureThesis | null>(() => {
    if (!selectedNode) return null;
    return resolveRagLiteratureThesis(selectedNode.id, selectedNode.fullTitle, currentSlide, slideCitations);
  }, [selectedNode, currentSlide, slideCitations]);

  // Sync with parent when selection changes
  useEffect(() => {
    if (selectedNode && activeThesis && onSelectNodeThesis) {
      onSelectNodeThesis(selectedNode, activeThesis);
    }
  }, [selectedNode, activeThesis, onSelectNodeThesis]);

  const handleLocateSlide = (targetIndex?: number) => {
    const page = targetIndex || activeThesis?.targetSlideIndex || currentSlide.index;
    if (onNavigateSlide) {
      onNavigateSlide(page);
      setLocateSuccessFeedback(`已同步定位至 Slide P.${page}`);
      setTimeout(() => setLocateSuccessFeedback(null), 2500);
    }
  };

  const handleCopyThesis = () => {
    if (!activeThesis) return;
    const text = `【文献核心论点摘要】
文献：《${activeThesis.sourceTitle}》 (${activeThesis.authors}, ${activeThesis.year || 2026})
出处：${activeThesis.sectionOrPage}
本体论范式：${activeThesis.ontologicalParadigm}

【核心论题】
${activeThesis.coreThesis}

【形式化推论结构】
${activeThesis.formalizedArgument.explicitPremises.join('\n')}
隐涵假设：${activeThesis.formalizedArgument.tacitAssumptions.join('; ')}
结论：${activeThesis.formalizedArgument.conclusion}
证伪判据：${activeThesis.formalizedArgument.falsificationCriteria}

【与当前议题映射】
${activeThesis.epistemicMappingToSlide}`;

    navigator.clipboard.writeText(text);
    setCopiedFeedback(true);
    setTimeout(() => setCopiedFeedback(false), 2000);
  };

  // 1. Build Ontology Nodes and Links based on currentSlide and slideCitations + RAG CORE_DOCUMENTS
  const graphData = useMemo<{ nodes: OntologyNode[]; links: OntologyLink[] }>(() => {
    const nodes: OntologyNode[] = [];
    const links: OntologyLink[] = [];
    const addedNodeIds = new Set<string>();

    // 1.1 Root Topic Node (Current Slide Academic Issue)
    const topicId = `topic-${currentSlide.index}`;
    const topicNode: OntologyNode = {
      id: topicId,
      label: `P.${currentSlide.index}: ${currentSlide.title}`,
      fullTitle: currentSlide.title,
      category: 'topic',
      paradigm: currentSlide.index <= 22 ? 'logic' : currentSlide.index <= 36 ? 'pde' : currentSlide.index <= 52 ? 'agent' : 'physics',
      sectionOrPage: currentSlide.sectionTitle || `Slide ${currentSlide.index}`,
      description: currentSlide.details || currentSlide.subtitle || '当前研讨会主讲议题与形式化命题',
      radius: 34,
      color: '#f59e0b' // Amber gold
    };
    nodes.push(topicNode);
    addedNodeIds.add(topicId);

    // 1.2 Active Slide Citations
    slideCitations.forEach((cit, idx) => {
      const citId = `citation-${idx}-${cit.chunkId || idx}`;
      if (!addedNodeIds.has(citId)) {
        const citNode: OntologyNode = {
          id: citId,
          label: cit.sourceTitle.length > 14 ? cit.sourceTitle.slice(0, 13) + '…' : cit.sourceTitle,
          fullTitle: cit.sourceTitle,
          category: 'citation',
          paradigm: cit.sourceTitle.includes('逆向') || cit.sourceTitle.includes('弗里德曼') 
            ? 'logic' 
            : cit.sourceTitle.includes('邓煜') || cit.sourceTitle.includes('奇异性') 
            ? 'pde' 
            : cit.sourceTitle.includes('智能体') || cit.sourceTitle.includes('Joon') 
            ? 'agent' 
            : 'physics',
          sectionOrPage: cit.pageOrSection,
          quote: cit.quoteText,
          similarity: cit.similarity,
          description: `本页课件直接锚定的权威学术引证证据链 (相似度: ${cit.similarity ? (cit.similarity * 100).toFixed(1) + '%' : '高'})`,
          radius: 24,
          color: '#38bdf8' // Sky blue
        };
        nodes.push(citNode);
        addedNodeIds.add(citId);

        // Link from Topic to Citation
        links.push({
          source: topicId,
          target: citId,
          relation: '直接文献实证',
          relationType: 'direct',
          description: `当前课件第 P.${currentSlide.index} 页命题直接依赖《${cit.sourceTitle}》作为学术理论奠基。`,
          strength: 1.0
        });
      }
    });

    // 1.3 RAG Knowledge Base Deep Lineage (CORE_DOCUMENTS)
    // Filter relevant docs by topic keywords, or include foundational docs
    const keywords = (currentSlide.keywords || []).map(k => k.toLowerCase());
    const slideTitleLower = currentSlide.title.toLowerCase();

    CORE_DOCUMENTS.forEach((doc, docIdx) => {
      const docKeywords = (doc.metadata.keywords || []).map(k => k.toLowerCase());
      const isRelevant = 
        keywords.some(k => docKeywords.some(dk => dk.includes(k) || k.includes(dk))) ||
        keywords.some(k => doc.source_title.toLowerCase().includes(k) || doc.chunk_text.toLowerCase().includes(k)) ||
        slideCitations.some(c => c.sourceTitle.includes(doc.source_title) || doc.source_title.includes(c.sourceTitle)) ||
        docIdx < 5; // Ensure at least key philosophical/mathematical roots are available

      if (isRelevant) {
        const docNodeId = `rag-${doc.id}`;
        if (!addedNodeIds.has(docNodeId)) {
          let paradigm: 'logic' | 'pde' | 'agent' | 'physics' | 'general' = 'general';
          let nodeColor = '#a855f7'; // Purple default

          if (doc.source_title.includes('弗里德曼') || doc.source_title.includes('不完备性')) {
            paradigm = 'logic';
            nodeColor = '#ec4899'; // Pink/Magenta for Logic
          } else if (doc.source_title.includes('邓煜') || doc.source_title.includes('布克马斯特') || doc.source_title.includes('欧拉')) {
            paradigm = 'pde';
            nodeColor = '#06b6d4'; // Cyan for PDE/Manifold
          } else if (doc.source_title.includes('智能体') || doc.source_title.includes('Park') || doc.source_title.includes('DFM')) {
            paradigm = 'agent';
            nodeColor = '#10b981'; // Emerald for Agent
          } else if (doc.source_title.includes('热力学') || doc.source_title.includes('朗之万') || doc.source_title.includes('p-bit')) {
            paradigm = 'physics';
            nodeColor = '#f97316'; // Orange for Physics/Hardware
          }

          const ragNode: OntologyNode = {
            id: docNodeId,
            label: doc.metadata.authors ? `${doc.metadata.authors.split(' ')[0]}` : doc.source_title.slice(0, 10),
            fullTitle: doc.source_title,
            category: 'knowledge',
            paradigm,
            year: doc.metadata.year,
            authors: doc.metadata.authors,
            sectionOrPage: doc.metadata.section || `P.${doc.metadata.page}`,
            quote: doc.chunk_text.slice(0, 220) + '...',
            description: `RAG 知识库原典文献：${doc.metadata.section || '核心理论'}`,
            radius: 20,
            color: nodeColor
          };
          nodes.push(ragNode);
          addedNodeIds.add(docNodeId);

          // Find links: Link to citations with shared keyword/topic or link directly to topic
          const matchingCitationNode = nodes.find(n => 
            n.category === 'citation' && (
              n.fullTitle.includes(doc.source_title) || 
              doc.source_title.includes(n.fullTitle) ||
              (doc.metadata.keywords || []).some(k => n.quote?.includes(k))
            )
          );

          if (matchingCitationNode) {
            links.push({
              source: matchingCitationNode.id,
              target: docNodeId,
              relation: '本体论原典源流',
              relationType: 'foundation',
              description: `引证文献衍生自《${doc.source_title}》的底层公理体系。`,
              strength: 0.8
            });
          } else {
            // Epistemic mapping to Topic
            const relationLabel = paradigm === 'logic' 
              ? '形式化公理奠基' 
              : paradigm === 'pde' 
              ? '无穷维相变映射' 
              : paradigm === 'agent' 
              ? 'BDI微观架构' 
              : '物理约束满足';

            links.push({
              source: topicId,
              target: docNodeId,
              relation: relationLabel,
              relationType: 'mapping',
              description: `将本页社科哲学议题映射至《${doc.source_title}》的${relationLabel}。`,
              strength: 0.6
            });
          }
        }
      }
    });

    // 1.4 Add Key Ontological Concept Nodes to complete the lineage loop
    const conceptPointers = [
      {
        id: 'concept-incompleteness',
        label: '具体数学不完备性 (RCA_0)',
        fullTitle: '哈维·弗里德曼具体数学不完备性与有理立方体',
        category: 'concept' as const,
        paradigm: 'logic' as const,
        description: '有限离散数学命题在一阶 ZFC 公理中不可判定，必须依赖超越性大基数公理外生锚定。',
        radius: 16,
        color: '#f43f5e',
        targetKeywords: ['哥德尔', '逆向', '大基数', '弗里德曼', '不完备', '数学', '契约']
      },
      {
        id: 'concept-codim1',
        label: '余维数-1 临界超曲面',
        fullTitle: '邓煜余维数-1 临界相界与高维流形相变',
        category: 'concept' as const,
        paradigm: 'pde' as const,
        description: '鞍点线性化算子单一负模决定耗散收敛与有限时间爆破的超曲面分割界，映射社会脆弱性。',
        radius: 16,
        color: '#0284c7',
        targetKeywords: ['余维数', '奇异性', '相空间', '邓煜', '流形', '欧拉', '爆破', '脆性']
      },
      {
        id: 'concept-machiavellian-bdi',
        label: '马基雅维利 BDI 偏置',
        fullTitle: '打破 RLHF 中庸陷阱的马基雅维利博弈状态机',
        category: 'concept' as const,
        paradigm: 'agent' as const,
        description: '生成式智能体在硬存量约束下，基于二阶反思树涌现自发违约与寻租偏置。',
        radius: 16,
        color: '#059669',
        targetKeywords: ['智能体', 'rlhf', '中庸', '博弈', 'bdi', '记忆流', '反思', '马基雅维利']
      },
      {
        id: 'concept-formal-lean4',
        label: 'Lean 4 零误差核验',
        fullTitle: '交互式定理证明器 Lean 4 形式化数学闭环',
        category: 'concept' as const,
        paradigm: 'logic' as const,
        description: '发散直觉（System 1）与形式化内核（System 2）相互咬合，彻底排除经院同义反复。',
        radius: 16,
        color: '#e11d48',
        targetKeywords: ['lean', '形式化', '证明器', '布克马斯特', '深蓝', '千禧年']
      }
    ];

    conceptPointers.forEach(cp => {
      const matchDoc = nodes.find(n => 
        cp.targetKeywords.some(tk => n.fullTitle.toLowerCase().includes(tk) || (n.quote || '').toLowerCase().includes(tk))
      );

      if (matchDoc) {
        nodes.push({
          id: cp.id,
          label: cp.label,
          fullTitle: cp.fullTitle,
          category: 'concept',
          paradigm: cp.paradigm,
          description: cp.description,
          radius: cp.radius,
          color: cp.color
        });

        links.push({
          source: matchDoc.id,
          target: cp.id,
          relation: '本体论范畴凝练',
          relationType: 'verification',
          description: `《${matchDoc.fullTitle}》形式化收敛为关键本体论范式【${cp.label}】。`,
          strength: 0.9
        });
      }
    });

    return { nodes, links };
  }, [currentSlide, slideCitations]);

  // Initial selection
  useEffect(() => {
    if (initialSelectedCitation) {
      const match = graphData.nodes.find(n => 
        n.category === 'citation' && n.fullTitle.includes(initialSelectedCitation.sourceTitle)
      );
      if (match) {
        setSelectedNode(match);
      }
    } else {
      setSelectedNode(graphData.nodes[0]);
    }
  }, [initialSelectedCitation, graphData]);

  // 2. D3 Force Directed Simulation Rendering
  useEffect(() => {
    if (!svgRef.current || !containerRef.current) return;

    const width = containerRef.current.clientWidth || 600;
    const height = containerRef.current.clientHeight || 450;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove(); // Clear previous

    svg
      .attr('width', width)
      .attr('height', height)
      .attr('viewBox', [0, 0, width, height]);

    // Defs for arrows, filters and gradients
    const defs = svg.append('defs');

    // Arrow markers
    const arrowTypes = [
      { id: 'arrow-direct', color: '#38bdf8' },
      { id: 'arrow-foundation', color: '#a855f7' },
      { id: 'arrow-mapping', color: '#06b6d4' },
      { id: 'arrow-verification', color: '#f43f5e' },
      { id: 'arrow-tension', color: '#eab308' }
    ];

    arrowTypes.forEach(({ id, color }) => {
      defs
        .append('marker')
        .attr('id', id)
        .attr('viewBox', '0 -5 10 10')
        .attr('refX', 22)
        .attr('refY', 0)
        .attr('markerWidth', 6)
        .attr('markerHeight', 6)
        .attr('orient', 'auto')
        .append('path')
        .attr('d', 'M0,-5L10,0L0,5')
        .attr('fill', color)
        .attr('opacity', 0.85);
    });

    // Radial gradient for glowing root topic node
    const topicGrad = defs
      .append('radialGradient')
      .attr('id', 'grad-topic')
      .attr('cx', '50%')
      .attr('cy', '50%')
      .attr('r', '50%');
    topicGrad.append('stop').attr('offset', '0%').attr('stop-color', '#fbbf24');
    topicGrad.append('stop').attr('offset', '100%').attr('stop-color', '#d97706');

    // Glow filter for selected/hovered nodes
    const filter = defs.append('filter').attr('id', 'glow').attr('x', '-30%').attr('y', '-30%').attr('width', '160%').attr('height', '160%');
    filter.append('feGaussianBlur').attr('stdDeviation', '4').attr('result', 'blur');
    filter.append('feComposite').attr('in', 'SourceGraphic').attr('in2', 'blur').attr('operator', 'over');

    // Zoomable group
    const g = svg.append('g').attr('class', 'zoom-layer');

    const zoom = d3
      .zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.3, 3.5])
      .on('zoom', (event) => {
        g.attr('transform', event.transform);
      });

    svg.call(zoom);

    // Deep clone data for simulation to avoid mutating react memoized object
    const simulationNodes: OntologyNode[] = graphData.nodes.map(d => ({ ...d }));
    const simulationLinks: OntologyLink[] = graphData.links.map(d => ({ ...d }));

    // Filter nodes based on selectedParadigm
    const activeNodes = selectedParadigm === 'all' 
      ? simulationNodes 
      : simulationNodes.filter(n => n.category === 'topic' || n.paradigm === selectedParadigm);

    const activeNodeIds = new Set(activeNodes.map(n => n.id));
    const activeLinks = simulationLinks.filter(l => 
      activeNodeIds.has(typeof l.source === 'string' ? l.source : l.source.id) &&
      activeNodeIds.has(typeof l.target === 'string' ? l.target : l.target.id)
    );

    // Force Simulation Setup
    const simulation = d3
      .forceSimulation<OntologyNode>(activeNodes)
      .force(
        'link',
        d3
          .forceLink<OntologyNode, OntologyLink>(activeLinks)
          .id((d) => d.id)
          .distance((d) => (d.relationType === 'direct' ? 95 : 130))
          .strength((d) => d.strength || 0.7)
      )
      .force('charge', d3.forceManyBody().strength(-360))
      .force('center', d3.forceCenter(width / 2, height / 2))
      .force(
        'collision',
        d3.forceCollide<OntologyNode>().radius((d) => d.radius + 16)
      )
      .alphaDecay(0.04);

    simulationRef.current = simulation;

    // Render Links
    const linkGroup = g.append('g').attr('class', 'links');
    const link = linkGroup
      .selectAll('line')
      .data(activeLinks)
      .enter()
      .append('line')
      .attr('stroke', (d) => {
        switch (d.relationType) {
          case 'direct': return '#38bdf8';
          case 'foundation': return '#a855f7';
          case 'mapping': return '#06b6d4';
          case 'verification': return '#f43f5e';
          default: return '#525252';
        }
      })
      .attr('stroke-width', (d) => (d.relationType === 'direct' ? 2.5 : 1.6))
      .attr('stroke-dasharray', (d) => (d.relationType === 'mapping' ? '4 3' : 'none'))
      .attr('stroke-opacity', 0.65)
      .attr('marker-end', (d) => {
        switch (d.relationType) {
          case 'direct': return 'url(#arrow-direct)';
          case 'foundation': return 'url(#arrow-foundation)';
          case 'mapping': return 'url(#arrow-mapping)';
          case 'verification': return 'url(#arrow-verification)';
          default: return 'url(#arrow-direct)';
        }
      });

    // Render Link Text Labels (Edge Ontological Relationship)
    const linkTextGroup = g.append('g').attr('class', 'link-labels');
    const linkText = linkTextGroup
      .selectAll('text')
      .data(activeLinks)
      .enter()
      .append('text')
      .attr('class', 'link-label')
      .attr('font-size', '9px')
      .attr('font-family', 'sans-serif')
      .attr('fill', '#9ca3af')
      .attr('text-anchor', 'middle')
      .attr('dy', -4)
      .style('display', showRelationLabels ? 'block' : 'none')
      .style('pointer-events', 'none')
      .text((d) => d.relation);

    // Render Nodes Group
    const nodeGroup = g.append('g').attr('class', 'nodes');
    const node = nodeGroup
      .selectAll<SVGGElement, OntologyNode>('g.node')
      .data(activeNodes)
      .enter()
      .append('g')
      .attr('class', 'node')
      .style('cursor', 'pointer')
      .call(
        d3
          .drag<SVGGElement, OntologyNode>()
          .on('start', (event, d) => {
            if (!event.active) simulation.alphaTarget(0.3).restart();
            d.fx = d.x;
            d.fy = d.y;
          })
          .on('drag', (event, d) => {
            d.fx = event.x;
            d.fy = event.y;
          })
          .on('end', (event, d) => {
            if (!event.active) simulation.alphaTarget(0);
            d.fx = null;
            d.fy = null;
          })
      );

    // Outer glow ring for selected node
    node
      .append('circle')
      .attr('class', 'pulse-ring')
      .attr('r', (d) => d.radius + 6)
      .attr('fill', 'none')
      .attr('stroke', (d) => d.color)
      .attr('stroke-width', 2)
      .attr('stroke-opacity', 0)
      .attr('stroke-dasharray', '3 2');

    // Main circle
    node
      .append('circle')
      .attr('r', (d) => d.radius)
      .attr('fill', (d) => (d.category === 'topic' ? 'url(#grad-topic)' : d.color))
      .attr('stroke', '#ffffff')
      .attr('stroke-width', (d) => (d.category === 'topic' ? 2.5 : 1.5))
      .attr('stroke-opacity', 0.85)
      .style('filter', (d) => (d.category === 'topic' ? 'url(#glow)' : 'none'));

    // Category initials / Icon inside circle
    node
      .append('text')
      .attr('text-anchor', 'middle')
      .attr('dominant-baseline', 'central')
      .attr('fill', '#ffffff')
      .attr('font-size', (d) => (d.radius > 25 ? '13px' : '10px'))
      .attr('font-weight', 'bold')
      .attr('pointer-events', 'none')
      .text((d) => {
        if (d.category === 'topic') return 'P.' + currentSlide.index;
        if (d.category === 'citation') return '引';
        if (d.category === 'knowledge') return '典';
        return '范';
      });

    // Node text labels beneath
    node
      .append('text')
      .attr('dy', (d) => d.radius + 13)
      .attr('text-anchor', 'middle')
      .attr('fill', '#f3f4f6')
      .attr('font-size', '10px')
      .attr('font-weight', '500')
      .attr('stroke', '#000000')
      .attr('stroke-width', 3)
      .attr('stroke-linejoin', 'round')
      .attr('paint-order', 'stroke fill')
      .attr('pointer-events', 'none')
      .text((d) => (d.label.length > 16 ? d.label.slice(0, 15) + '…' : d.label));

    // Interaction Handlers
    node
      .on('mouseenter', (event, d) => {
        setHoveredNode(d);
        // Highlight connected links
        link
          .attr('stroke-opacity', (l) => {
            const sId = typeof l.source === 'string' ? l.source : l.source.id;
            const tId = typeof l.target === 'string' ? l.target : l.target.id;
            return sId === d.id || tId === d.id ? 1.0 : 0.15;
          })
          .attr('stroke-width', (l) => {
            const sId = typeof l.source === 'string' ? l.source : l.source.id;
            const tId = typeof l.target === 'string' ? l.target : l.target.id;
            return sId === d.id || tId === d.id ? 3 : 1.5;
          });

        node
          .select('.pulse-ring')
          .attr('stroke-opacity', (n) => (n.id === d.id ? 1 : 0));
      })
      .on('mouseleave', () => {
        setHoveredNode(null);
        link.attr('stroke-opacity', 0.65).attr('stroke-width', (d) => (d.relationType === 'direct' ? 2.5 : 1.6));
        node.select('.pulse-ring').attr('stroke-opacity', (n) => (selectedNode?.id === n.id ? 0.8 : 0));
      })
      .on('click', (event, d) => {
        event.stopPropagation();
        setSelectedNode(d);
        node.select('.pulse-ring').attr('stroke-opacity', (n) => (n.id === d.id ? 0.9 : 0));
      });

    // Update simulation positions on tick
    simulation.on('tick', () => {
      link
        .attr('x1', (d: any) => d.source.x)
        .attr('y1', (d: any) => d.source.y)
        .attr('x2', (d: any) => d.target.x)
        .attr('y2', (d: any) => d.target.y);

      linkText
        .attr('x', (d: any) => (d.source.x + d.target.x) / 2)
        .attr('y', (d: any) => (d.source.y + d.target.y) / 2);

      node.attr('transform', (d: any) => `translate(${d.x},${d.y})`);
    });

    // Clean up
    return () => {
      simulation.stop();
    };
  }, [graphData, selectedParadigm, showRelationLabels]);

  // Zoom control buttons
  const handleZoom = (factor: number) => {
    if (!svgRef.current) return;
    const svg = d3.select(svgRef.current);
    svg.transition().duration(250).call(d3.zoom<SVGSVGElement, unknown>().scaleBy as any, factor);
  };

  const handleResetZoom = () => {
    if (!svgRef.current || !containerRef.current) return;
    const width = containerRef.current.clientWidth || 600;
    const height = containerRef.current.clientHeight || 450;
    const svg = d3.select(svgRef.current);
    svg.transition().duration(300).call(
      d3.zoom<SVGSVGElement, unknown>().transform as any,
      d3.zoomIdentity.translate(0, 0).scale(1)
    );
    simulationRef.current?.alpha(0.3).restart();
  };

  return (
    <div className={`flex flex-col bg-neutral-950 text-neutral-100 rounded-xl border border-neutral-800 shadow-2xl overflow-hidden transition-all ${
      isFullscreen ? 'fixed inset-4 z-50' : 'w-full h-full min-h-[460px]'
    }`}>
      {/* Top Header Bar */}
      <div className="p-3 bg-neutral-900/90 border-b border-neutral-800 flex items-center justify-between gap-2">
        <div className="flex items-center space-x-2">
          <div className="p-1.5 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-400">
            <Network className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-neutral-100 flex items-center space-x-2">
              <span>D3.js 文献本体论谱系拓扑 (Ontology Lineage)</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 font-medium">
                P.{currentSlide.index} 关联网络
              </span>
            </h3>
            <p className="text-[10px] text-neutral-400">
              通过力导向图谱呈现本页学术命题、证据引注与 RAG 知识库原典的认识论连接
            </p>
          </div>
        </div>

        {/* Action controls */}
        <div className="flex items-center space-x-1.5">
          {/* Paradigm filter buttons */}
          <div className="hidden sm:flex items-center bg-neutral-950 rounded-lg p-0.5 border border-neutral-800 text-[10px]">
            <button
              onClick={() => setSelectedParadigm('all')}
              className={`px-2 py-1 rounded transition-colors ${
                selectedParadigm === 'all' ? 'bg-amber-500 text-neutral-950 font-bold' : 'text-neutral-400 hover:text-neutral-200'
              }`}
            >
              全部范式
            </button>
            <button
              onClick={() => setSelectedParadigm('logic')}
              className={`px-2 py-1 rounded transition-colors ${
                selectedParadigm === 'logic' ? 'bg-pink-500 text-white font-bold' : 'text-neutral-400 hover:text-neutral-200'
              }`}
            >
              数理逻辑
            </button>
            <button
              onClick={() => setSelectedParadigm('pde')}
              className={`px-2 py-1 rounded transition-colors ${
                selectedParadigm === 'pde' ? 'bg-cyan-500 text-neutral-950 font-bold' : 'text-neutral-400 hover:text-neutral-200'
              }`}
            >
              高维相变
            </button>
            <button
              onClick={() => setSelectedParadigm('agent')}
              className={`px-2 py-1 rounded transition-colors ${
                selectedParadigm === 'agent' ? 'bg-emerald-500 text-neutral-950 font-bold' : 'text-neutral-400 hover:text-neutral-200'
              }`}
            >
              BDI智能体
            </button>
          </div>

          <button
            onClick={() => setShowRelationLabels(!showRelationLabels)}
            className={`p-1.5 rounded-lg border text-xs transition-colors ${
              showRelationLabels 
                ? 'bg-neutral-800 border-neutral-700 text-amber-400' 
                : 'bg-neutral-950 border-neutral-800 text-neutral-400 hover:text-neutral-200'
            }`}
            title="切换关系文本连线标注"
          >
            <Layers className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-1.5 rounded-lg bg-neutral-950 border border-neutral-800 hover:bg-neutral-800 text-neutral-400 hover:text-neutral-100 transition-colors"
            title={isFullscreen ? "缩小视图" : "全屏检视谱系"}
          >
            {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
          </button>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-neutral-950 border border-neutral-800 hover:bg-neutral-800 text-neutral-400 hover:text-neutral-100 transition-colors"
            title="关闭拓扑视图"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Main Split: D3 SVG Canvas (Left) + Node Inspector Card (Right) */}
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden relative">
        {/* Graph Canvas */}
        <div ref={containerRef} className="flex-1 w-full h-full relative bg-neutral-950 overflow-hidden select-none">
          <svg ref={svgRef} className="w-full h-full block cursor-grab active:cursor-grabbing" />

          {/* Canvas Floating Zoom & Legend Overlay */}
          <div className="absolute bottom-3 left-3 flex flex-col space-y-2 z-10">
            {/* Zoom Controls */}
            <div className="flex items-center space-x-1 p-1 rounded-lg bg-neutral-900/90 border border-neutral-800 backdrop-blur shadow">
              <button
                onClick={() => handleZoom(1.25)}
                className="p-1 text-neutral-400 hover:text-neutral-100 hover:bg-neutral-800 rounded transition-colors"
                title="放大"
              >
                <ZoomIn className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => handleZoom(0.8)}
                className="p-1 text-neutral-400 hover:text-neutral-100 hover:bg-neutral-800 rounded transition-colors"
                title="缩小"
              >
                <ZoomOut className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={handleResetZoom}
                className="p-1 text-neutral-400 hover:text-neutral-100 hover:bg-neutral-800 rounded transition-colors"
                title="重置居中"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Legend */}
            <div className="hidden sm:flex flex-wrap items-center gap-2 p-1.5 rounded-lg bg-neutral-900/80 border border-neutral-800 text-[9px] backdrop-blur">
              <div className="flex items-center space-x-1">
                <span className="w-2 h-2 rounded-full bg-amber-400" />
                <span className="text-neutral-300">主讲议题</span>
              </div>
              <div className="flex items-center space-x-1">
                <span className="w-2 h-2 rounded-full bg-sky-400" />
                <span className="text-neutral-300">本页引证文献</span>
              </div>
              <div className="flex items-center space-x-1">
                <span className="w-2 h-2 rounded-full bg-purple-400" />
                <span className="text-neutral-300">RAG 知识库原典</span>
              </div>
              <div className="flex items-center space-x-1">
                <span className="w-2 h-2 rounded-full bg-pink-500" />
                <span className="text-neutral-300">本体论概念</span>
              </div>
            </div>
          </div>

          {/* Quick Tip Floating Prompt */}
          <div className="absolute top-2 right-2 text-[10px] text-neutral-400/80 bg-neutral-900/60 px-2 py-1 rounded backdrop-blur pointer-events-none border border-neutral-800/40">
            🖱️ 支持拖拽节点、滚轮缩放、点击节点检视深层谱系
          </div>
        </div>

        {/* Right / Bottom Interactive RAG Literature Core Thesis Pop-out Drawer */}
        <div className={`${
          isDrawerWide ? 'w-full md:w-[540px] lg:w-[600px]' : 'w-full md:w-96 lg:w-[440px]'
        } bg-neutral-900/95 backdrop-blur-md border-t md:border-t-0 md:border-l border-neutral-800 flex flex-col transition-all duration-300 ease-in-out shadow-2xl relative z-20 overflow-hidden`}>
          {selectedNode && activeThesis ? (
            <div className="flex-1 flex flex-col h-full overflow-hidden">
              {/* Drawer Header */}
              <div className="p-3 bg-neutral-950/90 border-b border-neutral-800 space-y-2 shrink-0">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-1.5 flex-wrap gap-y-1">
                    <span
                      className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider"
                      style={{
                        backgroundColor: `${selectedNode.color}22`,
                        color: selectedNode.color,
                        border: `1px solid ${selectedNode.color}55`
                      }}
                    >
                      {selectedNode.category === 'topic' 
                        ? '🎯 研讨核心命题' 
                        : selectedNode.category === 'citation' 
                        ? '📜 课件引证文献' 
                        : selectedNode.category === 'knowledge' 
                        ? '🏛️ RAG 库原典源流' 
                        : '💎 本体论哲学范畴'}
                    </span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-neutral-800 text-neutral-300 border border-neutral-700 font-mono">
                      {activeThesis.ontologicalParadigm}
                    </span>
                    {selectedNode.similarity && (
                      <span className="text-[10px] font-mono text-emerald-400 font-medium">
                        相关度: {(selectedNode.similarity * 100).toFixed(1)}%
                      </span>
                    )}
                  </div>

                  <div className="flex items-center space-x-1 shrink-0 ml-1">
                    <button
                      onClick={handleCopyThesis}
                      className="p-1 rounded text-neutral-400 hover:text-amber-400 hover:bg-neutral-800 transition-colors"
                      title="复制完整论点摘要与形式化公理"
                    >
                      {copiedFeedback ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                    <button
                      onClick={() => setIsDrawerWide(!isDrawerWide)}
                      className="p-1 rounded text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800 transition-colors hidden sm:inline-flex"
                      title={isDrawerWide ? "收缩抽屉宽度" : "展宽抽屉详览"}
                    >
                      {isDrawerWide ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
                    </button>
                    <button
                      onClick={() => setSelectedNode(null)}
                      className="p-1 rounded text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800 transition-colors"
                      title="收起此抽屉"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div>
                  <h4 className="font-bold text-neutral-100 text-sm leading-snug line-clamp-2">
                    {activeThesis.sourceTitle}
                  </h4>
                  <div className="text-[11px] text-neutral-400 mt-0.5 flex items-center justify-between">
                    <span>{activeThesis.authors} {activeThesis.year && `(${activeThesis.year})`}</span>
                    <span className="text-amber-400/90 font-mono text-[10px]">{activeThesis.sectionOrPage}</span>
                  </div>

                  {/* Locate to Citation Slide Quick Action in Header */}
                  {activeThesis.targetSlideIndex && (
                    <div className="mt-2 flex items-center justify-between p-1.5 rounded-lg bg-sky-950/40 border border-sky-500/30 text-[11px]">
                      <div className="flex items-center space-x-1.5 min-w-0 pr-1">
                        <Compass className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                        <span className="text-neutral-300 truncate text-[11px]">
                          引用幻灯片：<strong className="text-sky-300 font-mono">P.{activeThesis.targetSlideIndex}</strong>
                          {activeThesis.targetSlideTitle && (
                            <span className="text-neutral-400 ml-1 truncate">《{activeThesis.targetSlideTitle}》</span>
                          )}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleLocateSlide(activeThesis.targetSlideIndex)}
                        className={`shrink-0 px-2 py-0.5 rounded text-[10px] font-bold flex items-center space-x-1 transition-all ${
                          currentSlide.index === activeThesis.targetSlideIndex
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                            : 'bg-sky-500 hover:bg-sky-400 text-neutral-950 shadow-sm'
                        }`}
                        title={currentSlide.index === activeThesis.targetSlideIndex ? '当前幻灯片即为该文献引用页' : `同步演示窗口至第 P.${activeThesis.targetSlideIndex} 页`}
                      >
                        <MapPin className="w-3 h-3" />
                        <span>{currentSlide.index === activeThesis.targetSlideIndex ? '当前已在引用页' : '定位到引用页'}</span>
                      </button>
                    </div>
                  )}
                </div>

                {/* Sub-Tabs */}
                <div className="flex items-center space-x-1 pt-1 border-t border-neutral-800/80">
                  <button
                    onClick={() => setDrawerTab('thesis')}
                    className={`flex-1 py-1 px-1.5 rounded text-[11px] font-semibold flex items-center justify-center space-x-1 transition-all ${
                      drawerTab === 'thesis'
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm'
                        : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800/50'
                    }`}
                  >
                    <BookOpen className="w-3 h-3" />
                    <span>核心论点</span>
                  </button>
                  <button
                    onClick={() => setDrawerTab('formal')}
                    className={`flex-1 py-1 px-1.5 rounded text-[11px] font-semibold flex items-center justify-center space-x-1 transition-all ${
                      drawerTab === 'formal'
                        ? 'bg-sky-500/20 text-sky-300 border border-sky-500/40 shadow-sm'
                        : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800/50'
                    }`}
                  >
                    <Scale className="w-3 h-3" />
                    <span>形式化推论</span>
                  </button>
                  <button
                    onClick={() => setDrawerTab('chunk')}
                    className={`flex-1 py-1 px-1.5 rounded text-[11px] font-semibold flex items-center justify-center space-x-1 transition-all ${
                      drawerTab === 'chunk'
                        ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40 shadow-sm'
                        : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800/50'
                    }`}
                  >
                    <FileText className="w-3 h-3" />
                    <span>原典切片</span>
                  </button>
                  <button
                    onClick={() => setDrawerTab('socratic')}
                    className={`flex-1 py-1 px-1.5 rounded text-[11px] font-semibold flex items-center justify-center space-x-1 transition-all ${
                      drawerTab === 'socratic'
                        ? 'bg-pink-500/20 text-pink-300 border border-pink-500/40 shadow-sm'
                        : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800/50'
                    }`}
                  >
                    <BrainCircuit className="w-3 h-3" />
                    <span>苏格拉底反诘</span>
                  </button>
                </div>
              </div>

              {/* Drawer Tab Content Body */}
              <div className="flex-1 overflow-y-auto p-3 text-xs space-y-3.5 scrollbar-thin">
                {/* 1. Core Thesis Tab */}
                {drawerTab === 'thesis' && (
                  <div className="space-y-3">
                    {/* Core Proposition Box */}
                    <div className="p-3 rounded-xl bg-neutral-950/80 border border-neutral-800 space-y-1.5">
                      <div className="text-[10px] font-bold text-amber-400 flex items-center space-x-1">
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>RAG 知识库核心学术论点 (Core Thesis)：</span>
                      </div>
                      <p className="text-neutral-200 text-xs leading-relaxed font-normal">
                        {activeThesis.coreThesis}
                      </p>
                    </div>

                    {/* Etymological & Genealogical Anchor */}
                    {activeThesis.etymologicalAnchor && (
                      <div className="p-2.5 rounded-xl bg-stone-950/80 border border-stone-800 space-y-1">
                        <div className="text-[10px] font-bold text-stone-300 flex items-center space-x-1">
                          <Quote className="w-3 h-3 text-amber-500" />
                          <span>概念词源考订与谱系锚定：</span>
                        </div>
                        <div className="text-[11px] font-semibold text-amber-300/90 font-mono">
                          {activeThesis.etymologicalAnchor.term} [{activeThesis.etymologicalAnchor.original}]
                        </div>
                        <p className="text-neutral-400 text-[11px] leading-relaxed">
                          {activeThesis.etymologicalAnchor.genealogy}
                        </p>
                      </div>
                    )}

                    {/* Epistemic Mapping to Slide */}
                    <div className="p-2.5 rounded-xl bg-indigo-950/30 border border-indigo-500/30 space-y-1">
                      <div className="flex items-center justify-between">
                        <div className="text-[10px] font-bold text-indigo-300 flex items-center space-x-1">
                          <Network className="w-3.5 h-3.5 text-indigo-400" />
                          <span>对研讨课件 (P.{activeThesis.targetSlideIndex || currentSlide.index}) 的本体论映射：</span>
                        </div>
                        {onNavigateSlide && activeThesis.targetSlideIndex && currentSlide.index !== activeThesis.targetSlideIndex && (
                          <button
                            type="button"
                            onClick={() => handleLocateSlide(activeThesis.targetSlideIndex)}
                            className="text-[10px] text-sky-400 hover:text-sky-300 font-semibold flex items-center space-x-0.5 underline decoration-sky-500/40"
                          >
                            <span>跳转至 P.{activeThesis.targetSlideIndex}</span>
                            <ArrowRight className="w-2.5 h-2.5" />
                          </button>
                        )}
                      </div>
                      <p className="text-neutral-300 text-[11px] leading-relaxed">
                        {activeThesis.epistemicMappingToSlide}
                      </p>
                    </div>

                    {/* Keywords */}
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {activeThesis.keywords.map((kw, i) => (
                        <span
                          key={i}
                          className="px-2 py-0.5 rounded-md bg-neutral-800 text-neutral-300 text-[10px] border border-neutral-700"
                        >
                          #{kw}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* 2. Formalized Logic Chain Tab (P ⊢ C) */}
                {drawerTab === 'formal' && (
                  <div className="space-y-3">
                    <div className="text-[11px] text-neutral-400 font-mono pb-1 border-b border-neutral-800 flex items-center justify-between">
                      <span>形式公理化系统重构</span>
                      <span className="text-amber-400 font-bold">P1, P2 ⊢ C</span>
                    </div>

                    {/* Explicit Premises */}
                    <div className="space-y-1.5">
                      <div className="text-[10px] font-bold text-sky-400 flex items-center space-x-1">
                        <Check className="w-3 h-3 text-sky-400" />
                        <span>明示公理前提 (Explicit Premises)：</span>
                      </div>
                      {activeThesis.formalizedArgument.explicitPremises.map((p, i) => (
                        <div key={i} className="p-2 rounded-lg bg-neutral-950/90 border border-neutral-800 font-mono text-[11px] text-neutral-200">
                          {p}
                        </div>
                      ))}
                    </div>

                    {/* Tacit / Suppressed Assumptions */}
                    <div className="space-y-1.5">
                      <div className="text-[10px] font-bold text-rose-400 flex items-center space-x-1">
                        <ShieldAlert className="w-3 h-3 text-rose-400" />
                        <span>隐涵/未言假设 (Suppressed/Tacit Assumptions)：</span>
                      </div>
                      {activeThesis.formalizedArgument.tacitAssumptions.map((a, i) => (
                        <div key={i} className="p-2 rounded-lg bg-rose-950/20 border border-rose-500/30 text-[11px] text-rose-200/90">
                          {a}
                        </div>
                      ))}
                    </div>

                    {/* Inference Chain */}
                    <div className="space-y-1.5">
                      <div className="text-[10px] font-bold text-amber-400 flex items-center space-x-1">
                        <ArrowRight className="w-3 h-3 text-amber-400" />
                        <span>形式推导推论链 (Inference Chain)：</span>
                      </div>
                      <div className="p-2.5 rounded-lg bg-neutral-950/90 border border-neutral-800 space-y-1.5 text-[11px] text-neutral-300 leading-relaxed">
                        {activeThesis.formalizedArgument.inferenceChain.map((step, i) => (
                          <div key={i} className="flex items-start space-x-1.5">
                            <span className="text-amber-500 font-bold shrink-0">⊢</span>
                            <span>{step}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Conclusion */}
                    <div className="p-2.5 rounded-lg bg-amber-500/10 border border-amber-500/40 text-[11px] text-amber-200 font-medium">
                      <span className="font-bold text-amber-400 block mb-1">【定理论点 (Conclusion)】</span>
                      {activeThesis.formalizedArgument.conclusion}
                    </div>

                    {/* Falsification Criteria */}
                    <div className="p-2 rounded-lg bg-neutral-950/80 border border-neutral-800 text-[10px] space-y-1">
                      <span className="font-bold text-neutral-400 flex items-center space-x-1">
                        <ShieldCheck className="w-3 h-3 text-emerald-400" />
                        <span>机器可证伪性检验标准 (Falsification Criteria)：</span>
                      </span>
                      <p className="text-neutral-400 leading-normal">
                        {activeThesis.formalizedArgument.falsificationCriteria}
                      </p>
                    </div>
                  </div>
                )}

                {/* 3. Verbatim Raw Chunk Tab */}
                {drawerTab === 'chunk' && (
                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between text-[10px] text-neutral-400 font-mono">
                      <span>RAG 知识库原始证据切片</span>
                      <span className="text-purple-400 font-bold">{activeThesis.documentId}</span>
                    </div>

                    <div className="p-3 rounded-xl bg-neutral-950/90 border border-neutral-800 font-mono text-[11px] leading-relaxed text-neutral-300 max-h-[360px] overflow-y-auto whitespace-pre-wrap selection:bg-purple-900/50">
                      {activeThesis.rawChunk}
                    </div>

                    <div className="p-2 rounded-lg bg-neutral-800/40 border border-neutral-700/50 text-[10px] text-neutral-400 flex items-center justify-between">
                      <span>出处：{activeThesis.sectionOrPage}</span>
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(`[RAG Citation] 《${activeThesis.sourceTitle}》 (${activeThesis.sectionOrPage})\n"${activeThesis.rawChunk}"`);
                          setCopiedFeedback(true);
                          setTimeout(() => setCopiedFeedback(false), 2000);
                        }}
                        className="text-amber-400 hover:text-amber-300 font-medium flex items-center space-x-1"
                      >
                        <Copy className="w-2.5 h-2.5" />
                        <span>复制引注</span>
                      </button>
                    </div>
                  </div>
                )}

                {/* 4. Socratic Inquiries Tab */}
                {drawerTab === 'socratic' && (
                  <div className="space-y-2.5">
                    <div className="text-[10px] font-bold text-pink-400 flex items-center space-x-1">
                      <HelpCircle className="w-3.5 h-3.5" />
                      <span>直击本论点形而上学危机的苏格拉底反诘：</span>
                    </div>

                    <div className="space-y-2">
                      {activeThesis.socraticQuestions.map((q, i) => (
                        <div
                          key={i}
                          className="p-3 rounded-xl bg-pink-950/15 border border-pink-500/30 hover:border-pink-500/60 transition-colors space-y-2"
                        >
                          <div className="text-neutral-200 text-xs leading-relaxed font-medium">
                            {q.replace(/\*\*/g, '')}
                          </div>
                          {onInjectQuestion && (
                            <button
                              onClick={() => {
                                onInjectQuestion(q.replace(/\*\*/g, ''));
                                onClose();
                              }}
                              className="inline-flex items-center space-x-1 text-[10px] px-2 py-1 rounded bg-pink-500/20 hover:bg-pink-500/30 text-pink-300 border border-pink-500/40 font-semibold transition-all"
                            >
                              <MessageSquare className="w-2.5 h-2.5" />
                              <span>以此题向研讨会发问</span>
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Drawer Footer Actions */}
              <div className="p-3 bg-neutral-950/90 border-t border-neutral-800 space-y-2 shrink-0">
                <div className="flex items-center space-x-2">
                  {onNavigateSlide && activeThesis.targetSlideIndex && (
                    <button
                      type="button"
                      onClick={() => handleLocateSlide(activeThesis.targetSlideIndex)}
                      className={`flex-1 flex items-center justify-center space-x-1.5 py-2 px-2.5 rounded-lg text-xs font-bold transition-all shadow-sm ${
                        currentSlide.index === activeThesis.targetSlideIndex
                          ? 'bg-neutral-800 text-neutral-300 border border-neutral-700 hover:bg-neutral-750'
                          : 'bg-sky-600 hover:bg-sky-500 text-white'
                      }`}
                      title={`自动同步演示窗口至 Slide P.${activeThesis.targetSlideIndex}`}
                    >
                      <Compass className="w-3.5 h-3.5 shrink-0" />
                      <span className="truncate">
                        {currentSlide.index === activeThesis.targetSlideIndex 
                          ? `已在引用页 P.${activeThesis.targetSlideIndex}` 
                          : `定位到引用页 (P.${activeThesis.targetSlideIndex})`}
                      </span>
                    </button>
                  )}

                  {onInjectQuestion && (
                    <button
                      type="button"
                      onClick={() => {
                        const q = `请结合文献《${activeThesis.sourceTitle}》（${activeThesis.sectionOrPage}）关于“${activeThesis.coreThesis.slice(0, 48)}...”的核心论断，从可计算本体论与形式化公理角度深度辨析其对当前第 P.${currentSlide.index} 页命题的支撑与潜在危机。`;
                        onInjectQuestion(q);
                        onClose();
                      }}
                      className="flex-1 flex items-center justify-center space-x-1.5 py-2 px-2.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-xs shadow-md transition-all group"
                    >
                      <MessageSquare className="w-3.5 h-3.5 group-hover:scale-110 transition-transform shrink-0" />
                      <span className="truncate">代入研讨池发问</span>
                    </button>
                  )}
                </div>

                <div className="flex items-center justify-between text-[10px] text-neutral-500 px-1">
                  <span>💡 点击画布任意其他节点可无缝切换核心论点</span>
                  {locateSuccessFeedback ? (
                    <span className="text-sky-400 font-semibold animate-pulse flex items-center space-x-1">
                      <Check className="w-3 h-3 text-sky-400" />
                      <span>{locateSuccessFeedback}</span>
                    </span>
                  ) : copiedFeedback ? (
                    <span className="text-emerald-400 font-semibold animate-pulse">✓ 已复制论点摘要</span>
                  ) : null}
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-center text-neutral-500 p-6 space-y-3">
              <div className="p-3 rounded-2xl bg-neutral-950 border border-neutral-800 text-neutral-400">
                <Compass className="w-8 h-8 stroke-[1.5]" />
              </div>
              <div className="space-y-1 max-w-[260px]">
                <h5 className="text-neutral-300 font-semibold text-xs">交互式文献节点检视器</h5>
                <p className="text-[11px] text-neutral-500 leading-relaxed">
                  点击左侧力导向图谱中的任意文献或概念节点，即可在此处展开其在 RAG 知识库中的核心论点摘要、形式化公理链 (P⊢C) 与苏格拉底反诘。
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
