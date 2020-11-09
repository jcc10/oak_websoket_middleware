import { WebSocket, acceptWebSocket, acceptable } from 'https://deno.land/std@0.76.0/ws/mod.ts'
export class WebSocketMiddleware {
    public sockets: WebSocket[] = [];
    public pathname: string;
    public handler: (socket: WebSocket) => Promise<void | null>;
    constructor(pathname: string, handler: (socket: WebSocket) => Promise<void>) {
        this.pathname = pathname;
        this.handler = handler;
    }

    private async real_middleware(ctx: any, next: any) {
        if (ctx.request.url.pathname != this.pathname) {
            return await next();
        }
        if (ctx.request.headers.get("upgrade") !== "websocket") {
            ctx.response.status = 200;
            return;
        }
    }

    public middleware(): Middleware {
        return async (ctx, next) => { await this.real_middleware(ctx, next) };
    }
}