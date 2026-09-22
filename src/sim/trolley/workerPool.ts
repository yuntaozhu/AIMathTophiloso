/**
 * 轻量 Worker 池：并行构建相界面 / 蒙特卡洛云
 */
import type { TrolleyParams } from './ethicsModel';
import type { WorkerIn, WorkerOut } from './surfaceWorker';

type MeshResult = Extract<WorkerOut, { type: 'mesh' }>;

export class SurfaceWorkerPool {
  private workers: Worker[] = [];
  private rr = 0;
  private seq = 1;
  private pending = new Map<
    number,
    { resolve: (m: MeshResult) => void; reject: (e: Error) => void }
  >();

  constructor(size = Math.min(4, typeof navigator !== 'undefined' ? navigator.hardwareConcurrency || 2 : 2)) {
    const n = Math.max(1, size);
    for (let i = 0; i < n; i++) {
      const w = new Worker(new URL('./surfaceWorker.ts', import.meta.url), { type: 'module' });
      w.onmessage = (ev: MessageEvent<WorkerOut>) => {
        const data = ev.data;
        if (data.type !== 'mesh') return;
        const p = this.pending.get(data.id);
        if (!p) return;
        this.pending.delete(data.id);
        p.resolve(data);
      };
      w.onerror = err => {
        console.error('[trolley-worker]', err);
      };
      this.workers.push(w);
    }
  }

  build(params: TrolleyParams, opts?: { resR?: number; resDt?: number; cloudN?: number }): Promise<MeshResult> {
    const id = this.seq++;
    const worker = this.workers[this.rr % this.workers.length];
    this.rr++;
    const msg: WorkerIn = {
      type: 'build',
      id,
      params,
      resR: opts?.resR ?? 48,
      resDt: opts?.resDt ?? 36,
      arrowStride: 5,
      cloudN: opts?.cloudN ?? 2400
    };
    return new Promise((resolve, reject) => {
      this.pending.set(id, { resolve, reject });
      worker.postMessage(msg);
      window.setTimeout(() => {
        if (this.pending.has(id)) {
          this.pending.delete(id);
          reject(new Error('worker timeout'));
        }
      }, 12000);
    });
  }

  dispose(): void {
    for (const w of this.workers) w.terminate();
    this.workers = [];
    this.pending.clear();
  }
}
