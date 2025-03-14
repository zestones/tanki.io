import { Client } from 'colyseus.js';
import { useEffect, useRef, useState } from 'react';
import { Layer, Stage } from 'react-konva';

import Arena from '../components/game/Arena';
import Leaderboard from '../components/game/Leaderboard';
import Footer from '../components/layout/Footer';
import Header from '../components/layout/Header';
import StatsPanel from '../components/layout/StatsPanel';
import ErrorScreen from '../components/ui/ErrorScreen';
import LoadingScreen from '../components/ui/LoadingScreen';
import { config } from '../config/config';
import useViewportSize from '../hooks/useViewportSize';

export default function Game() {
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
        }).catch(e => {
            console.error('Could not join room as spectator:', e);
            setIsConnecting(false);
            setError("Failed to connect to game server");
        });
    }, []);

    if (isConnecting) {
        return <LoadingScreen />;
    }

    if (error) {
        return <ErrorScreen error={error} />;
    }

    return (
        <div className="flex flex-col h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-black overflow-hidden">
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
                        <Arena gameState={gameState} />
                    </Layer>
                </Stage>

                <Leaderboard players={gameState.players} />
                {showStats && (
                    <StatsPanel
                        gameState={gameState}
                        viewportSize={viewportSize}
                    />
                )}
            </div>

            <Footer />
        </div>
    );
}