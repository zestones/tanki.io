import { useState, useEffect } from 'react';

function GameScreen() {
    const [gameState, setGameState] = useState({
        players: [
            { id: 'player1', x: 100, y: 100, angle: 0, color: '#FF5733', name: 'Player 1', score: 0, health: 100 },
            { id: 'player2', x: 300, y: 200, angle: 45, color: '#33FF57', name: 'Player 2', score: 0, health: 100 },
            { id: 'player3', x: 500, y: 300, angle: 90, color: '#3357FF', name: 'Player 3', score: 0, health: 100 },
        ],
        gameStatus: 'in-progress', // 'waiting', 'in-progress', 'finished'
        timeRemaining: 300, // in seconds
        connectedDevices: 3,
    });

    return (
        <div className="relative w-screen h-screen bg-gray-900 overflow-hidden">
            {/* Game Status Bar */}
            <div className="fixed top-0 left-0 w-full bg-black/70 p-4 flex justify-between items-center">
                <div className="text-white">
                    <h1 className="text-2xl font-bold">Tank Battle Arena</h1>
                    <p>Connected Players: {gameState.connectedDevices}</p>
                </div>

                <div className="text-white text-2xl">
                    Time: {Math.floor(gameState.timeRemaining / 60)}:{(gameState.timeRemaining % 60).toString().padStart(2, '0')}
                </div>

                <div className="text-white">
                    <p>Game Status: {gameState.gameStatus}</p>
                    <p>Room Code: ABCD123</p>
                </div>
            </div>

            {/* Main Game Arena */}
            <div className="absolute inset-0 mt-16">
                {gameState.players.map(player => (
                    <div
                        key={player.id}
                        className="absolute transform -translate-x-1/2 -translate-y-1/2"
                        style={{
                            left: player.x,
                            top: player.y,
                        }}
                    >
                        {/* Tank Body */}
                        <div
                            className="w-16 h-16 rounded-full relative"
                            style={{
                                backgroundColor: player.color,
                                transform: `rotate(${player.angle}deg)`,
                            }}
                        >
                            {/* Tank Cannon */}
                            <div
                                className="absolute w-12 h-4 right-0 top-1/2 -translate-y-1/2"
                                style={{ backgroundColor: `${player.color}dd` }}
                            />

                            {/* Player Name */}
                            <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 whitespace-nowrap">
                                <span className="text-white bg-black/50 px-2 py-1 rounded text-sm">
                                    {player.name}
                                </span>
                            </div>

                            {/* Health Bar */}
                            <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 w-20 h-2 bg-gray-800 rounded">
                                <div
                                    className="h-full bg-green-500 rounded"
                                    style={{ width: `${player.health}%` }}
                                />
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Scoreboard */}
            <div className="fixed top-20 right-4 bg-black/70 p-4 rounded">
                <h2 className="text-white font-bold mb-2 text-xl">Scoreboard</h2>
                <div className="space-y-2">
                    {gameState.players
                        .sort((a, b) => b.score - a.score)
                        .map((player, index) => (
                            <div
                                key={player.id}
                                className="flex items-center gap-3 text-white"
                            >
                                <div
                                    className="w-3 h-3 rounded-full"
                                    style={{ backgroundColor: player.color }}
                                />
                                <span>{player.name}</span>
                                <span className="ml-auto">{player.score}</span>
                            </div>
                        ))}
                </div>
            </div>

            {/* Connection Instructions */}
            {gameState.players.length === 0 && (
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="bg-black/70 p-8 rounded-lg text-white text-center">
                        <h2 className="text-2xl font-bold mb-4">Join the Game!</h2>
                        <p className="text-xl mb-4">Room Code: ABCD123</p>
                        <p>Scan QR code or visit game.example.com to join</p>
                        <div className="mt-4 p-4 bg-white w-32 h-32 mx-auto">
                            {/* Placeholder for QR Code */}
                            <div className="w-full h-full bg-black/10" />
                        </div>
                    </div>
                </div>
            )}

            {/* Game Messages */}
            <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2">
                <div className="bg-black/70 text-white px-4 py-2 rounded text-lg">
                    Player 2 eliminated Player 1!
                </div>
            </div>
        </div>
    );
}

export default GameScreen;