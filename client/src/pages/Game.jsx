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

    useEffect(() => {
        const client = new Client('ws://localhost:3000');
        client.join('game', { isSpectator: true }).then(room => {
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
        });
    }, []);

    const renderTank = (player, sessionId) => {
        if (player.isDead) return null;

        const rotation = player.direction;
        const barrelLength = TANK_SIZE;

        return (
            <>
                {/* Tank body */}
                <Circle
                    key={`tank-${sessionId}`}
                    x={player.x}
                    y={player.y}
                    radius={TANK_SIZE / 2}
                    fill={player.hp === 3 ? "#4CAF50" : player.hp === 2 ? "#FFC107" : "#F44336"}
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
                />
                {/* Player name */}
                <Text
                    x={player.x - 30}
                    y={player.y + TANK_SIZE}
                    text={player.username}
                    fontSize={14}
                    fill="#000"
                    align="center"
                    width={60}
                />
                {/* HP indicator */}
                <Text
                    x={player.x - 10}
                    y={player.y - TANK_SIZE - 10}
                    text={`HP: ${player.hp}`}
                    fontSize={12}
                    fill="#000"
                    align="center"
                    width={20}
                />
            </>
        );
    };

    return (
        <div className="min-h-screen bg-gray-900 flex items-center justify-center">
            <Stage
                width={gameState.arenaWidth}
                height={gameState.arenaHeight}
                className="bg-white rounded-lg shadow-lg"
            >
                <Layer>
                    {/* Arena border */}
                    <Rect
                        x={0}
                        y={0}
                        width={gameState.arenaWidth}
                        height={gameState.arenaHeight}
                        stroke="#000"
                        strokeWidth={2}
                    />

                    {/* Render tanks */}
                    {Array.from(gameState.players.entries()).map(([sessionId, player]) =>
                        renderTank(player, sessionId)
                    )}

                    {/* Render bullets */}
                    {gameState.bullets.map((bullet, index) => (
                        <Circle
                            key={`bullet-${index}`}
                            x={bullet.x}
                            y={bullet.y}
                            radius={BULLET_SIZE}
                            fill="#000"
                        />
                    ))}
                </Layer>
            </Stage>
        </div>
    );
} 