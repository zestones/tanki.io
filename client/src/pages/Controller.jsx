import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Client } from 'colyseus.js';

export default function Controller() {
    const navigate = useNavigate();
    const [room, setRoom] = useState(null);
    const [direction, setDirection] = useState(0);
    const [health, setHealth] = useState(3);
    const [username, setUsername] = useState('');
    const [isConnecting, setIsConnecting] = useState(true);
    const hasConnected = useRef(false);

    useEffect(() => {
        console.log("USE EFFECT");
        if (hasConnected.current) return;

        const storedUsername = sessionStorage.getItem('username');
        if (!storedUsername) {
            navigate('/');
            return;
        }

        setUsername(storedUsername);
        const client = new Client('ws://localhost:3000');
        setIsConnecting(true);
        hasConnected.current = true;
        client.joinOrCreate('game', { username: storedUsername }).then(room => {
            setRoom(room);
            setIsConnecting(false);

            room.onStateChange((state) => {
                const myPlayer = state.players.get(room.sessionId);
                if (myPlayer) {
                    setHealth(myPlayer.hp);
                }
            });
        }).catch(e => {
            hasConnected.current = false;
            console.error('Could not join room:', e);
            setIsConnecting(false);
            navigate('/');
        });

        return () => {
            if (room) room.leave();
        };
    }, [navigate]);

    const handleMove = (newDirection) => {
        if (room) {
            setDirection(newDirection);
            room.send('move', { direction: newDirection });
        }
    };

    const handleShoot = () => {
        if (room) {
            room.send('shoot');
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex flex-col items-center p-4">
            {isConnecting ? (
                <div className="flex-1 flex items-center justify-center">
                    <div className="text-center">
                        <div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                        <p className="text-white text-lg">Connecting to battlefield...</p>
                    </div>
                </div>
            ) : (
                <>
                    <div className="w-full max-w-md bg-black/30 backdrop-blur-sm rounded-xl shadow-lg p-4 mb-6">
                        <div className="flex justify-between items-center">
                            <div>
                                <h2 className="text-xl font-bold text-white">{username}</h2>
                                <p className="text-gray-400 text-sm">Commander</p>
                            </div>
                            <div className="flex space-x-1">
                                {[...Array(3)].map((_, i) => (
                                    <div
                                        key={i}
                                        className={`w-6 h-6 rounded-md ${i < health ? 'bg-green-500' : 'bg-gray-700'}`}
                                    ></div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="flex-1 flex flex-col items-center justify-between py-8">
                        <div className="grid grid-cols-3 gap-4 mb-12">
                            <div className="col-start-2">
                                <button
                                    className="w-20 h-20 bg-gradient-to-r from-indigo-600 to-indigo-700 rounded-xl flex items-center justify-center text-white text-2xl shadow-lg active:scale-95 transition-transform"
                                    onTouchStart={() => handleMove(90)}
                                    onTouchEnd={() => handleMove(direction)}
                                    onMouseDown={() => handleMove(90)}
                                    onMouseUp={() => handleMove(direction)}
                                >
                                    ↑
                                </button>
                            </div>
                            <div className="col-start-1">
                                <button
                                    className="w-20 h-20 bg-gradient-to-r from-indigo-600 to-indigo-700 rounded-xl flex items-center justify-center text-white text-2xl shadow-lg active:scale-95 transition-transform"
                                    onTouchStart={() => handleMove(180)}
                                    onTouchEnd={() => handleMove(direction)}
                                    onMouseDown={() => handleMove(180)}
                                    onMouseUp={() => handleMove(direction)}
                                >
                                    ←
                                </button>
                            </div>
                            <div className="col-start-3">
                                <button
                                    className="w-20 h-20 bg-gradient-to-r from-indigo-600 to-indigo-700 rounded-xl flex items-center justify-center text-white text-2xl shadow-lg active:scale-95 transition-transform"
                                    onTouchStart={() => handleMove(0)}
                                    onTouchEnd={() => handleMove(direction)}
                                    onMouseDown={() => handleMove(0)}
                                    onMouseUp={() => handleMove(direction)}
                                >
                                    →
                                </button>
                            </div>
                            <div className="col-start-2">
                                <button
                                    className="w-20 h-20 bg-gradient-to-r from-indigo-600 to-indigo-700 rounded-xl flex items-center justify-center text-white text-2xl shadow-lg active:scale-95 transition-transform"
                                    onTouchStart={() => handleMove(270)}
                                    onTouchEnd={() => handleMove(direction)}
                                    onMouseDown={() => handleMove(270)}
                                    onMouseUp={() => handleMove(direction)}
                                >
                                    ↓
                                </button>
                            </div>
                        </div>

                        <button
                            className="w-36 h-36 rounded-full bg-gradient-to-r from-red-500 to-red-700 text-white font-bold text-2xl shadow-xl flex items-center justify-center active:scale-95 transition-transform"
                            onTouchStart={handleShoot}
                            onMouseDown={handleShoot}
                        >
                            FIRE
                        </button>
                    </div>
                </>
            )}
        </div>
    );
} 