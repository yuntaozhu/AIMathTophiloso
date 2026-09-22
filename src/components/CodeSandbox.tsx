import React, { useState, useEffect } from 'react';
import ReactECharts from 'echarts-for-react';
import { 
  Play, 
  RotateCcw, 
  Settings2, 
  Code2, 
  LineChart as ChartIcon, 
  Terminal, 
  Cpu, 
  Sliders, 
  FileText,
  Sparkles,
  ArrowLeft,
  Layers,
  Workflow,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';
import { SIMULATION_TEMPLATES, SimulationTemplate, SimulationRunResult } from '../data/simulationTemplates';
import { executeCustomCodeSimulation } from '../utils/customCodeExecutor';

interface CodeSandboxProps {
  customCode?: string;
  customTitle?: string;
  onClose?: () => void;
}

export const CodeSandbox: React.FC<CodeSandboxProps> = ({
  customCode,
  customTitle,
  onClose
}) => {
  const [selectedTemplate, setSelectedTemplate] = useState<SimulationTemplate>(SIMULATION_TEMPLATES[0]);
  const [params, setParams] = useState<Record<string, any>>(SIMULATION_TEMPLATES[0].defaultParams);
  const [editableCode, setEditableCode] = useState<string>(SIMULATION_TEMPLATES[0].code);
  const [runResult, setRunResult] = useState<SimulationRunResult | null>(null);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'editor' | 'params'>('params');
  const [isCustomMode, setIsCustomMode] = useState<boolean>(false);
  const [customModelTitle, setCustomModelTitle] = useState<string>('');

  // Synchronize when customCode prop arrives (e.g. from KaibanJS or Chat)
  useEffect(() => {
    if (customCode && customCode.trim().length > 0) {
      setEditableCode(customCode);
      setIsCustomMode(true);
      setActiveTab('editor'); // Immediately bring user to Code Editor view to inspect the imported state machine
      const title = customTitle || 'KaibanJS 状态机模型';
      setCustomModelTitle(title);
      
      // Execute the newly imported code simulation
      setIsRunning(true);
      const timer = setTimeout(() => {
        try {
          const result = executeCustomCodeSimulation(customCode, title, params);
          setRunResult(result);
        } catch (err) {
          console.error("Custom simulation execution error:", err);
        } finally {
          setIsRunning(false);
        }
      }, 150);

      return () => clearTimeout(timer);
    }
  }, [customCode, customTitle]);

  const handleSelectTemplate = (tmpl: SimulationTemplate) => {
    setIsCustomMode(false);
    setSelectedTemplate(tmpl);
    setParams(tmpl.defaultParams);
    setEditableCode(tmpl.code);
    setRunResult(tmpl.run(tmpl.defaultParams));
  };

  const handleParamChange = (key: string, value: any) => {
    const updated = { ...params, [key]: value };
    setParams(updated);
  };

  const handleRun = () => {
    setIsRunning(true);
    setTimeout(() => {
      try {
        if (isCustomMode && editableCode) {
          const result = executeCustomCodeSimulation(editableCode, customModelTitle || '自定义状态机', params);
          setRunResult(result);
        } else {
          const result = selectedTemplate.run(params);
          setRunResult(result);
        }
      } catch (err) {
        console.error("Simulation execution error:", err);
      } finally {
        setIsRunning(false);
      }
    }, 200);
  };

  useEffect(() => {
    // Initial run only if not in custom mode
    if (!customCode) {
      setRunResult(selectedTemplate.run(selectedTemplate.defaultParams));
    }
  }, []);

  // Configure ECharts options
  const getEChartsOption = () => {
    if (!runResult) return {};

    return {
      backgroundColor: '#0a0a0a',
      title: {
        text: runResult.chartTitle,
        textStyle: {
          color: '#e5e5e5',
          fontSize: 14,
          fontWeight: 600
        },
        left: 10,
        top: 10
      },
      tooltip: {
        trigger: 'axis',
        backgroundColor: 'rgba(23, 23, 23, 0.9)',
        borderColor: '#404040',
        textStyle: { color: '#f5f5f5' }
      },
      legend: {
        bottom: 10,
        textStyle: { color: '#a3a3a3' }
      },
      grid: {
        left: '4%',
        right: '4%',
        bottom: '14%',
        top: '18%',
        containLabel: true
      },
      xAxis: {
        ...runResult.xAxis,
        axisLine: { lineStyle: { color: '#404040' } },
        axisLabel: { color: '#a3a3a3' },
        splitLine: { lineStyle: { color: '#1f1f1f' } }
      },
      yAxis: Array.isArray(runResult.yAxis) ? runResult.yAxis.map((ya: any) => ({
        ...ya,
        axisLine: { lineStyle: { color: '#404040' } },
        axisLabel: { color: '#a3a3a3' },
        splitLine: { lineStyle: { color: '#1f1f1f' } }
      })) : {
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
      {/* Sandbox Top Control Bar */}
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
                ? `预览模式：${customModelTitle || 'Kaiban/自定义代码'} — 按关键词路由预制曲线，不执行源码`
                : '模板仿真：参数会真实参与计算并重绘 ECharts'}
            </p>
          </div>
        </div>

        {/* Template Selector & Run Button */}
        <div className="flex items-center space-x-2">
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
                ⚡ [KaibanJS 状态机] {customModelTitle || '导入的代码模型'}
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

      {/* Main Workspace Split: Left Controls/Code, Right ECharts/Metrics */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        {/* Left Column: Code Editor & Parameter Sliders */}
        <div className="w-full lg:w-5/12 bg-neutral-950 border-r border-neutral-800 flex flex-col overflow-hidden">
          {/* Sub Tabs */}
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
              {isCustomMode && (
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              )}
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
                      <strong>诚实标签：</strong>自定义/Kaiban 代码不会在浏览器中执行。
                      下方图表是按标题与关键词匹配的<strong>可视化预览</strong>。
                      需要真调参请切换到罗尔斯 / PDE / 明清 / 记忆流等模板。
                    </span>
                  </div>
                )}
                <div className="flex items-center justify-between text-[11px] text-neutral-400">
                  <span>JavaScript / TypeScript 模型源码：</span>
                  <span className="text-[10px] text-neutral-500 font-mono">
                    {isCustomMode ? '预览路由 · 非 eval' : '模板 run() 真计算'}
                  </span>
                </div>
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
                    {isCustomMode ? (customModelTitle || 'KaibanJS 状态机模型') : selectedTemplate.name}
                  </div>
                  <p className="text-neutral-400 leading-relaxed text-[11px]">
                    {isCustomMode 
                      ? '预览说明：曲线由关键词路由生成，用于现场叙事对照，不代表源码已在沙盒中执行。切换到内置模板可进行真实参数扰动。' 
                      : selectedTemplate.description}
                  </p>
                  <div className="mt-2 text-[10px] text-amber-400/80 font-mono">
                    理论锚点: {isCustomMode ? '可计算认识论与机器可证伪性闭环' : selectedTemplate.theoryRef}
                  </div>
                </div>

                {/* Sliders for current template parameters */}
                <div className="space-y-3">
                  <div className="text-neutral-300 font-semibold text-xs flex items-center space-x-1">
                    <Settings2 className="w-3.5 h-3.5 text-amber-400" />
                    <span>微观动力学调节滑块</span>
                  </div>

                  {Object.entries(params).map(([key, val]) => (
                    <div key={key} className="p-2.5 rounded bg-neutral-900 border border-neutral-800 space-y-1">
                      <div className="flex justify-between text-[11px]">
                        <span className="font-mono text-neutral-300">{key}</span>
                        <span className="font-mono text-amber-400 font-semibold">{val}</span>
                      </div>
                      <input
                        type="range"
                        min={typeof val === 'number' && val <= 1 ? "0.05" : "10"}
                        max={typeof val === 'number' && val <= 1 ? "1.0" : "100"}
                        step={typeof val === 'number' && val <= 1 ? "0.05" : "5"}
                        value={val}
                        onChange={(e) => handleParamChange(key, parseFloat(e.target.value))}
                        className="w-full accent-amber-500 cursor-pointer h-1 bg-neutral-800 rounded-lg appearance-none"
                      />
                    </div>
                  ))}
                </div>

                <div className="p-3 rounded-lg bg-amber-950/20 border border-amber-900/30 text-[11px] text-amber-300/90 leading-relaxed">
                  💡 提示：拖动滑块后点击“运行沙盘仿真”，观察右侧相变界面的分叉、基尼系数剧变或吸引盆爆破。
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Dynamic ECharts Visualizer & Summary Logs */}
        <div className="w-full lg:w-7/12 flex flex-col bg-neutral-950 overflow-hidden">
          {/* Chart Container */}
          <div className="flex-1 min-h-[340px] p-2 bg-neutral-950">
            {runResult ? (
              <ReactECharts
                option={getEChartsOption()}
                style={{ height: '100%', width: '100%' }}
                opts={{ renderer: 'canvas' }}
              />
            ) : (
              <div className="h-full flex items-center justify-center text-neutral-500 text-xs">
                正在加载图表数据...
              </div>
            )}
          </div>

          {/* Bottom Metrics & Micro-History Logs */}
          <div className="border-t border-neutral-800 bg-neutral-900 p-3 space-y-3">
            {/* Key Metric Badges */}
            {runResult && runResult.summaryMetrics && (
              <div className="grid grid-cols-3 gap-2">
                {runResult.summaryMetrics.map((m, i) => (
                  <div key={i} className="p-2 rounded bg-neutral-950 border border-neutral-800">
                    <div className="text-[10px] text-neutral-400">{m.label}</div>
                    <div className="text-sm md:text-base font-bold text-amber-400 font-mono mt-0.5">
                      {m.value}
                    </div>
                    {m.change && (
                      <div className="text-[10px] text-neutral-500 mt-0.5">{m.change}</div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Micro-Historical Deep Description Logs */}
            {runResult && runResult.agentLogs && runResult.agentLogs.length > 0 && (
              <div className="p-2.5 rounded bg-neutral-950 border border-neutral-800 text-[11px] space-y-1">
                <div className="font-semibold text-neutral-300 flex items-center space-x-1">
                  <Terminal className="w-3 h-3 text-amber-400" />
                  <span>内循环微观史学深描日志 (Hermeneutic Logs)</span>
                </div>
                {runResult.agentLogs.map((log, idx) => (
                  <div key={idx} className="text-neutral-400 font-mono text-[10px] leading-relaxed">
                    {log}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
