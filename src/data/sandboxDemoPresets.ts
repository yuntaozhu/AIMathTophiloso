import { SIMULATION_TEMPLATES, SimulationRunResult } from './simulationTemplates';
import { SuggestedTool, SANDBOX_TEMPLATE_BY_TOOL, getPresenterPaceHint } from './presenterPaceHints';

export type DemoPresetId = 'mild' | 'extreme';

export interface DemoPreset {
  id: DemoPresetId;
  label: string;
  blurb: string;
  params: Record<string, number | boolean>;
}

/** 演讲现场一键对比：温和 vs 极端（P2-2） */
export const DEMO_PRESETS_BY_TEMPLATE: Record<string, DemoPreset[]> = {
  'rawls-veil': [
    {
      id: 'mild',
      label: '温和',
      blurb: '低匮乏 · 弱马基雅维利，契约大致可维持',
      params: { agentCount: 50, scarcityShock: 0.25, machiavellianWeight: 0.2, redistributionRate: 0.3 }
    },
    {
      id: 'extreme',
      label: '极端匮乏',
      blurb: '高匮乏冲击 · 强自利偏置，观察遵从率断崖',
      params: { agentCount: 50, scarcityShock: 0.85, machiavellianWeight: 0.75, redistributionRate: 0.35 }
    }
  ],
  'ming-qing-fiscal': [
    {
      id: 'mild',
      label: '温和',
      blurb: '白银缓缩 · 宗族庇护较弱，财政尚可支撑',
      params: { silverInflowShock: 0.35, clansProtectionFactor: 0.3, bureaucracyCorruption: 0.25 }
    },
    {
      id: 'extreme',
      label: '极端紧缩',
      blurb: '白银断流 · 宗族避税与胥吏加派叠加',
      params: { silverInflowShock: 0.9, clansProtectionFactor: 0.75, bureaucracyCorruption: 0.7 }
    }
  ],
  'pde-codim1-manifold': [
    {
      id: 'mild',
      label: '窄窗扫描',
      blurb: 'σ 窄区间，侧重观察局部相界形态',
      params: { sigmaMin: 0.6, sigmaMax: 1.2, steps: 10 }
    },
    {
      id: 'extreme',
      label: '宽域扫描',
      blurb: 'σ 宽区间，对照耗散盆 vs 爆破区',
      params: { sigmaMin: 0.5, sigmaMax: 1.8, steps: 14 }
    }
  ],
  'stanford-agent-memory': [
    {
      id: 'mild',
      label: '温和',
      blurb: '相关度主导检索，合作记忆更易浮现',
      params: { alphaRecency: 0.4, betaImportance: 0.6, gammaRelevance: 1.4, decayLambda: 0.995 }
    },
    {
      id: 'extreme',
      label: '极端偏置',
      blurb: '新近度压倒相关度，模拟信息茧房',
      params: { alphaRecency: 1.8, betaImportance: 0.3, gammaRelevance: 0.2, decayLambda: 0.99 }
    }
  ]
};

/** 页码 → 沙盒模板 ID（P2-1；含开场 15 页偏移） */
export const SLIDE_TO_SANDBOX_TEMPLATE: Record<number, string> = {
  36: 'pde-codim1-manifold',
  37: 'pde-codim1-manifold',
  46: 'stanford-agent-memory',
  47: 'stanford-agent-memory',
  67: 'rawls-veil',
  68: 'rawls-veil',
  77: 'ming-qing-fiscal',
  78: 'ming-qing-fiscal'
};

export function resolveSandboxTemplateId(slideIndex: number): string | null {
  if (SLIDE_TO_SANDBOX_TEMPLATE[slideIndex]) {
    return SLIDE_TO_SANDBOX_TEMPLATE[slideIndex];
  }
  const tool = getPresenterPaceHint(slideIndex).tool;
  return SANDBOX_TEMPLATE_BY_TOOL[tool as SuggestedTool] || null;
}

export function getTemplateById(templateId: string) {
  return SIMULATION_TEMPLATES.find(t => t.id === templateId) || null;
}

/** 将一次真仿真跑分写成研讨流摘要（P2-3） */
export function buildSandboxRunSummary(opts: {
  templateId: string;
  templateName: string;
  slideIndex: number;
  presetLabel?: string;
  params: Record<string, number | boolean>;
  result: SimulationRunResult;
}): string {
  const paramLine = Object.entries(opts.params)
    .map(([k, v]) => `${k}=${v}`)
    .join(', ');
  const metrics = (opts.result.summaryMetrics || [])
    .slice(0, 3)
    .map(m => `- **${m.label}**：${m.value}${m.change ? `（${m.change}）` : ''}`)
    .join('\n');
  const oneLiner =
    opts.result.summaryMetrics?.[0]
      ? `${opts.result.summaryMetrics[0].label} → ${opts.result.summaryMetrics[0].value}`
      : '仿真已完成，见右侧曲线。';

  return `### 沙盒调参结论（Slide P.${opts.slideIndex}）

**模板**：${opts.templateName}  
**预设**：${opts.presetLabel || '自定义滑块'}  
**关键参数**：\`${paramLine}\`

${metrics || '- （无摘要指标）'}

**一句话**：${oneLiner}
`;
}
