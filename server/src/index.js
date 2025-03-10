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

// Define room with autoCreate option set to true
gameServer.define("game", GameRoom, {
    // Room creation options can go here
    autoCreate: true  // This will ensure the room is created when the server starts
});

// Register Colyseus Monitor
app.use("/colyseus", monitor());

gameServer.listen(port);
console.log(`🚀 Game server running on ws://localhost:${port}`);
