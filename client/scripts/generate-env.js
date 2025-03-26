import fs from 'fs';
import os from 'os';

// Get local network IP dynamically
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

    return 'localhost'; // Fallback to localhost if no local IP found
}

const localIP = getLocalIP();

const envContent = `VITE_WS_URL=ws://${localIP}:3000 
VITE_CLIENT_URL=http://${localIP}:5173/tanki.io/
VITE_API_URL=http://${localIP}:3000/api
`;

fs.writeFileSync('.env.development', envContent.trim());
console.log(`.env file generated with IP: ${localIP} `);
