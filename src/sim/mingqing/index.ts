export * from './types';
export * from './harness';
export * from './scenarios';
export * from './engine';

export const MING_QING_SIM_PATH = '/#/sim/ming-qing';

export function openMingQingSimulator(opts?: { scenario?: string; newTab?: boolean }): void {
  const q = opts?.scenario ? `?scenario=${encodeURIComponent(opts.scenario)}` : '';
  const url = `${MING_QING_SIM_PATH}${q}`;
  if (opts?.newTab === false) {
    window.location.hash = `/sim/ming-qing${q}`;
  } else {
    window.open(url, '_blank', 'noopener,noreferrer');
  }
}
