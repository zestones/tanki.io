const config = {
    wsUrl: import.meta.env.VITE_WS_URL || 'ws://localhost:3000',
    clientUrl: import.meta.env.VITE_CLIENT_URL || 'http://localhost:5175'
};

// Log the current environment and config
const mode = import.meta.env.MODE;
console.log("Current mode:", mode);
console.info("Webserver url:", config.wsUrl);
console.info("Client url:", config.clientUrl);

export { config };