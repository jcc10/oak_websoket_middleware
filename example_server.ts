import {
    Application,
    Router
} from "https://deno.land/x/oak@v6.3.1/mod.ts";
import { WebSocketMiddleware } from "./mod.ts";
import { Echo_Server } from "./echo_server.ts";

const app = new Application();
const router = new Router();
const echo_server = new Echo_Server();
const ws_server = new WebSocketMiddleware("/ws", echo_server.socket_handler());
app.use(ws_server.middleware());
app.use(router.routes());
app.use(router.allowedMethods());
router.get("/", async (context: any) => {
    const decoder = new TextDecoder("utf-8");
    const bytes = Deno.readFileSync("./index.html");
    const text = decoder.decode(bytes);
    context.response.body = text;
});
console.log("Server running on localhost:3000");
await app.listen({ port: 3000 });