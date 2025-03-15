import { Server } from "@colyseus/core";
import { monitor } from "@colyseus/monitor";
import { WebSocketTransport } from "@colyseus/ws-transport";

import os from "os";
import cors from "cors";
import express from "express";
import { createServer } from "http";

import tanksConfig from "./config/tanksConfig.js";
import { GameRoom } from "./rooms/GameRoom.js";


const port = parseInt(process.env.PORT, 10) || 3000;
const app = express();

app.use(cors());
app.use(express.json());

// Create WebSocket server
const gameServer = new Server({
    transport: new WebSocketTransport({
        server: createServer(app),
        // Listen on all network interfaces instead of just localhost
        hostname: '0.0.0.0'
    })
});

// Define room with autoCreate option set to true
gameServer.define("game", GameRoom, {
    autoCreate: true
});

// Register Colyseus Monitor
app.use("/colyseus", monitor());

// API endpoint to get tank configuration data
app.get("/api/tanks", (req, res) => {
    res.json(tanksConfig);
});

// Get local IP address to display in console
function getLocalIP() {
    const interfaces = os.networkInterfaces();
    for (const name of Object.keys(interfaces)) {
        for (const iface of interfaces[name]) {
            // Skip over non-IPv4 and internal (loopback) addresses
            if (iface.family === 'IPv4' && !iface.internal) {
                return iface.address;
            }
        }
    }
    return 'localhost';
}

const localIP = getLocalIP();

gameServer.listen(port);
console.log(`🚀 Game server running on ws://localhost:${port}`);
console.log(`🌐 Available on your network at ws://${localIP}:${port}`);
console.log(`📊 API endpoint available at http://${localIP}:${port}/api/tanks`);