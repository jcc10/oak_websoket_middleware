import type { Middleware, Context } from "https://deno.land/x/oak@v6.3.1/mod.ts";
import { WebSocket, acceptWebSocket, acceptable } from 'https://deno.land/std@0.76.0/ws/mod.ts'
import { BufReader, BufWriter } from "https://deno.land/std@0.76.0/io/bufio.ts";
export class WebSocketMiddleware {
    public sockets: WebSocket[] = [];
    public pathname: string;
    public handler: (socket: WebSocket) => Promise<void | null>;
    constructor(pathname: string, handler: (socket: WebSocket) => Promise<void>) {
        this.pathname = pathname;
        this.handler = handler;
    }

    private async real_middleware(ctx: Context, next: ()=>Promise<void>) {
        if (acceptable(ctx.request)) {
            if (ctx.request.url.pathname != "/ws") {
                return await next();
            }
            let ws = await ctx.upgrade();
            await this.handler(ws);
        } else {
            return await next();
        }
    }

    public middleware(): Middleware {
        return async (ctx, next) => { await this.real_middleware(ctx, next) };
    }
}