import type { Middleware } from 'https://deno.land/x/oak@v6.3.2/mod.ts';
import type { WebSocket } from 'https://deno.land/std@0.77.0/ws/mod.ts';
import { acceptable } from 'https://deno.land/std@0.77.0/ws/mod.ts';
export type handler = (socket: WebSocket, url: URL, headers: Headers) => Promise<void>;

export function WebSocketMiddleware(handle: handler): Middleware {
    return async function (ctx, next) {
        if (acceptable(ctx.request)) {
            let ws = await ctx.upgrade();
            await handle(ws, ctx.request.url, ctx.request.headers);
        } else {
            return await next();
        }
    }
}