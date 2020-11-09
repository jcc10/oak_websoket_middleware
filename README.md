# oak_websoket_middleware
Idiot level middleware for creating websocket endpoints.

Import with ```
import { WebSocketMiddleware } from "./mod.ts";
```

Create a new server with

```
const ws_server = new WebSocketMiddleware(socket_handler);
app.use(ws_server.middleware());
```

Handler typedef:

```
(socket: WebSocket, url: URL, headers: Headers) => Promise<void>;
```

Just take a look at the example server.

## Why?
I was having problems finding example code. So now that I *have* example code I want it written down somewhere so I don't forget it.

I'm also going to try to get this into one of the "standard" oak middleware packs.