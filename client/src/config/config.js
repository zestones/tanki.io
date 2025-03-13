// TODO: make it match the ips address and port

const config = { wsUrl: 'ws://localhost:3000', clientUrl: 'http://localhost:5175' };

// Dynamically import the IP configuration
import('./ipConfig.js').then(ipConfig => {
    if (ipConfig) {
        // Use environment variable with a fallback to 'dev'
        const mode = process.env.NODE_ENV || 'dev';

        const localNetwork = ipConfig.LOCAL_ADDRESSE;
        const prodNetwork = ipConfig.PROD_ADDRESS

        config.wsUrl = mode === 'dev' ? localNetwork : prodNetwork;
        console.info("Webserver url : " + config.wsUrl)
    }
}).catch(error => {
    console.error('Failed to load IP configuration:', error);
});

export { config };