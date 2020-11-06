import { WebSocket, isWebSocketCloseEvent, isWebSocketPingEvent } from 'https://deno.land/std@0.76.0/ws/mod.ts'
import { v4 } from 'https://deno.land/std@0.76.0/uuid/mod.ts'

export class Echo_Server {
    private users = new Map<string, WebSocket>();

    private async handler(ws: WebSocket): Promise<void> {
        const userId = v4.generate();

        // Register user connection
        this.users.set(userId, ws);
        this.broadcast(`${userId} is connected`);

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

    }

    public socket_handler() {
        return async (ws: WebSocket) => { this.handler(ws); }
    }


    private broadcast(message: string, senderId?: string): void {
        if (!message) return;
        console.log({ message, senderId })
        for (const user of this.users.values()) {
            if(user.isClosed){
                continue;
            }
            user.send(senderId ? `[${senderId}]: ${message}` : message);
        }
    }
}