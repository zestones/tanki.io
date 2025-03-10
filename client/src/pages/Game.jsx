import { useEffect, useState } from 'react';
import { Stage, Layer, Rect, Circle, Text, Line } from 'react-konva';
import { Client } from 'colyseus.js';

const TANK_SIZE = 30;
const BULLET_SIZE = 5;

export default function Game() {
    const [gameState, setGameState] = useState({
        players: new Map(),
        bullets: [],
        arenaWidth: 800,
        arenaHeight: 600
    });
    const [isConnecting, setIsConnecting] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const client = new Client('ws://localhost:3000');
        setIsConnecting(true);

        client.join('game', { isSpectator: true }).then(room => {
            setIsConnecting(false);

            room.onStateChange((state) => {
                setGameState({
                    players: state.players,
                    bullets: Array.from(state.bullets),
                    arenaWidth: state.arenaWidth,
                    arenaHeight: state.arenaHeight
                });
            });
        }).catch(e => {
            console.error('Could not join room as spectator:', e);
            setIsConnecting(false);
            setError("Failed to connect to game server");
        });
    }, []);

    const renderTank = (player, sessionId) => {
        if (player.isDead) return null;

        const rotation = player.direction;
        const barrelLength = TANK_SIZE;

        // Color based on health
        let fillColor = "#4CAF50"; // Green for full health
        if (player.hp === 2) fillColor = "#FFC107"; // Yellow for medium health
        if (player.hp === 1) fillColor = "#F44336"; // Red for low health

        return (
            <>
                {/* Tank shadow */}
                <Circle
                    x={player.x + 3}
                    y={player.y + 3}
                    radius={TANK_SIZE / 2}
                    fill="rgba(0,0,0,0.3)"
                />

                {/* Tank body */}
                <Circle
                    key={`tank-${sessionId}`}
                    x={player.x}
                    y={player.y}
                    radius={TANK_SIZE / 2}
                    fill={fillColor}
                    stroke="#000"
                    strokeWidth={2}
                />

                {/* Tank barrel */}
                <Line
                    points={[
                        player.x,
                        player.y,
                        player.x + Math.cos((rotation * Math.PI) / 180) * barrelLength,
                        player.y - Math.sin((rotation * Math.PI) / 180) * barrelLength
                    ]}
                    stroke="#000"
                    strokeWidth={4}
                    lineCap="round"
                />

                {/* Player name */}
                <Text
                    x={player.x - 50}
                    y={player.y + TANK_SIZE + 5}
                    text={player.username}
                    fontSize={14}
                    fill="#FFF"
                    align="center"
                    width={100}
                    shadowColor="black"
                    shadowBlur={2}
                    shadowOffset={{ x: 1, y: 1 }}
                    shadowOpacity={0.8}
                />

                {/* HP bar background */}
                <Rect
                    x={player.x - 20}
                    y={player.y - TANK_SIZE - 15}
                    width={40}
                    height={6}
                    fill="#333"
                    cornerRadius={3}
                />

                {/* HP bar */}
                <Rect
                    x={player.x - 20}
                    y={player.y - TANK_SIZE - 15}
                    width={(player.hp / 3) * 40}
                    height={6}
                    fill={fillColor}
                    cornerRadius={3}
                />
            </>
        );
    };

    if (isConnecting) {
        return (
            <div className="min-h-screen bg-gray-900 flex items-center justify-center">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-white text-lg">Loading battlefield...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-900 flex items-center justify-center">
                <div className="text-center text-red-500">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    <p className="text-xl">{error}</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                    >
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center p-4">
            <div className="mb-4 flex justify-between items-center w-full max-w-4xl">
                <h1 className="text-3xl font-bold text-white">TANK.IO</h1>
                <div className="text-white">
                    Players: {gameState.players.size}
                </div>
            </div>

            <div className="relative">
                <Stage
                    width={gameState.arenaWidth}
                    height={gameState.arenaHeight}
                    className="rounded-lg shadow-2xl overflow-hidden"
                >
                    <Layer>
                        {/* Background grid */}
                        {Array.from({ length: 20 }).map((_, i) => (
                            <Line
                                key={`grid-h-${i}`}
                                points={[0, i * 30, gameState.arenaWidth, i * 30]}
                                stroke="rgba(255,255,255,0.1)"
                                strokeWidth={1}
                            />
                        ))}
                        {Array.from({ length: 27 }).map((_, i) => (
                            <Line
                                key={`grid-v-${i}`}
                                points={[i * 30, 0, i * 30, gameState.arenaHeight]}
                                stroke="rgba(255,255,255,0.1)"
                                strokeWidth={1}
                            />
                        ))}

                        {/* Arena border */}
                        <Rect
                            x={0}
                            y={0}
                            width={gameState.arenaWidth}
                            height={gameState.arenaHeight}
                            stroke="#555"
                            strokeWidth={2}
                            fill="#1a1a2e"
                        />

                        {/* Render bullets with glow effect */}
                        {gameState.bullets.map((bullet, index) => (
                            <>
                                <Circle
                                    key={`bullet-glow-${index}`}
                                    x={bullet.x}
                                    y={bullet.y}
                                    radius={BULLET_SIZE * 2}
                                    fill="rgba(255, 165, 0, 0.2)"
                                />
                                <Circle
                                    key={`bullet-${index}`}
                                    x={bullet.x}
                                    y={bullet.y}
                                    radius={BULLET_SIZE}
                                    fill="#FFA500"
                                />
                            </>
                        ))}

                        {/* Render tanks */}
                        {Array.from(gameState.players.entries()).map(([sessionId, player]) =>
                            renderTank(player, sessionId)
                        )}
                    </Layer>
                </Stage>

                {/* Spectator overlay */}
                <div className="absolute top-4 right-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
                    Spectator Mode
                </div>
            </div>

            <div className="mt-4 text-sm text-gray-400">
                Use your mobile device to join the game at <span className="text-indigo-400">http://localhost:5173</span>
            </div>
        </div>
    );
} 