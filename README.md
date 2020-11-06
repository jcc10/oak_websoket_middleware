# oak_websoket_middleware
Idiot level middleware for creating websocket endpoints.

Import with ``` EXPUNGED UNTIL DEBUGGED ```

Create a new server with

```
const ws_server = new WebSocketMiddleware("/path", socket_handler);
app.use(ws_server.middleware());
```

where "/path" is the exact route the client is connecting on and socket_handler is the thing that is actually handling the sockets.

Or just take a look at the example server. (Once it starts working.)