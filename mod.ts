import type { Middleware } from 'https://deno.land/x/oak@v6.3.2/mod.ts';
import type { WebSocket } from 'https://deno.land/std@0.77.0/ws/mod.ts';
import { acceptable } from 'https://deno.land/std@0.77.0/ws/mod.ts';

/**
 * Handles incoming websocket connections.
 * URL and headers are for the initial HTTP request that the WebSocket has been upgraded from.
 */
export type handler = (socket: WebSocket, url: URL, headers: Headers) => Promise<void>;

/**
 * "Idiot's guide to oak WebSockets"
 * Put as the top level middleware to enable WS connections to any server url. Filtering is done within the passed handler. 
 * @param handle A handler that will process all incoming WebSockets.
 */
export function WebSocketMiddleware(handle: handler): Middleware {
    return async function (ctx, next) {
        if (acceptable(ctx.request)) {
            const ws = await ctx.upgrade();
            await handle(ws, ctx.request.url, ctx.request.headers);
        } else {
            return await next();
        }
    }
}