import { Server } from "@colyseus/core";
import { WebSocketTransport } from "@colyseus/ws-transport";
import { monitor } from "@colyseus/monitor";
import express from "express";
import cors from "cors";
import { createServer } from "http";
import { GameRoom } from "./rooms/GameRoom.js";

const port = parseInt(process.env.PORT, 10) || 3000;
const app = express();

app.use(cors());
app.use(express.json());

// Create WebSocket server
const gameServer = new Server({
    transport: new WebSocketTransport({
        server: createServer(app)
    })
});

// Register GameRoom as "game"
gameServer.define("game", GameRoom);

// Register Colyseus Monitor
app.use("/colyseus", monitor());

gameServer.listen(port);
console.log(`🚀 Game server running on ws://localhost:${port}`);
