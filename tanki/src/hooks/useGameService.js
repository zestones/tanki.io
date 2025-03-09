import { useState, useCallback } from 'react';
import GameService from '../services/game/GameService';

export function useGameService(serverUrl) {
    const [gameService] = useState(() => new GameService(serverUrl));
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [serverStats, setServerStats] = useState({ players: 0, uptime: 0 });

    const fetchServerStats = useCallback(async () => {
        setIsLoading(true);
        setError(null);

        try {
            const stats = await gameService.fetchServerStats();
            setServerStats({
                players: stats.players || 0,
                uptime: stats.arenas || 0,
            });
            return stats;
        } catch (err) {
            setError(err.message || 'Failed to fetch server stats');
            return null;
        } finally {
            setIsLoading(false);
        }
    }, [gameService]);

    const registerPlayer = useCallback(
        async (username) => {
            setIsLoading(true);
            setError(null);

            try {
                const result = await gameService.registerPlayer(username);

                if (result.success) {
                    gameService.storePlayerSession(username);
                }

                return result;
            } catch (err) {
                setError(err.message || 'Failed to register player');
                return { success: false, error: err.message };
            } finally {
                setIsLoading(false);
            }
        },
        [gameService]
    );

    return {
        isLoading,
        error,
        serverStats,
        fetchServerStats,
        registerPlayer,
    };
}