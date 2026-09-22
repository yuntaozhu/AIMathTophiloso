/**
 * Vercel Fluid Compute entry — exports the Node HTTP server
 * so Socket.IO can upgrade WebSocket connections.
 * @see https://vercel.com/docs/functions/websockets
 */
export { default } from "../server";

export const config = {
  maxDuration: 300,
  api: {
    bodyParser: false
  }
};
