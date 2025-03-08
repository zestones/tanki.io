import React, { useEffect, useRef, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

// WebSocket service URL
const WEBSOCKET_URL = 'ws://localhost:8080';

function GameScreen() {
    const canvasRef = useRef(null);
    const socketRef = useRef(null);
    const gameStateRef = useRef({
        players: new Map(),
        projectiles: [],
        gameObjects: [],
        selfId: null,
        leaderboard: []
    });
    const controlsRef = useRef({
        up: false,
        down: false,
        left: false,
        right: false,
        mouse: { x: 0, y: 0 },
        shooting: false
    });

    const [connected, setConnected] = useState(false);
    const [username, setUsername] = useState('');
    const [stats, setStats] = useState({
        score: 0,
        level: 1,
        tank: 'basic'
    });
    const [showLeaderboard, setShowLeaderboard] = useState(true);
    const [showUpgrades, setShowUpgrades] = useState(false);
    const [gameOver, setGameOver] = useState(false);

    const navigate = useNavigate();

    // Game dimensions and scaling
    const worldSize = 5000; // Server world size
    const viewportRef = useRef({
        width: 0,
        height: 0,
        scale: 1,
        offsetX: 0,
        offsetY: 0
    });

    // Animation frame ID for cleanup
    const animationFrameRef = useRef(null);

    // Initialize game
    useEffect(() => {
        // Get username from session storage
        const storedUsername = sessionStorage.getItem('diep_username');
        if (!storedUsername) {
            // Redirect back to auth page if no username
            navigate('/');
            return;
        }

        setUsername(storedUsername);

        // Initialize canvas
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');

        // Set canvas to full screen (mobile optimized)
        const updateCanvasSize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            viewportRef.current.width = window.innerWidth;
            viewportRef.current.height = window.innerHeight;
        };

        updateCanvasSize();
        window.addEventListener('resize', updateCanvasSize);

        // Setup WebSocket connection
        connectWebSocket();

        // Setup game controls
        setupControls();

        // Start game loop
        startGameLoop();

        return () => {
            // Cleanup
            if (socketRef.current) {
                socketRef.current.close();
            }

            if (animationFrameRef.current) {
                cancelAnimationFrame(animationFrameRef.current);
            }

            window.removeEventListener('resize', updateCanvasSize);
            cleanupControls();
        };
    }, [navigate]);

    // Connect to WebSocket server
    const connectWebSocket = useCallback(() => {
        try {
            console.log('Attempting to connect to WebSocket server...');
            socketRef.current = new WebSocket(WEBSOCKET_URL);

            socketRef.current.onopen = () => {
                console.log('Successfully connected to game server');
                setConnected(true);

                // Send join message with username
                socketRef.current.send(JSON.stringify({
                    type: 'join',
                    name: username
                }));
            };

            socketRef.current.onclose = (event) => {
                console.log('WebSocket connection closed:', event.code, event.reason);
                setConnected(false);

                // If not intentionally game over, try to reconnect
                if (!gameOver) {
                    console.log('Attempting to reconnect...');
                    setTimeout(() => {
                        connectWebSocket();
                    }, 2000);
                }
            };

            socketRef.current.onerror = (error) => {
                console.error('WebSocket error:', error);
                setConnected(false);
            };

            socketRef.current.onmessage = (event) => {
                handleServerMessage(event.data);
            };
        } catch (error) {
            console.error('Error creating WebSocket connection:', error);
        }
    }, [username, gameOver]);

    // Handle messages from server
    const handleServerMessage = useCallback((data) => {
        try {
            const message = JSON.parse(data);

            switch (message.type) {
                case 'welcome':
                    gameStateRef.current.selfId = message.id;
                    break;

                case 'gameState':
                    // Initial game state
                    const playersMap = new Map();
                    message.players.forEach(player => {
                        playersMap.set(player.id, player);
                    });

                    gameStateRef.current.players = playersMap;
                    gameStateRef.current.projectiles = message.projectiles;
                    gameStateRef.current.gameObjects = message.gameObjects;
                    gameStateRef.current.selfId = message.self;

                    // Update self stats
                    const self = playersMap.get(message.self);
                    if (self) {
                        setStats({
                            score: self.score,
                            level: self.level,
                            tank: self.tank
                        });
                    }
                    break;

                case 'update':
                    // Update game state
                    const updatedPlayers = new Map();
                    message.players.forEach(player => {
                        updatedPlayers.set(player.id, player);
                    });

                    gameStateRef.current.players = updatedPlayers;
                    gameStateRef.current.projectiles = message.projectiles;
                    gameStateRef.current.gameObjects = message.gameObjects;

                    // Update self stats
                    const updatedSelf = updatedPlayers.get(gameStateRef.current.selfId);
                    if (updatedSelf) {
                        setStats({
                            score: updatedSelf.score,
                            level: updatedSelf.level,
                            tank: updatedSelf.tank
                        });
                    }
                    break;

                case 'leaderboard':
                    gameStateRef.current.leaderboard = message.data;
                    break;

                case 'playerDefeated':
                    if (message.defeatedId === gameStateRef.current.selfId) {
                        // Player was defeated
                        setGameOver(true);
                    }
                    break;

                case 'respawn':
                    // Player respawned
                    setGameOver(false);
                    break;

                default:
                    break;
            }
        } catch (error) {
            console.error('Error parsing server message:', error);
        }
    }, []);

    // Setup game controls
    const setupControls = useCallback(() => {
        const handleKeyDown = (e) => {
            switch (e.key.toLowerCase()) {
                case 'w':
                case 'arrowup':
                    controlsRef.current.up = true;
                    break;
                case 's':
                case 'arrowdown':
                    controlsRef.current.down = true;
                    break;
                case 'a':
                case 'arrowleft':
                    controlsRef.current.left = true;
                    break;
                case 'd':
                case 'arrowright':
                    controlsRef.current.right = true;
                    break;
                case 'l':
                    setShowLeaderboard(prev => !prev);
                    break;
                case 'u':
                    setShowUpgrades(prev => !prev);
                    break;
                default:
                    break;
            }
        };

        const handleKeyUp = (e) => {
            switch (e.key.toLowerCase()) {
                case 'w':
                case 'arrowup':
                    controlsRef.current.up = false;
                    break;
                case 's':
                case 'arrowdown':
                    controlsRef.current.down = false;
                    break;
                case 'a':
                case 'arrowleft':
                    controlsRef.current.left = false;
                    break;
                case 'd':
                case 'arrowright':
                    controlsRef.current.right = false;
                    break;
                default:
                    break;
            }
        };

        const handleMouseMove = (e) => {
            controlsRef.current.mouse = {
                x: e.clientX,
                y: e.clientY
            };
        };

        const handleMouseDown = () => {
            controlsRef.current.shooting = true;
        };

        const handleMouseUp = () => {
            controlsRef.current.shooting = false;
        };

        const handleTouchStart = (e) => {
            e.preventDefault();
            const touch = e.touches[0];
            if (touch) {
                controlsRef.current.mouse = {
                    x: touch.clientX,
                    y: touch.clientY
                };
                controlsRef.current.shooting = true;
            }
        };

        const handleTouchMove = (e) => {
            e.preventDefault();
            const touch = e.touches[0];
            if (touch) {
                controlsRef.current.mouse = {
                    x: touch.clientX,
                    y: touch.clientY
                };
            }
        };

        const handleTouchEnd = (e) => {
            e.preventDefault();
            controlsRef.current.shooting = false;
        };

        // Mobile virtual joystick would go here
        // For simplicity, we're using a basic touch system

        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('keyup', handleKeyUp);
        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mousedown', handleMouseDown);
        window.addEventListener('mouseup', handleMouseUp);
        window.addEventListener('touchstart', handleTouchStart, { passive: false });
        window.addEventListener('touchmove', handleTouchMove, { passive: false });
        window.addEventListener('touchend', handleTouchEnd, { passive: false });

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('keyup', handleKeyUp);
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mousedown', handleMouseDown);
            window.removeEventListener('mouseup', handleMouseUp);
            window.removeEventListener('touchstart', handleTouchStart);
            window.removeEventListener('touchmove', handleTouchMove);
            window.removeEventListener('touchend', handleTouchEnd);
        };
    }, []);

    // Cleanup controls
    const cleanupControls = useCallback(() => {
        // Reset controls
        controlsRef.current = {
            up: false,
            down: false,
            left: false,
            right: false,
            mouse: { x: 0, y: 0 },
            shooting: false
        };
    }, []);

    // Send player movement to server
    const sendMovement = useCallback(() => {
        if (!socketRef.current || socketRef.current.readyState !== WebSocket.OPEN) {
            return;
        }

        const player = gameStateRef.current.players.get(gameStateRef.current.selfId);
        if (!player) return;

        let dx = 0, dy = 0;

        if (controlsRef.current.up) dy -= 1;
        if (controlsRef.current.down) dy += 1;
        if (controlsRef.current.left) dx -= 1;
        if (controlsRef.current.right) dx += 1;

        // Normalize diagonal movement
        if (dx !== 0 && dy !== 0) {
            const mag = Math.sqrt(dx * dx + dy * dy);
            dx /= mag;
            dy /= mag;
        }

        // Calculate new position
        const newX = player.x + dx * player.speed;
        const newY = player.y + dy * player.speed;

        // Calculate angle from center of screen to mouse position
        const centerX = viewportRef.current.width / 2;
        const centerY = viewportRef.current.height / 2;
        const angle = Math.atan2(
            controlsRef.current.mouse.y - centerY,
            controlsRef.current.mouse.x - centerX
        );

        // Send movement update
        socketRef.current.send(JSON.stringify({
            type: 'movement',
            x: newX,
            y: newY,
            angle: angle
        }));

        // Send shooting state if shooting
        if (controlsRef.current.shooting) {
            socketRef.current.send(JSON.stringify({
                type: 'shoot',
                angle: angle
            }));
        }
    }, []);

    // Center viewport on player
    const updateViewport = useCallback(() => {
        const self = gameStateRef.current.players.get(gameStateRef.current.selfId);
        if (!self) return;

        viewportRef.current.offsetX = self.x - viewportRef.current.width / 2;
        viewportRef.current.offsetY = self.y - viewportRef.current.height / 2;
    }, []);

    // World to screen coordinate conversion
    const worldToScreen = useCallback((x, y) => {
        return {
            x: (x - viewportRef.current.offsetX) * viewportRef.current.scale,
            y: (y - viewportRef.current.offsetY) * viewportRef.current.scale
        };
    }, []);

    // Draw game state on canvas
    const drawGame = useCallback(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');

        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Draw grid
        drawGrid(ctx);

        // Draw game objects
        drawGameObjects(ctx);

        // Draw projectiles
        drawProjectiles(ctx);

        // Draw players
        drawPlayers(ctx);

        // Draw UI
        drawUI(ctx);
    }, []);

    // Draw background grid
    const drawGrid = useCallback((ctx) => {
        const gridSize = 50;
        const { offsetX, offsetY, width, height } = viewportRef.current;

        ctx.strokeStyle = 'rgba(81, 81, 81, 0.2)';
        ctx.lineWidth = 1;

        // Calculate grid starting positions
        const startX = Math.floor(offsetX / gridSize) * gridSize;
        const startY = Math.floor(offsetY / gridSize) * gridSize;

        // Draw vertical lines
        for (let x = startX; x < startX + width + gridSize; x += gridSize) {
            const screenX = Math.floor((x - offsetX) * viewportRef.current.scale);
            ctx.beginPath();
            ctx.moveTo(screenX, 0);
            ctx.lineTo(screenX, height);
            ctx.stroke();
        }

        // Draw horizontal lines
        for (let y = startY; y < startY + height + gridSize; y += gridSize) {
            const screenY = Math.floor((y - offsetY) * viewportRef.current.scale);
            ctx.beginPath();
            ctx.moveTo(0, screenY);
            ctx.lineTo(width, screenY);
            ctx.stroke();
        }
    }, []);

    // Draw all game objects (polygons, food)
    const drawGameObjects = useCallback((ctx) => {
        const { gameObjects } = gameStateRef.current;

        gameObjects.forEach(obj => {
            const { x, y } = worldToScreen(obj.x, obj.y);

            // Skip if outside viewport
            if (x < -100 || x > viewportRef.current.width + 100 ||
                y < -100 || y > viewportRef.current.height + 100) {
                return;
            }

            ctx.fillStyle = obj.color;

            if (obj.type === 'triangle') {
                drawTriangle(ctx, x, y, obj.radius);
            } else if (obj.type === 'square') {
                drawSquare(ctx, x, y, obj.radius);
            } else if (obj.type === 'pentagon') {
                drawPentagon(ctx, x, y, obj.radius);
            }

            // Draw health bar if damaged
            if (obj.health < (obj.type === 'triangle' ? 30 : obj.type === 'square' ? 60 : 120)) {
                const maxHealth = obj.type === 'triangle' ? 30 : obj.type === 'square' ? 60 : 120;
                // Health bar continuation
                const healthPercent = obj.health / maxHealth;
                const healthBarWidth = obj.radius * 2;
                const healthBarHeight = 4;

                ctx.fillStyle = 'rgba(255, 0, 0, 0.7)';
                ctx.fillRect(x - healthBarWidth / 2, y - obj.radius - 10, healthBarWidth, healthBarHeight);

                ctx.fillStyle = 'rgba(0, 255, 0, 0.7)';
                ctx.fillRect(x - healthBarWidth / 2, y - obj.radius - 10, healthBarWidth * healthPercent, healthBarHeight);
            }
        });
    }, [worldToScreen]);

    // Draw projectiles
    const drawProjectiles = useCallback((ctx) => {
        const { projectiles } = gameStateRef.current;

        projectiles.forEach(proj => {
            const { x, y } = worldToScreen(proj.x, proj.y);

            ctx.beginPath();
            ctx.arc(x, y, proj.radius, 0, Math.PI * 2);
            ctx.fillStyle = proj.color;
            ctx.fill();
        });
    }, [worldToScreen]);

    // Draw players
    const drawPlayers = useCallback((ctx) => {
        const { players, selfId } = gameStateRef.current;

        players.forEach((player) => {
            const { x, y } = worldToScreen(player.x, player.y);

            // Draw tank body
            ctx.save();
            ctx.translate(x, y);
            ctx.rotate(player.angle);

            // Tank body
            ctx.fillStyle = player.color;
            ctx.beginPath();
            ctx.arc(0, 0, player.radius, 0, Math.PI * 2);
            ctx.fill();

            // Tank barrel
            ctx.fillStyle = player.color;
            ctx.fillRect(0, -player.radius / 3, player.radius * 1.5, player.radius / 1.5);

            ctx.restore();

            // Player name
            ctx.fillStyle = 'white';
            ctx.font = '14px Arial';
            ctx.textAlign = 'center';
            ctx.fillText(player.name, x, y - player.radius - 10);

            // Health bar
            const healthPercent = player.health / player.maxHealth;
            const healthBarWidth = player.radius * 2;
            const healthBarHeight = 4;

            ctx.fillStyle = 'rgba(255, 0, 0, 0.7)';
            ctx.fillRect(x - healthBarWidth / 2, y - player.radius - 20, healthBarWidth, healthBarHeight);

            ctx.fillStyle = 'rgba(0, 255, 0, 0.7)';
            ctx.fillRect(x - healthBarWidth / 2, y - player.radius - 20, healthBarWidth * healthPercent, healthBarHeight);
        });
    }, [worldToScreen]);

    // Draw UI elements
    const drawUI = useCallback((ctx) => {
        // Score and level
        ctx.fillStyle = 'white';
        ctx.font = '20px Arial';
        ctx.textAlign = 'left';
        ctx.fillText(`Score: ${stats.score}`, 20, 30);
        ctx.fillText(`Level: ${stats.level}`, 20, 60);

        // Leaderboard
        if (showLeaderboard) {
            const leaderboard = gameStateRef.current.leaderboard;
            ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
            ctx.fillRect(viewportRef.current.width - 200, 10, 190, 30 + leaderboard.length * 25);

            ctx.fillStyle = 'white';
            ctx.font = '16px Arial';
            ctx.textAlign = 'left';
            ctx.fillText('Leaderboard', viewportRef.current.width - 190, 30);

            leaderboard.forEach((player, index) => {
                ctx.fillText(`${index + 1}. ${player.name} - ${player.score}`,
                    viewportRef.current.width - 190, 55 + index * 25);
            });
        }

        // Mobile controls
        if ('ontouchstart' in window) {
            drawMobileControls(ctx);
        }
    }, [stats, showLeaderboard]);

    // Draw mobile-specific controls
    const drawMobileControls = useCallback((ctx) => {
        // Virtual joystick
        ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
        ctx.beginPath();
        ctx.arc(100, viewportRef.current.height - 100, 50, 0, Math.PI * 2);
        ctx.fill();

        // Shoot button
        ctx.beginPath();
        ctx.arc(viewportRef.current.width - 100, viewportRef.current.height - 100, 40, 0, Math.PI * 2);
        ctx.fill();
    }, []);

    // Game loop
    const startGameLoop = useCallback(() => {
        const gameLoop = () => {
            if (connected && !gameOver) {
                sendMovement();
                updateViewport();
                drawGame();
            }
            animationFrameRef.current = requestAnimationFrame(gameLoop);
        };

        gameLoop();
    }, [connected, gameOver, sendMovement, updateViewport, drawGame]);

    return (
        <div className="game-container">
            <canvas ref={canvasRef} className="game-canvas" />
            {gameOver && (
                <div className="game-over">
                    <h2>Game Over</h2>
                    <p>Score: {stats.score}</p>
                    <button onClick={() => navigate('/')}>Return to Menu</button>
                </div>
            )}
        </div>
    );
}

export default GameScreen;