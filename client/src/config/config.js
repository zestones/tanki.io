// TODO: make it match the ips address and port

const config = { wsUrl: 'ws://localhost:3000', clientUrl: 'http://localhost:5175' };

// Dynamically import the IP configuration
import('./ipConfig.js').then(ipConfig => {
    if (ipConfig.IP_ADDRESS) {
        let mode = 'prod';

        const localNetwork = `ws://${ipConfig.IP_ADDRESS}:3000`;
        const localhost = 'ws://localhost:3000';

        config.wsUrl = mode === 'dev' ? localhost : localNetwork;
    }
}).catch(error => {
    console.error('Failed to load IP configuration:', error);
});

export { config };