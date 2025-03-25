import { Client } from 'colyseus.js';
import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { config } from '../config/config';

export default function useConnectionManager() {
    const navigate = useNavigate();
    const [room, setRoom] = useState(null);
    const [health, setHealth] = useState(3);

    const [username, setUsername] = useState('');
    const [tank, setTank] = useState();

    const [isConnecting, setIsConnecting] = useState(true);
    const [respawnCountdown, setRespawnCountdown] = useState(null);
    const [upgradePoints, setUpgradePoints] = useState(0);
    const [score, setScore] = useState(0);

    // Simplified specialist state - directly using values from Player schema
    const [specialistState, setSpecialistState] = useState({
        cooldownUntil: 0,
        activeUntil: 0,
        isActive: false
    });

    const hasConnected = useRef(false);

    // State to track both joystick positions
    const playerState = useRef({
        movement: {
            direction: 0,
            moving: false
        },
        aiming: {
            direction: 0,
            active: false
        }
    });

    // Connect to game server
    useEffect(() => {
        if (hasConnected.current) return;

        const storedUsername = sessionStorage.getItem('username');
        const storedTank = JSON.parse(sessionStorage.getItem('tank'));
        if (!storedUsername || !storedTank) {
            navigate('/tanki.io');
            return;
        }

        setUsername(storedUsername);
        setTank(storedTank);

        const client = new Client(config.wsUrl);
        setIsConnecting(true);
        hasConnected.current = true;

        client.joinOrCreate('game', { username: storedUsername, tankType: storedTank.codeName })
            .then(room => {
                setRoom(room);
                setIsConnecting(false);

                room.onStateChange((state) => {
                    const myPlayer = state.players.get(room.sessionId);
                    if (myPlayer) {
                        setHealth(myPlayer.hp);
                        setScore(myPlayer.score);
                        setUpgradePoints(myPlayer.upgradePoints);

                        // Make sure we're safely handling specialist state properties
                        setSpecialistState({
                            cooldownUntil: myPlayer.specialistCooldown || 0,
                            activeUntil: myPlayer.specialistActiveUntil || 0,
                            isActive: Boolean(myPlayer.specialistActive)
                        });
                    }
                });
            })
            .catch(e => {
                hasConnected.current = false;
                console.error('Could not join room:', e);
                setIsConnecting(false);
                navigate('/tanki.io');
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

    // Add effect for listening to specialist events
    useEffect(() => {
        if (!room) return;

        room.onMessage('specialistActivated', (message) => {
            if (message.playerId === room.sessionId) {
                // Update UI when our specialist is activated
                setSpecialistState(prev => ({
                    ...prev,
                    activeUntil: Date.now() + message.duration,
                    isActive: true
                }));
            }
        });

        return () => {
            room.removeAllListeners('specialistActivated');
        };
    }, [room]);

    // Effect to send updated player state to server
    useEffect(() => {
        if (!room) return;

        const interval = setInterval(() => {
            const state = playerState.current;

            // Send the current state to server
            room.send('dualStickInput', {
                movement: {
                    direction: state.movement.direction,
                    moving: state.movement.moving
                },
                aiming: {
                    direction: state.aiming.direction,
                    shooting: state.aiming.active
                }
            });
        }, 1000 / 30); // TODO : 30fps -> MAKE IT MATCH SERVER TICK RATE

        return () => clearInterval(interval);
    }, [room]);

    // Game control handlers
    const handleMove = (direction, isMoving, type) => {
        if (type === "movement") {
            playerState.current.movement = {
                direction,
                moving: isMoving
            };
        } else if (type === "aiming") {
            playerState.current.aiming = {
                direction,
                active: isMoving
            };
        }
    };

    const handleStopMoving = (lastDirection, type) => {
        if (type === "movement") {
            playerState.current.movement = {
                direction: lastDirection,
                moving: false
            };
        } else if (type === "aiming") {
            playerState.current.aiming = {
                direction: lastDirection,
                active: false
            };
        }
    };

    const handleAim = (direction, isActive) => {
        handleMove(direction, isActive, "aiming");
    };

    const handleUpgradeTank = (stat) => {
        if (!room || upgradePoints <= 0) return false;

        room.send('upgradeTank', { stat });

        const newStats = {
            ...(tank?.stats || {}),
            [stat]: Math.min((tank?.stats?.[stat] || 0) + 1, 10)
        };
        setTank({ ...tank, stats: newStats });

        return true;
    };

    const activateSpecialist = (targetPosition = null) => {
        if (!room) return false;

        // Only send the message if we're not in cooldown and not already active
        const now = Date.now();
        if (specialistState.cooldownUntil > now || specialistState.isActive) {
            console.log("Specialist not available right now");
            return false;
        }

        const message = targetPosition ? { targetPosition } : {};
        room.send('activateSpecialist', message);
        return true;
    };

    return {
        room,
        health,
        username,
        tank,
        isConnecting,
        respawnCountdown,
        score,
        upgradePoints,
        specialistState,
        handleMove,
        handleStopMoving,
        handleAim,
        handleUpgradeTank,
        activateSpecialist
    };
}