import React, { useState, useEffect, useRef } from 'react';
import ReactECharts from 'echarts-for-react';
import { 
  Play, 
  Settings2, 
  Code2, 
  LineChart as ChartIcon, 
  Terminal, 
  Cpu, 
  Sliders, 
  ArrowLeft,
  Workflow,
  AlertTriangle,
  GitCompare
} from 'lucide-react';
import { SIMULATION_TEMPLATES, SimulationTemplate, SimulationRunResult } from '../data/simulationTemplates';
import { executeCustomCodeSimulation } from '../utils/customCodeExecutor';
import {
  DEMO_PRESETS_BY_TEMPLATE,
  DemoPresetId,
  buildSandboxRunSummary
} from '../data/sandboxDemoPresets';

interface CodeSandboxProps {
  customCode?: string;
  customTitle?: string;
  /** P2-1：从课件深链打开指定模板 */
  initialTemplateId?: string;
  slideIndex?: number;
  onClose?: () => void;
  /** P2-3：真仿真跑完后把结论写回研讨流 */
  onRunComplete?: (summaryMarkdown: string) => void;
}

export const CodeSandbox: React.FC<CodeSandboxProps> = ({
  customCode,
  customTitle,
  initialTemplateId,
  slideIndex = 1,
  onClose,
  onRunComplete
}) => {
  const resolveInitial = (): SimulationTemplate => {
    if (initialTemplateId) {
      return SIMULATION_TEMPLATES.find(t => t.id === initialTemplateId) || SIMULATION_TEMPLATES[0];
    }
    return SIMULATION_TEMPLATES[0];
  };

  const initial = resolveInitial();
  const [selectedTemplate, setSelectedTemplate] = useState<SimulationTemplate>(initial);
  const [params, setParams] = useState<Record<string, any>>({ ...initial.defaultParams });
  const [editableCode, setEditableCode] = useState<string>(initial.code);
  const [runResult, setRunResult] = useState<SimulationRunResult | null>(null);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'editor' | 'params'>('params');
  const [isCustomMode, setIsCustomMode] = useState<boolean>(false);
  const [customModelTitle, setCustomModelTitle] = useState<string>('');
  const [activePreset, setActivePreset] = useState<DemoPresetId | null>(null);
  const lastSummaryRef = useRef<string>('');

  // P2-1：外部指定模板时切换到真仿真
  useEffect(() => {
    if (!initialTemplateId) return;
    const tmpl = SIMULATION_TEMPLATES.find(t => t.id === initialTemplateId);
    if (!tmpl) return;
    setIsCustomMode(false);
    setSelectedTemplate(tmpl);
    setParams({ ...tmpl.defaultParams });
    setEditableCode(tmpl.code);
    setActiveTab('params');
    setActivePreset(null);
    const result = tmpl.run(tmpl.defaultParams);
    setRunResult(result);
  }, [initialTemplateId]);

  // 自定义/规则合成代码：预览模式
  useEffect(() => {
    if (customCode && customCode.trim().length > 0 && !initialTemplateId) {
      setEditableCode(customCode);
      setIsCustomMode(true);
      setActiveTab('editor');
      const title = customTitle || '规则合成预览模型';
      setCustomModelTitle(title);
      setIsRunning(true);
      const timer = setTimeout(() => {
        try {
          const result = executeCustomCodeSimulation(customCode, title, params);
          setRunResult(result);
        } catch (err) {
          console.error('Custom simulation execution error:', err);
        } finally {
          setIsRunning(false);
        }
      }, 150);
      return () => clearTimeout(timer);
    }
  }, [customCode, customTitle, initialTemplateId]);

  const presets = !isCustomMode ? DEMO_PRESETS_BY_TEMPLATE[selectedTemplate.id] || [] : [];

  const handleSelectTemplate = (tmpl: SimulationTemplate) => {
    setIsCustomMode(false);
    setSelectedTemplate(tmpl);
    setParams({ ...tmpl.defaultParams });
    setEditableCode(tmpl.code);
    setActivePreset(null);
    setActiveTab('params');
    setRunResult(tmpl.run(tmpl.defaultParams));
  };

  const handleApplyPreset = (presetId: DemoPresetId) => {
    const preset = presets.find(p => p.id === presetId);
    if (!preset) return;
    const nextParams = { ...selectedTemplate.defaultParams, ...preset.params };
    setParams(nextParams);
    setActivePreset(presetId);
    setIsCustomMode(false);
    setActiveTab('params');
    runTemplate(nextParams, preset.label);
  };

  const handleParamChange = (key: string, value: any) => {
    setActivePreset(null);
    setParams(prev => ({ ...prev, [key]: value }));
  };

  const emitRunSummary = (
    result: SimulationRunResult,
    runParams: Record<string, any>,
    presetLabel?: string
  ) => {
    if (isCustomMode || !onRunComplete) return;
    const md = buildSandboxRunSummary({
      templateId: selectedTemplate.id,
      templateName: selectedTemplate.name,
      slideIndex,
      presetLabel,
      params: runParams,
      result
    });
    if (md === lastSummaryRef.current) return;
    lastSummaryRef.current = md;
    onRunComplete(md);
  };

  const runTemplate = (runParams: Record<string, any>, presetLabel?: string) => {
    setIsRunning(true);
    setTimeout(() => {
      try {
        const result = selectedTemplate.run(runParams);
        setRunResult(result);
        emitRunSummary(result, runParams, presetLabel);
      } catch (err) {
        console.error('Simulation execution error:', err);
      } finally {
        setIsRunning(false);
      }
    }, 180);
  };

  const handleRun = () => {
    if (isCustomMode && editableCode) {
      setIsRunning(true);
      setTimeout(() => {
        try {
          const result = executeCustomCodeSimulation(
            editableCode,
            customModelTitle || '自定义状态机',
            params
          );
          setRunResult(result);
        } catch (err) {
          console.error('Simulation execution error:', err);
        } finally {
          setIsRunning(false);
        }
      }, 200);
      return;
    }
    runTemplate(params, activePreset ? presets.find(p => p.id === activePreset)?.label : undefined);
  };

  useEffect(() => {
    if (!customCode && !initialTemplateId) {
      setRunResult(selectedTemplate.run(selectedTemplate.defaultParams));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getEChartsOption = () => {
    if (!runResult) return {};
    return {
      backgroundColor: '#0a0a0a',
      title: {
        text: runResult.chartTitle,
        textStyle: { color: '#e5e5e5', fontSize: 14, fontWeight: 600 },
        left: 10,
        top: 10
      },
      tooltip: {
        trigger: 'axis',
        backgroundColor: 'rgba(23, 23, 23, 0.9)',
        borderColor: '#404040',
        textStyle: { color: '#f5f5f5' }
      },
      legend: { bottom: 10, textStyle: { color: '#a3a3a3' } },
      grid: { left: '4%', right: '4%', bottom: '14%', top: '18%', containLabel: true },
      xAxis: {
        ...runResult.xAxis,
        axisLine: { lineStyle: { color: '#404040' } },
        axisLabel: { color: '#a3a3a3' },
        splitLine: { lineStyle: { color: '#1f1f1f' } }
      },
      yAxis: Array.isArray(runResult.yAxis)
        ? runResult.yAxis.map((ya: any) => ({
            ...ya,
            axisLine: { lineStyle: { color: '#404040' } },
            axisLabel: { color: '#a3a3a3' },
            splitLine: { lineStyle: { color: '#1f1f1f' } }
          }))
        : {
            ...runResult.yAxis,
            axisLine: { lineStyle: { color: '#404040' } },
            axisLabel: { color: '#a3a3a3' },
            splitLine: { lineStyle: { color: '#1f1f1f' } }
          },
      series: runResult.series
    };
  };

  return (
    <div className="flex-1 flex flex-col bg-neutral-950 text-neutral-100 overflow-hidden select-text">
      <div className="p-3 bg-neutral-900 border-b border-neutral-800 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center space-x-2">
          {onClose && (
            <button
              onClick={onClose}
              className="p-1.5 rounded-md hover:bg-neutral-800 text-neutral-400 hover:text-neutral-100 transition-colors mr-1"
              title="返回讲稿研讨"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
          )}
          <div className="p-1.5 rounded-md bg-amber-500/10 border border-amber-500/30 text-amber-400">
            <Cpu className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-neutral-100 flex items-center space-x-2">
              <span>可执行多智能体代码沙盒</span>
              {isCustomMode ? (
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-500/15 text-amber-200 border border-amber-500/40 font-medium flex items-center space-x-1">
                  <Workflow className="w-3 h-3 text-amber-400" />
                  <span>可视化预览 · 非真实执行</span>
                </span>
              ) : (
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/15 text-emerald-300 border border-emerald-500/35 font-normal">
                  可调参真仿真
                </span>
              )}
            </h2>
            <p className="text-xs text-neutral-400">
              {isCustomMode
                ? `预览模式：${customModelTitle || '规则合成代码'} — 关键词路由预制曲线`
                : '模板仿真：参数真实参与计算；可用「温和 / 极端」一键对比'}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <select
            value={isCustomMode ? 'custom-active' : selectedTemplate.id}
            onChange={(e) => {
              if (e.target.value === 'custom-active') {
                setIsCustomMode(true);
                if (customCode) setEditableCode(customCode);
                return;
              }
              const tmpl = SIMULATION_TEMPLATES.find(t => t.id === e.target.value);
              if (tmpl) handleSelectTemplate(tmpl);
            }}
            className="bg-neutral-950 border border-neutral-700 text-neutral-200 text-xs rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-amber-500"
          >
            {isCustomMode && (
              <option value="custom-active">
                ⚡ [预览] {customModelTitle || '导入的代码模型'}
              </option>
            )}
            {SIMULATION_TEMPLATES.map(t => (
              <option key={t.id} value={t.id}>
                [{t.category === 'philosophy' ? '哲学' : t.category === 'history' ? '历史' : t.category === 'mathematics' ? '数学' : '智能体'}] {t.name}
              </option>
            ))}
          </select>

          <button
            onClick={handleRun}
            disabled={isRunning}
            className="flex items-center space-x-1.5 px-3.5 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-neutral-950 text-xs font-bold shadow transition-all"
          >
            <Play className={`w-3.5 h-3.5 ${isRunning ? 'animate-spin' : ''}`} />
            <span>{isRunning ? '求解运行中...' : isCustomMode ? '生成预览曲线' : '运行沙盘仿真'}</span>
          </button>
        </div>
      </div>

      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        <div className="w-full lg:w-5/12 bg-neutral-950 border-r border-neutral-800 flex flex-col overflow-hidden">
          <div className="flex items-center border-b border-neutral-800 bg-neutral-900/60 px-3 text-xs">
            <button
              onClick={() => setActiveTab('editor')}
              className={`flex items-center space-x-1.5 py-2 px-3 border-b-2 font-medium transition-colors ${
                activeTab === 'editor'
                  ? 'border-amber-500 text-amber-400'
                  : 'border-transparent text-neutral-400 hover:text-neutral-200'
              }`}
            >
              <Code2 className="w-3.5 h-3.5" />
              <span>BDI 代码模型 (IDE)</span>
            </button>
            <button
              onClick={() => setActiveTab('params')}
              className={`flex items-center space-x-1.5 py-2 px-3 border-b-2 font-medium transition-colors ${
                activeTab === 'params'
                  ? 'border-amber-500 text-amber-400'
                  : 'border-transparent text-neutral-400 hover:text-neutral-200'
              }`}
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>动力学参数调优</span>
            </button>
          </div>

          <div className="flex-1 p-4 overflow-y-auto space-y-4 text-xs">
            {activeTab === 'editor' ? (
              <div className="flex flex-col h-full space-y-2">
                {isCustomMode && (
                  <div className="p-2.5 rounded-lg bg-amber-950/40 border border-amber-500/40 flex items-start text-[11px] text-amber-100 gap-2">
                    <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                    <span>
                      <strong>诚实标签：</strong>规则合成/自定义代码不会执行。
                      图表为关键词<strong>可视化预览</strong>。真调参请切到内置模板。
                    </span>
                  </div>
                )}
                <textarea
                  value={editableCode}
                  onChange={(e) => {
                    setEditableCode(e.target.value);
                    if (!isCustomMode) setIsCustomMode(true);
                  }}
                  className="flex-1 w-full bg-neutral-900 border border-neutral-800 font-mono text-xs text-amber-200 p-3 rounded-lg focus:outline-none focus:border-amber-500 resize-none leading-relaxed min-h-[380px]"
                  rows={20}
                />
              </div>
            ) : (
              <div className="space-y-4">
                <div className="p-3 rounded-lg bg-neutral-900 border border-neutral-800">
                  <div className="font-semibold text-neutral-200 mb-1">
                    {isCustomMode ? customModelTitle || '预览模型' : selectedTemplate.name}
                  </div>
                  <p className="text-neutral-400 leading-relaxed text-[11px]">
                    {isCustomMode
                      ? '预览模式不写研讨结论。切换模板后运行，才会把调参结论写入研讨流。'
                      : selectedTemplate.description}
                  </p>
                </div>

                {/* P2-2 演讲预设 */}
                {!isCustomMode && presets.length > 0 && (
                  <div className="space-y-2">
                    <div className="text-neutral-300 font-semibold text-xs flex items-center space-x-1">
                      <GitCompare className="w-3.5 h-3.5 text-sky-400" />
                      <span>演讲预设一键对比</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      {presets.map(p => (
                        <button
                          key={p.id}
                          type="button"
                          onClick={() => handleApplyPreset(p.id)}
                          disabled={isRunning}
                          className={`text-left p-2.5 rounded-lg border text-[11px] transition-all ${
                            activePreset === p.id
                              ? 'bg-sky-500/20 border-sky-500/50 text-sky-100'
                              : 'bg-neutral-900 border-neutral-800 text-neutral-300 hover:border-sky-500/40'
                          }`}
                        >
                          <div className="font-bold mb-0.5">{p.label}</div>
                          <div className="text-neutral-400 leading-snug">{p.blurb}</div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <div className="space-y-3">
                  <div className="text-neutral-300 font-semibold text-xs flex items-center space-x-1">
                    <Settings2 className="w-3.5 h-3.5 text-amber-400" />
                    <span>微观动力学调节滑块</span>
                  </div>
                  {Object.entries(params).map(([key, val]) => (
                    <div key={key} className="p-2.5 rounded bg-neutral-900 border border-neutral-800 space-y-1">
                      <div className="flex justify-between text-[11px]">
                        <span className="font-mono text-neutral-300">{key}</span>
                        <span className="font-mono text-amber-400 font-semibold">{String(val)}</span>
                      </div>
                      <input
                        type="range"
                        min={typeof val === 'number' && val <= 2 ? '0.05' : '10'}
                        max={typeof val === 'number' && val <= 2 ? '2.0' : '100'}
                        step={typeof val === 'number' && val <= 2 ? '0.05' : '5'}
                        value={Number(val)}
                        onChange={(e) => handleParamChange(key, parseFloat(e.target.value))}
                        className="w-full accent-amber-500 cursor-pointer h-1 bg-neutral-800 rounded-lg appearance-none"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="flex-1 flex flex-col bg-neutral-950 overflow-hidden">
          <div className="px-3 py-2 border-b border-neutral-800 flex items-center space-x-2 text-xs text-neutral-400">
            <ChartIcon className="w-3.5 h-3.5 text-amber-400" />
            <span>动力学相变图谱 / 指标卡</span>
          </div>
          <div className="flex-1 p-2 min-h-[280px]">
            {runResult ? (
              <ReactECharts option={getEChartsOption()} style={{ height: '100%', minHeight: 320 }} />
            ) : (
              <div className="h-full flex items-center justify-center text-neutral-500 text-xs">等待运行…</div>
            )}
          </div>
          {runResult && (
            <div className="border-t border-neutral-800 p-3 grid grid-cols-1 md:grid-cols-3 gap-2">
              {runResult.summaryMetrics.map((m, i) => (
                <div key={i} className="p-2 rounded-lg bg-neutral-900 border border-neutral-800 text-[11px]">
                  <div className="text-neutral-400">{m.label}</div>
                  <div className="text-neutral-100 font-semibold mt-0.5">{m.value}</div>
                  {m.change && <div className="text-amber-400/80 text-[10px] mt-0.5">{m.change}</div>}
                </div>
              ))}
            </div>
          )}
          {runResult?.agentLogs?.length ? (
            <div className="border-t border-neutral-800 p-3 max-h-28 overflow-y-auto text-[10px] text-neutral-400 space-y-1">
              <div className="flex items-center gap-1 text-neutral-300 font-semibold mb-1">
                <Terminal className="w-3 h-3" />
                <span>运行日志</span>
              </div>
              {runResult.agentLogs.map((log, i) => (
                <div key={i} className="font-mono">· {log}</div>
              ))}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};
