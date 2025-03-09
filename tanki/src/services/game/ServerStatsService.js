import BaseService from '../core/BaseService';

// Singleton registry for service instances
const instances = new Map();

class ServerStatsService extends BaseService {
    constructor(serverUrl) {
        super(serverUrl);
    }

    async fetchStats() {
        const requestPayload = {
            type: 'stats-request',
            timestamp: Date.now() // Add timestamp to prevent caching issues
        };

        try {
            // Add console.log to debug request
            console.log('Fetching server stats with payload:', requestPayload);

            const stats = await this.sendRequest(
                requestPayload,
                'stats-response', // Changed from server-stats-response to match server response type
                15000 // Increased timeout to 15 seconds for more reliability
            );

            console.log('Received raw stats response:', stats);

            // Handle different response formats
            const processedStats = {
                players: 0,
                uptime: 0,
                arenas: 0
            };

            // Extract data based on response structure
            if (typeof stats === 'object' && stats !== null) {
                // If stats has a data property, use that
                const statsData = stats.data || stats;

                processedStats.players = statsData.players || statsData.playerCount || 0;
                processedStats.uptime = statsData.uptime || statsData.serverUptime || 0;
                processedStats.arenas = statsData.arenas || statsData.roomCount || 0;

                // Add any other available properties
                Object.keys(statsData).forEach(key => {
                    if (!processedStats[key]) {
                        processedStats[key] = statsData[key];
                    }
                });
            }

            return processedStats;
        } catch (error) {
            console.error('Error fetching server stats:', error);
            // Return a default response instead of throwing to make the app more resilient
            return {
                players: 0,
                uptime: 0,
                arenas: 0,
                error: error.message || 'Failed to fetch server stats'
            };
        }
    }

    // Factory method implementation
    static getInstance(serverUrl) {
        if (!instances.has(serverUrl)) {
            instances.set(serverUrl, new ServerStatsService(serverUrl));
        }
        return instances.get(serverUrl);
    }
}

export default ServerStatsService;