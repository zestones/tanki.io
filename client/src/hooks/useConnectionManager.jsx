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

    // Updated specialist state to match server schema structure
    const [specialistState, setSpecialistState] = useState({
        cooldown: 0,             // Base cooldown time in ms
        duration: 0,             // Base duration time in ms
        isActive: false,         // Is the specialist currently active?
        lastActivationTime: 0,   // When was the specialist last activated?
        remainingCooldown: 0,    // How much cooldown is remaining?
        // Computed values for UI
        cooldownUntil: 0,        // When will the cooldown end?
        activeUntil: 0           // When will the active effect end?
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

                        const specialist = myPlayer.tank.specialist;

                        // Compute active until time
                        const activeUntil = specialist.isActive
                            ? specialist.lastActivationTime + specialist.duration
                            : 0;

                        // Compute cooldown until time
                        const cooldownUntil = !specialist.isActive && specialist.lastActivationTime > 0
                            ? specialist.lastActivationTime + specialist.cooldown
                            : 0;

                        // Make sure we're handling specialist state properties correctly
                        setSpecialistState({
                            cooldown: specialist.cooldown || 0,
                            duration: specialist.duration || 0,
                            isActive: Boolean(specialist.isActive),
                            lastActivationTime: specialist.lastActivationTime || 0,
                            remainingCooldown: specialist.remainingCooldown || 0,
                            activeUntil: activeUntil,
                            cooldownUntil: cooldownUntil
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

    const activateSpecialist = () => {
        if (!room) return false;

        // Get current time
        const now = Date.now();

        // Check if specialist is in cooldown or already active
        if (specialistState.isActive) {
            console.log("Specialist is already active");
            return false;
        }

        if (now < specialistState.cooldownUntil) {
            console.log("Specialist is still in cooldown");
            return false;
        }

        // Send activation message to server
        room.send('activateSpecialist');
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