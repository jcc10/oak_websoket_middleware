import {
    Application
} from "https://deno.land/x/oak@v6.3.1/mod.ts";
import { WebSocketMiddleware } from "./mod.ts";
import { Echo_Server } from "./echo_server.ts";

const app = new Application();
const echo_server = new Echo_Server();
const ws_server = new WebSocketMiddleware("/ws", echo_server.socket_handler());
app.use(ws_server.middleware());

app.use(async (ctx: any, next: any) => {
    ctx.response.body = `<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8" />
    <title>Chat using Deno</title>
</head>

<body>
    <input id="test"><button id="send">send</button>
    <div id="messages"></div>
    <script>
        const test = document.getElementById("test")
        const send = document.getElementById("send");
        const messages = document.getElementById("messages");
        const socket = new WebSocket(\`ws://\${window.location.host}/ws\`);
    socket.onmessage = (event) => {
        messages.innerHTML = event.data + "<br />" + messages.innerHTML;
    }
    send.onclick = () => {
        socket.send(test.value);
    }
    </script>
        </body>

        </html>`
});
console.log("Server running on localhost:3000");
await app.listen({ port: 3000 });