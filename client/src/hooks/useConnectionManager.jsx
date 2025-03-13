import { Client } from 'colyseus.js';
import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { config } from '../config/config';


export default function useConnectionManager() {
    const navigate = useNavigate();
    const [room, setRoom] = useState(null);
    const [health, setHealth] = useState(3);
    const [username, setUsername] = useState('');
    const [isConnecting, setIsConnecting] = useState(true);
    const [respawnCountdown, setRespawnCountdown] = useState(null);
    const hasConnected = useRef(false);

    // Connect to game server
    useEffect(() => {
        if (hasConnected.current) return;

        const storedUsername = sessionStorage.getItem('username');
        if (!storedUsername) {
            navigate('/');
            return;
        }

        setUsername(storedUsername);
        const client = new Client(config.wsUrl);
        setIsConnecting(true);
        hasConnected.current = true;

        client.joinOrCreate('game', { username: storedUsername })
            .then(room => {
                setRoom(room);
                setIsConnecting(false);

                room.onStateChange((state) => {
                    const myPlayer = state.players.get(room.sessionId);
                    if (myPlayer) {
                        setHealth(myPlayer.hp);
                    }
                });
            })
            .catch(e => {
                hasConnected.current = false;
                console.error('Could not join room:', e);
                setIsConnecting(false);
                navigate('/');
            });

        return () => {
            if (room) room.leave();
        };
    }, [navigate]);

    // Add this effect for handling respawn countdown
    useEffect(() => {
        if (!room) return;

        // Listen for respawn countdown updates
        room.onMessage('respawnCountdown', (message) => {
            setRespawnCountdown(message.countdown);
        });

        // Listen for respawn completion
        room.onMessage('playerRespawned', () => {
            setRespawnCountdown(null);
        });

        return () => {
            room.removeAllListeners('respawnCountdown');
            room.removeAllListeners('playerRespawned');
        };
    }, [room]);

    // Game control handlers
    const handleMove = (direction, isMoving) => {
        if (room) {
            room.send('move', { direction, moving: isMoving });
        }
    };

    const handleStopMoving = (lastDirection) => {
        if (room) {
            room.send('move', { direction: lastDirection, moving: false });
        }
    };

    const handleShoot = () => {
        if (room) {
            room.send('shoot');
        }
    };

    return {
        room,
        health,
        username,
        isConnecting,
        respawnCountdown,
        handleMove,
        handleStopMoving,
        handleShoot
    };
}