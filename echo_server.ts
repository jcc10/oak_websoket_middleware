import { WebSocket, isWebSocketCloseEvent } from 'https://deno.land/std@0.76.0/ws/mod.ts'
import { v4 } from 'https://deno.land/std@0.76.0/uuid/mod.ts'

export class Echo_Server {
    private users = new Map<string, WebSocket>();

    private async handler(ws: WebSocket): Promise<void> {
        const userId = v4.generate();

        // Register user connection
        this.users.set(userId, ws);
        this.broadcast(`${userId} is connected`);

        // Wait for new messages
        for await (const event of ws) {
            console.log(event + "")
            console.log(JSON.stringify(event));
            if (isWebSocketCloseEvent(event)) {
                this.users.delete(userId);
                this.broadcast(`${userId} is disconnected`);
                break;
            }

            //const message = camelize(typeof event === "string" ? event : "");
            const message = (typeof event === "string" ? event : "");

            this.broadcast(message, userId);
        }

    }

    public socket_handler() {
        let self = this;
        return async (ws: WebSocket) => { await self.handler.call(self, ws); }
    }


    private broadcast(message: string, senderId?: string): void {
        if (!message) return;
        console.log({ message, senderId })
        for (const user of this.users.values()) {
            user.send(senderId ? `[${senderId}]: ${message}` : message);
        }
    }
}