import { Application, Context } from "https://deno.land/x/oak@v6.3.2/mod.ts";
import { WebSocketMiddleware, WebSocketMiddlewareHandler } from "./mod.ts";
import { ECHO_SERVER } from "./echo_server.ts";

const app = new Application();
const wsMiddle = new WebSocketMiddlewareHandler();
const echoServer = new ECHO_SERVER("/ws");
wsMiddle.use(async (next, socket, url) => {
    socket.send(`You joined from path: ${url.pathname}`);
    socket.send(`   This message sponsored by wsMiddle`);
    await next();
})
wsMiddle.use(echoServer.middleware());
app.use(WebSocketMiddleware(wsMiddle.handle()));

app.use((ctx: Context) => {
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

        </html>`;
});
console.log("Server running on localhost:3000");
await app.listen({ port: 3000 });