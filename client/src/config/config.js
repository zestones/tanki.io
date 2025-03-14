const config = {
    wsUrl: import.meta.env.VITE_WS_URL,
    clientUrl: import.meta.env.VITE_CLIENT_URL,
};

// Log the current environment and config
const mode = import.meta.env.MODE;
console.log("Current mode:", mode);
// test-env.js
console.log('VITE_WS_URL:', import.meta.env.VITE_WS_URL);
console.log('VITE_CLIENT_URL:', import.meta.env.VITE_CLIENT_URL);
console.log('All env vars:', import.meta.env);

export { config };