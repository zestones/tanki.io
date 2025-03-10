import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Client } from 'colyseus.js';

export default function Controller() {
    const navigate = useNavigate();
    const [room, setRoom] = useState(null);
    const [direction, setDirection] = useState(0);

    useEffect(() => {
        const username = sessionStorage.getItem('username');
        if (!username) {
            navigate('/');
            return;
        }

        const client = new Client('ws://localhost:3000');
        client.joinOrCreate('game', { username }).then(room => {
            setRoom(room);
        }).catch(e => {
            console.error('Could not join room:', e);
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
        <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
            <div className="mb-8 text-center">
                <h2 className="text-2xl font-bold text-gray-800">Tank Controller</h2>
                <p className="text-gray-600">Use the controls to move and shoot</p>
            </div>

            <div className="grid grid-cols-3 gap-2 mb-8">
                <div className="col-start-2">
                    <button
                        className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center hover:bg-gray-300 active:bg-gray-400"
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
                        className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center hover:bg-gray-300 active:bg-gray-400"
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
                        className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center hover:bg-gray-300 active:bg-gray-400"
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
                        className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center hover:bg-gray-300 active:bg-gray-400"
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
                className="w-32 h-32 bg-red-500 rounded-full text-white font-bold text-xl hover:bg-red-600 active:bg-red-700"
                onTouchStart={handleShoot}
                onMouseDown={handleShoot}
            >
                SHOOT
            </button>
        </div>
    );
} 