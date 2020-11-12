# oak_websoket_middleware
Idiot level middleware for creating websocket endpoints.

Import with
```
import { WebSocketMiddleware } from "https://raw.githubusercontent.com/jcc10/oak_websoket_middleware/main/mod.ts";
```

Create a new server with
```
app.use(WebSocketMiddleware(socket_handler));
```

Handler typedef:
```
(socket: WebSocket, url: URL, headers: Headers) => Promise<void>;
```

Just take a look at the example server.

## Why?
I was having problems finding example code. So now that I *have* example code I want it written down somewhere so I don't forget it.

I'm also going to try to get this into one of the "standard" oak middleware packs.
