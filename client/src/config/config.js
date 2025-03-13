// TODO: make it match the ips address and port

const config = { wsUrl: 'ws://localhost:3000', clientUrl: 'http://localhost:5175' };

// Dynamically import the IP configuration
import('./ipConfig.js').then(ipConfig => {
    if (ipConfig.IP_ADDRESS) {
        // Use environment variable with a fallback to 'dev'
        const mode = process.env.NODE_ENV || 'dev';

        const localNetwork = ipConfig.IP_ADDRESS;
        const localhost = 'ws://localhost:3000';

        config.wsUrl = mode === 'dev' ? localhost : localNetwork;
        console.info("Webserver url : " + config.wsUrl)
    }
}).catch(error => {
    console.error('Failed to load IP configuration:', error);
});

export { config };