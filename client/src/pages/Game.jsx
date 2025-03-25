import { Client } from 'colyseus.js';
import { useEffect, useRef, useState } from 'react';
import { Layer, Stage } from 'react-konva';

import Arena from '../components/game/arena/Arena';
import Leaderboard from '../components/game/arena/Leaderboard';
import Footer from '../components/spectator/layout/Footer';
import Header from '../components/spectator/layout/Header';
import StatsPanel from '../components/spectator/layout/StatsPanel';
import ErrorScreen from '../components/common/ErrorScreen';
import LoadingScreen from '../components/common/LoadingScreen';
import { config } from '../config/config';
import useViewportSize from '../hooks/useViewportSize';

function Game() {
    const [gameState, setGameState] = useState({
        players: new Map(),
        bullets: [],
        explosions: [],
        arenaWidth: 2000,
        arenaHeight: 1200
    });
    const [isConnecting, setIsConnecting] = useState(true);
    const [error, setError] = useState(null);
    const [showStats, setShowStats] = useState(false);
    const stageRef = useRef(null);
    const containerRef = useRef(null);
    const viewportSize = useViewportSize(containerRef);
    const roomRef = useRef(null);

    // State for specialist effects
    const [specialistEffects, setSpecialistEffects] = useState([]);

    // Send viewport size to server when it changes
    useEffect(() => {
        if (roomRef.current && viewportSize.width && viewportSize.height) {
            roomRef.current.send('updateArenaSize', {
                width: viewportSize.width,
                height: viewportSize.height
            });
        }
    }, [viewportSize.width, viewportSize.height]);

    useEffect(() => {
        const client = new Client(config.wsUrl);
        setIsConnecting(true);

        client.joinOrCreate('game', { isSpectator: true }).then(room => {
            setIsConnecting(false);
            roomRef.current = room;

            // Send initial viewport size
            if (viewportSize.width && viewportSize.height) {
                room.send('updateArenaSize', {
                    width: viewportSize.width,
                    height: viewportSize.height
                });
            }

            room.onStateChange((state) => {
                setGameState({
                    players: state.players,
                    bullets: Array.from(state.bullets),
                    explosions: Array.from(state.explosions),
                    arenaWidth: state.arenaWidth,
                    arenaHeight: state.arenaHeight
                });
            });

            // Listen for specialist activation events
            room.onMessage("specialistActivated", (message) => {
                console.log("Specialist activated:", message);

                // Create a new specialist effect
                const effectId = `specialist-${Date.now()}`;
                const effectDuration = message.duration;
                const newEffect = {
                    id: effectId,
                    playerId: message.playerId,
                    type: message.effectType,
                    position: message.position,
                    targetPosition: message.targetPosition,
                    createdAt: Date.now(),
                    duration: effectDuration,
                    name: message.specialistName
                };

                // Add the new effect to the list
                setSpecialistEffects(prevEffects => [...prevEffects, newEffect]);

                // Remove the effect after it expires
                setTimeout(() => {
                    setSpecialistEffects(prevEffects =>
                        prevEffects.filter(effect => effect.id !== effectId)
                    );
                }, effectDuration);
            });

        }).catch(e => {
            console.error('Could not join room as spectator:', e);
            setIsConnecting(false);
            setError("Failed to connect to game server");
        });

        // Cleanup on unmount
        return () => {
            if (roomRef.current) {
                roomRef.current.leave();
            }
        };
    }, []);

    // Clean up expired specialist effects
    useEffect(() => {
        const now = Date.now();
        const cleanupEffects = () => {
            setSpecialistEffects(prevEffects =>
                prevEffects.filter(effect => now < effect.createdAt + effect.duration)
            );
        };

        const intervalId = setInterval(cleanupEffects, 1000);
        return () => clearInterval(intervalId);
    }, []);

    if (isConnecting) {
        return <LoadingScreen title={'Connecting to the battlefield'} message={'Establishing secure connection to the tactical warfare network... Please wait.'} />;
    }

    if (error) {
        return <ErrorScreen error={error} />;
    }

    return (
        <div className="flex flex-col h-screen bg-[#141418] overflow-hidden relative">
            <Header
                playersCount={gameState.players.size}
                bulletsCount={gameState.bullets.length}
                showStats={showStats}
                onToggleStats={() => setShowStats(!showStats)}
            />

            <div
                ref={containerRef}
                className="flex-1 w-full overflow-hidden"
            >
                <Stage
                    ref={stageRef}
                    width={viewportSize.width || window.innerWidth}
                    height={viewportSize.height || window.innerHeight - 100}
                    className="w-full h-full"
                >
                    <Layer>
                        <Arena
                            gameState={gameState}
                            specialistEffects={specialistEffects}
                        />
                    </Layer>
                </Stage>

                {/* Specialist notifications */}
                <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-10 flex flex-col items-center">
                    {specialistEffects.map(effect => {
                        // Get player data
                        const player = gameState.players.get(effect.playerId);
                        if (!player) return null;

                        // Determine color based on effect type
                        const effectColors = {
                            'dash': 'from-blue-500 to-cyan-300',
                            'shield': 'from-green-500 to-emerald-300',
                            'homing': 'from-red-500 to-orange-300',
                            'decoy': 'from-purple-500 to-indigo-300',
                            'aoe': 'from-yellow-500 to-amber-300'
                        };

                        const colorClass = effectColors[effect.type] || 'from-gray-500 to-gray-300';

                        return (
                            <div
                                key={effect.id}
                                className={`mb-2 px-4 py-1 rounded-md bg-gradient-to-r ${colorClass} text-white font-bold text-sm animate-fade-up`}
                            >
                                {player.username} activated {effect.name}
                            </div>
                        );
                    })}
                </div>

                <Leaderboard players={gameState.players} />
                {showStats && (
                    <StatsPanel
                        gameState={gameState}
                        viewportSize={viewportSize}
                    />
                )}

                <div className="absolute inset-0 bg-[linear-gradient(transparent_50%,rgba(255,255,255,0.02)_50%)] bg-[length:100%_2px] pointer-events-none z-10"></div>

                {/* Hexagonal center decoration - white/light variant */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 opacity-10 pointer-events-none">
                    <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" fill="none">
                        <polygon points="50,3 97,25 97,75 50,97 3,75 3,25" stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
                        <polygon points="50,15 85,30 85,70 50,85 15,70 15,30" stroke="rgba(255,255,255,0.15)" strokeWidth="1" />
                        <polygon points="50,30 70,40 70,60 50,70 30,60 30,40" stroke="rgba(255,255,255,0.25)" strokeWidth="1" />
                    </svg>
                </div>
            </div>

            <Footer />

            <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-white/30 via-transparent to-white/30"></div>
        </div>
    );
}

export default Game;