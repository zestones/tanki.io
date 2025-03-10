import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Client } from 'colyseus.js';
import { config } from '../config/config';

import Joystick from '../components/game/Joystick';
import { useFullscreen } from '../hooks/useFullScreen';

export default function Controller() {
    const navigate = useNavigate();
    const [room, setRoom] = useState(null);
    const [health, setHealth] = useState(3);
    const [username, setUsername] = useState('');
    const [isConnecting, setIsConnecting] = useState(true);
    const hasConnected = useRef(false);
    const containerRef = useRef(null);

    const { isFullscreen, enterFullscreen } = useFullscreen(containerRef);

    // Setup game environment
    useEffect(() => {
        // Prevent scrolling
        document.body.style.overflow = 'hidden';
        document.body.style.position = 'fixed';
        document.body.style.width = '100%';
        document.body.style.height = '100%';
        document.body.style.touchAction = 'none';

        // Prevent touchmove events
        const preventDefault = (e) => e.preventDefault();
        document.addEventListener('touchmove', preventDefault, { passive: false });

        // Try to lock orientation if supported
        if (window.screen?.orientation) {
            try {
                window.screen.orientation.lock('landscape-primary')
                    .catch(() => window.screen.orientation.lock('landscape-secondary')
                        .catch(e => console.log('Orientation lock not supported:', e))
                    );
            } catch (e) {
                console.log('Orientation API not supported:', e);
            }
        }

        return () => {
            // Cleanup
            if (window.screen?.orientation) {
                window.screen.orientation.unlock();
            }
            document.body.style.overflow = '';
            document.body.style.position = '';
            document.body.style.width = '';
            document.body.style.height = '';
            document.body.style.touchAction = '';
            document.removeEventListener('touchmove', preventDefault);
        };
    }, []);

    // Connect to game server
    useEffect(() => {
        if (hasConnected.current) return;

        const storedUsername = sessionStorage.getItem('username');
        if (!storedUsername) {
            navigate('/');
            return;
        }

        setUsername(storedUsername);
        const client = new Client(config.wsUrl);
        setIsConnecting(true);
        hasConnected.current = true;

        client.joinOrCreate('game', { username: storedUsername })
            .then(room => {
                setRoom(room);
                setIsConnecting(false);

                room.onStateChange((state) => {
                    const myPlayer = state.players.get(room.sessionId);
                    if (myPlayer) {
                        setHealth(myPlayer.hp);
                    }
                });
            })
            .catch(e => {
                hasConnected.current = false;
                console.error('Could not join room:', e);
                setIsConnecting(false);
                navigate('/');
            });

        return () => {
            if (room) room.leave();
        };
    }, [navigate]);

    // Game control handlers
    const handleMove = (direction, isMoving) => {
        if (room) {
            room.send('move', { direction, moving: isMoving });
        }
    };

    const handleStopMoving = (lastDirection) => {
        if (room) {
            room.send('move', { direction: lastDirection, moving: false });
        }
    };

    const handleShoot = () => {
        if (room) {
            room.send('shoot');
        }
    };

    // Loading screen
    if (isConnecting) {
        return (
            <div className="fixed inset-0 bg-gradient-to-r from-gray-900 to-gray-800 flex items-center justify-center">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-white text-lg">Connecting to battlefield...</p>
                </div>
            </div>
        );
    }

    return (
        <div
            ref={containerRef}
            className="fixed inset-0 bg-gradient-to-r from-gray-900 to-gray-800 flex items-center justify-center overflow-hidden select-none"
        >
            {/* Fullscreen button */}
            {!isFullscreen && (
                <button
                    onClick={enterFullscreen}
                    className="absolute top-2 right-2 z-50 bg-indigo-600 text-white rounded-full p-2 shadow-lg"
                    aria-label="Enter fullscreen mode"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5v-4m0 4h-4m4 0l-5-5" />
                    </svg>
                </button>
            )}

            <div className="w-full h-full flex flex-row items-center justify-between px-4 py-2">
                {/* Left side - Joystick Control */}
                <div className="flex-1 flex items-center justify-center">
                    <Joystick onMove={handleMove} onStop={handleStopMoving} />
                </div>

                {/* Center - Player info */}
                <div className="absolute top-2 left-0 right-0 mx-auto w-fit bg-black/50 backdrop-blur-md rounded-full px-4 py-1.5 flex items-center gap-3 shadow-lg border border-indigo-500/20">
                    <div className="text-white font-semibold">{username}</div>
                    <div className="flex space-x-1">
                        {[...Array(3)].map((_, i) => (
                            <div
                                key={i}
                                className={`w-4 h-4 rounded-full ${i < health ? 'bg-green-500' : 'bg-gray-700'} transition-colors duration-300 ${i < health ? 'shadow-sm shadow-green-300' : ''}`}
                            ></div>
                        ))}
                    </div>
                </div>

                {/* Right side - Fire button */}
                <div className="flex-1 flex items-center justify-center">
                    <button
                        className="w-32 h-32 rounded-full bg-gradient-to-r from-red-500 to-red-700 text-white font-bold text-2xl shadow-xl flex items-center justify-center active:scale-95 transition-all transform-gpu relative overflow-hidden active:shadow-red-500/50"
                        onTouchStart={handleShoot}
                        onMouseDown={handleShoot}
                    >
                        <div className="absolute inset-0 bg-white/10 rounded-full scale-90 transition-transform"></div>
                        <div className="absolute inset-0 flex items-center justify-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                            </svg>
                        </div>
                    </button>
                </div>
            </div>
        </div>
    );
}