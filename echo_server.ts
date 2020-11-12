import { WebSocket, isWebSocketCloseEvent, isWebSocketPingEvent } from 'https://deno.land/std@0.77.0/ws/mod.ts'
import { v4 } from 'https://deno.land/std@0.77.0/uuid/mod.ts'

export class ECHO_SERVER {
    private users = new Map<string, WebSocket>();
    private path: string;
    constructor(path: string){
        this.path = path;
    }

    private async handler(ws: WebSocket, url: URL, headers: Headers): Promise<void> {
        if(url.pathname != this.path){
            ws.close(999, "wrong path");
        }

        const userId = v4.generate();

        // Register user connection
        this.users.set(userId, ws);
        await this.broadcast(`${userId} is connected`);
        // Wait for new messages
        try {
            for await (const ev of ws) {
                if (typeof ev === "string") {
                    // text message
                    console.log("ws:Text", ev);
                    if (isWebSocketCloseEvent(ev)) {
                        this.users.delete(userId);
                        this.broadcast(`${userId} is disconnected`);
                        break;
                    }

                    const message = (typeof ev === "string" ? ev : "");

                    this.broadcast(message, userId);
                } else if (ev instanceof Uint8Array) {
                    // binary message
                    console.log("ws:Binary", ev);
                } else if (isWebSocketPingEvent(ev)) {
                    const [, body] = ev;
                    // ping
                    console.log("ws:Ping", body);
                } else if (isWebSocketCloseEvent(ev)) {
                    // close
                    const { code, reason } = ev;
                    console.log("ws:Close", code, reason);
                }
            }
        } catch (err) {
            console.error(`failed to receive frame: ${err}`);

            if (!ws.isClosed) {
                await ws.close(1000).catch(console.error);
            }
        }
        return;
    }

    public socket_handler() {
        return async (socket: WebSocket, url: URL, headers: Headers) => { await this.handler(socket, url, headers); };
    }


    private async broadcast(message: string, senderId?: string): Promise<void> {
        if (!message) return;
        const fullM = senderId ? `[${senderId}]: ${message}` : message;
        console.log(fullM);
        for (const user of this.users.values()) {
            if(user.isClosed){
                continue;
            }
            await user.send(fullM);
        }
    }
}