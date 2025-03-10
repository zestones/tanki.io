// Create a properly initialized config object
const config = { wsUrl: null };

// Dynamically import the IP configuration
import('./ipConfig.template.js').then(ipConfig => {
    if (ipConfig.IP_ADDRESS) {
        let mode = 'prod';

        const localNetwork = `ws://${ipConfig.IP_ADDRESS}:3000`;
        const localhost = 'ws://localhost:3000';

        // Update the config object
        config.wsUrl = mode === 'dev' ? localhost : localNetwork;
    }
}).catch(error => {
    console.error('Failed to load IP configuration:', error);
    // Fallback to localhost if import fails
    config.wsUrl = 'ws://localhost:3000';
});

// Export the config object
export { config };