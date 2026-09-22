/**
 * Phase 5 核心单测：用 Node 内置 test runner（无需 vitest）。
 * 运行：npm test
 */
import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { searchKnowledgeBase } from '../src/data/knowledgeBase.ts';
import { runCitationGate, runHarnessDemo } from '../src/services/harnessRunner.ts';
import { buildStructuredMinutes, appendSeminarLog, getSeminarLogs } from '../src/server/seminarLogStore.ts';
import { REHEARSAL_45_STOPS, getNextRehearsalStop } from '../src/data/rehearsalScript.ts';
import { SIMULATION_TEMPLATES } from '../src/data/simulationTemplates.ts';

describe('searchKnowledgeBase', () => {
  it('returns rawCosine and displaySimilarity separately', () => {
    const hits = searchKnowledgeBase('无穷维相空间 余维数 临界', 3);
    assert.ok(hits.length > 0);
    const top = hits[0];
    assert.equal(typeof top.rawCosine, 'number');
    assert.equal(typeof top.displaySimilarity, 'number');
    assert.equal(typeof top.similarity, 'number');
    // 展示分用于 UI，通常高于 raw（校准映射）
    assert.ok(top.displaySimilarity >= top.rawCosine || top.displaySimilarity >= 0.35);
  });
});

describe('harnessRunner', () => {
  it('citation gate passes on literature-aligned thesis', () => {
    const gate = runCitationGate('无穷维相空间余维数-1临界流形与 AGI 认知边界');
    assert.equal(gate.name, 'citation');
    assert.equal(gate.passed, true);
    assert.equal(gate.exitCode, 0);
  });

  it('full demo run returns three gates', () => {
    const run = runHarnessDemo({ slideIndex: 79 });
    assert.equal(run.gates.length, 3);
    assert.ok(run.auditTrace.length >= 3);
    assert.ok(run.demoDisclaimer.includes('Harness'));
  });
});

describe('seminarLogStore', () => {
  it('builds structured minutes by slide', () => {
    appendSeminarLog({
      slide_index: 61,
      user_query: '拧 scarcityShock',
      ai_response: '遵从率下降',
      agent_role: 'sandbox_compiler',
      kind: 'sandbox'
    });
    const logs = getSeminarLogs();
    assert.ok(logs.length >= 1);
    const md = buildStructuredMinutes(logs);
    assert.ok(md.includes('P.') || md.includes('页'));
  });
});

describe('rehearsalScript', () => {
  it('has ordered 45-min stops covering sandbox and harness', () => {
    assert.ok(REHEARSAL_45_STOPS.length >= 10);
    assert.ok(REHEARSAL_45_STOPS.some(s => s.tool === 'sandbox'));
    assert.ok(REHEARSAL_45_STOPS.some(s => s.tool === 'harness'));
    const next = getNextRehearsalStop(1);
    assert.ok(next && next.slideIndex > 1);
  });
});

describe('simulationTemplates', () => {
  it('rawls template runs mild vs extreme', () => {
    const tpl = SIMULATION_TEMPLATES.find(t => t.id === 'rawls-veil');
    assert.ok(tpl);
    const mild = tpl!.run({ agentCount: 20, scarcityShock: 0.2, machiavellianWeight: 0.15, redistributionRate: 0.3 });
    const extreme = tpl!.run({ agentCount: 20, scarcityShock: 0.9, machiavellianWeight: 0.85, redistributionRate: 0.3 });
    assert.ok(Array.isArray(mild.series));
    assert.ok(Array.isArray(mild.agentLogs));
    assert.ok(Array.isArray(extreme.series));
  });
});
