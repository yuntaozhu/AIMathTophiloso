/// <reference lib="webworker" />
import {
  buildZeroSurface,
  sampleDecisionCloud,
  TrolleyParams
} from './ethicsModel';

export type WorkerIn =
  | { type: 'build'; id: number; params: TrolleyParams; resR: number; resDt: number; arrowStride: number; cloudN: number }
  | { type: 'ping' };

export type WorkerOut =
  | {
      type: 'mesh';
      id: number;
      positions: Float32Array;
      indices: Uint32Array;
      normals: Float32Array;
      arrows: Float32Array;
      cloud: Float32Array;
    }
  | { type: 'pong' };

const ctx: DedicatedWorkerGlobalScope = self as unknown as DedicatedWorkerGlobalScope;

ctx.onmessage = (ev: MessageEvent<WorkerIn>) => {
  const msg = ev.data;
  if (msg.type === 'ping') {
    ctx.postMessage({ type: 'pong' } satisfies WorkerOut);
    return;
  }
  if (msg.type === 'build') {
    const mesh = buildZeroSurface({
      params: msg.params,
      resR: msg.resR,
      resDt: msg.resDt,
      arrowStride: msg.arrowStride
    });
    const cloud = sampleDecisionCloud(msg.params, msg.cloudN, msg.id + 7);
    const out: WorkerOut = {
      type: 'mesh',
      id: msg.id,
      positions: mesh.positions,
      indices: mesh.indices,
      normals: mesh.normals,
      arrows: mesh.arrows,
      cloud
    };
    ctx.postMessage(out, [
      mesh.positions.buffer,
      mesh.indices.buffer,
      mesh.normals.buffer,
      mesh.arrows.buffer,
      cloud.buffer
    ]);
  }
};
