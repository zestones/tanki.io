import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Client } from 'colyseus.js';
import { config } from '../config/config';

export default function Controller() {
    const navigate = useNavigate();
    const [room, setRoom] = useState(null);
    const [health, setHealth] = useState(3);
    const [username, setUsername] = useState('');
    const [isConnecting, setIsConnecting] = useState(true);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const hasConnected = useRef(false);
    const containerRef = useRef(null);

    // Joystick state
    const [joystickPos, setJoystickPos] = useState({ x: 0, y: 0 });
    const [isDragging, setIsDragging] = useState(false);
    const joystickRef = useRef(null);
    const baseRef = useRef(null);

    // Request fullscreen and lock orientation
    const enterFullscreen = () => {
        if (!containerRef.current) return;

        const element = containerRef.current;

        // Request fullscreen
        if (element.requestFullscreen) {
            element.requestFullscreen().then(() => setIsFullscreen(true))
                .catch(err => console.error('Error attempting to enable fullscreen:', err));
        } else if (element.mozRequestFullScreen) { // Firefox
            element.mozRequestFullScreen().then(() => setIsFullscreen(true))
                .catch(err => console.error('Error attempting to enable fullscreen:', err));
        } else if (element.webkitRequestFullscreen) { // Chrome, Safari & Opera
            element.webkitRequestFullscreen().then(() => setIsFullscreen(true))
                .catch(err => console.error('Error attempting to enable fullscreen:', err));
        } else if (element.msRequestFullscreen) { // IE/Edge
            element.msRequestFullscreen().then(() => setIsFullscreen(true))
                .catch(err => console.error('Error attempting to enable fullscreen:', err));
        }
    };

    // Exit fullscreen
    const exitFullscreen = () => {
        if (document.exitFullscreen) {
            document.exitFullscreen().then(() => setIsFullscreen(false))
                .catch(err => console.error('Error attempting to exit fullscreen:', err));
        } else if (document.mozCancelFullScreen) { // Firefox
            document.mozCancelFullScreen().then(() => setIsFullscreen(false))
                .catch(err => console.error('Error attempting to exit fullscreen:', err));
        } else if (document.webkitExitFullscreen) { // Chrome, Safari & Opera
            document.webkitExitFullscreen().then(() => setIsFullscreen(false))
                .catch(err => console.error('Error attempting to exit fullscreen:', err));
        } else if (document.msExitFullscreen) { // IE/Edge
            document.msExitFullscreen().then(() => setIsFullscreen(false))
                .catch(err => console.error('Error attempting to exit fullscreen:', err));
        }
    };

    // Toggle fullscreen
    const toggleFullscreen = () => {
        if (!isFullscreen) {
            enterFullscreen();
        } else {
            exitFullscreen();
        }
    };

    // Force landscape orientation and prevent scrolling
    useEffect(() => {
        // Lock to landscape orientation if supported
        if (window.screen && window.screen.orientation) {
            try {
                // Try to lock to landscape-primary first
                window.screen.orientation.lock('landscape-primary').catch(() => {
                    // If that fails, try landscape-secondary
                    window.screen.orientation.lock('landscape-secondary').catch(e => {
                        console.log('Orientation lock not supported or allowed:', e);
                    });
                });
            } catch (e) {
                console.log('Orientation API not supported:', e);
            }
        }

        // Add orientation change listener
        const handleOrientationChange = () => {
            if (window.screen && window.screen.orientation) {
                const orientation = window.screen.orientation.type;
                console.log('Current orientation:', orientation);
            }
        };

        window.addEventListener('orientationchange', handleOrientationChange);

        // Prevent page scrolling
        const preventDefault = (e) => {
            e.preventDefault();
        };

        // Prevent pull-to-refresh and unwanted scrolling
        document.body.style.overflow = 'hidden';
        document.body.style.position = 'fixed';
        document.body.style.width = '100%';
        document.body.style.height = '100%';
        document.body.style.touchAction = 'none';

        // Prevent touchmove events except for our joystick
        document.addEventListener('touchmove', preventDefault, { passive: false });

        // Listen for fullscreen change
        const handleFullscreenChange = () => {
            setIsFullscreen(!!(
                document.fullscreenElement ||
                document.mozFullScreenElement ||
                document.webkitFullscreenElement ||
                document.msFullscreenElement
            ));
        };

        document.addEventListener('fullscreenchange', handleFullscreenChange);
        document.addEventListener('mozfullscreenchange', handleFullscreenChange);
        document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
        document.addEventListener('msfullscreenchange', handleFullscreenChange);

        // Clean up
        return () => {
            if (window.screen && window.screen.orientation) {
                window.screen.orientation.unlock();
            }
            window.removeEventListener('orientationchange', handleOrientationChange);
            document.body.style.overflow = '';
            document.body.style.position = '';
            document.body.style.width = '';
            document.body.style.height = '';
            document.body.style.touchAction = '';
            document.removeEventListener('touchmove', preventDefault);
            document.removeEventListener('fullscreenchange', handleFullscreenChange);
            document.removeEventListener('mozfullscreenchange', handleFullscreenChange);
            document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
            document.removeEventListener('msfullscreenchange', handleFullscreenChange);
        };
    }, []);

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

    const handleShoot = () => {
        if (room) {
            room.send('shoot');
        }
    };

    // Improved joystick functions with corrected direction
    const handleJoystickStart = (clientX, clientY) => {
        if (!baseRef.current) return;

        setIsDragging(true);
        const baseRect = baseRef.current.getBoundingClientRect();
        const baseCenterX = baseRect.left + baseRect.width / 2;
        const baseCenterY = baseRect.top + baseRect.height / 2;

        handleJoystickMove(clientX, clientY, baseCenterX, baseCenterY);
    };

    const handleJoystickMove = (clientX, clientY, baseCenterX, baseCenterY) => {
        if (!isDragging || !baseRef.current) return;

        // If baseCenterX/Y are not provided, calculate them
        if (!baseCenterX || !baseCenterY) {
            const baseRect = baseRef.current.getBoundingClientRect();
            baseCenterX = baseRect.left + baseRect.width / 2;
            baseCenterY = baseRect.top + baseRect.height / 2;
        }

        // Calculate distance from center
        let deltaX = clientX - baseCenterX;
        let deltaY = clientY - baseCenterY;

        // IMPORTANT FIX: Invert deltaY to correct the inverted controls
        deltaY = -deltaY;

        // Calculate distance and angle in radians
        const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
        const angle = Math.atan2(deltaY, deltaX);

        // Convert to degrees
        let degrees = (angle * 180 / Math.PI) % 360;
        if (degrees < 0) degrees += 360;

        // Limit joystick movement radius
        const maxDistance = 50;
        const clampedDistance = Math.min(maxDistance, distance);

        // Update joystick position for visual feedback - Note: don't invert Y here
        // so the joystick visual still follows the finger correctly
        setJoystickPos({
            x: Math.cos(Math.atan2(clientY - baseCenterY, clientX - baseCenterX)) * clampedDistance,
            y: Math.sin(Math.atan2(clientY - baseCenterY, clientX - baseCenterX)) * clampedDistance
        });

        // Only send movement if joystick is moved more than a small threshold
        const isMoving = distance > 5;

        // Send movement data to server with corrected direction
        if (room) {
            room.send('move', {
                direction: degrees,
                moving: isMoving
            });
        }
    };

    const handleJoystickEnd = () => {
        setIsDragging(false);
        setJoystickPos({ x: 0, y: 0 });

        // Send stop moving signal
        if (room) {
            room.send('move', {
                direction: 0,
                moving: false
            });
        }
    };

    // Handle mouse events
    const handleMouseDown = (e) => {
        e.preventDefault();
        handleJoystickStart(e.clientX, e.clientY);

        // Add document-level event listeners
        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);
    };

    const handleMouseMove = (e) => {
        e.preventDefault();
        handleJoystickMove(e.clientX, e.clientY);
    };

    const handleMouseUp = (e) => {
        e.preventDefault();
        handleJoystickEnd();
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
    };

    // Handle touch events
    const handleTouchStart = (e) => {
        e.preventDefault();
        const touch = e.touches[0];
        handleJoystickStart(touch.clientX, touch.clientY);
    };

    const handleTouchMove = (e) => {
        e.preventDefault();
        if (!isDragging) return;
        const touch = e.touches[0];
        handleJoystickMove(touch.clientX, touch.clientY);
    };

    const handleTouchEnd = (e) => {
        e.preventDefault();
        handleJoystickEnd();
    };

    return (
        <div
            ref={containerRef}
            className="fixed inset-0 bg-gradient-to-r from-gray-900 to-gray-800 flex items-center justify-center overflow-hidden select-none"
        >
            {isConnecting ? (
                <div className="flex-1 flex items-center justify-center">
                    <div className="text-center">
                        <div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                        <p className="text-white text-lg">Connecting to battlefield...</p>
                    </div>
                </div>
            ) : (
                <>
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
                        <div className="flex-1 flex items-center justify-center relative">
                            {/* Joystick base */}
                            <div
                                ref={baseRef}
                                className="relative w-48 h-48 bg-black/40 backdrop-blur-sm rounded-full border-2 border-indigo-600/30 shadow-lg flex items-center justify-center"
                                onMouseDown={handleMouseDown}
                                onTouchStart={handleTouchStart}
                                onTouchMove={handleTouchMove}
                                onTouchEnd={handleTouchEnd}
                            >
                                {/* Visual guides */}
                                <div className="absolute w-full h-full rounded-full">
                                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1 h-8 bg-indigo-500/20 rounded-full"></div>
                                    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-8 bg-indigo-500/20 rounded-full"></div>
                                    <div className="absolute top-1/2 left-0 -translate-y-1/2 w-8 h-1 bg-indigo-500/20 rounded-full"></div>
                                    <div className="absolute top-1/2 right-0 -translate-y-1/2 w-8 h-1 bg-indigo-500/20 rounded-full"></div>
                                    <div className="absolute inset-0 border-[16px] border-indigo-500/10 rounded-full"></div>
                                </div>

                                {/* Joystick handle */}
                                <div
                                    ref={joystickRef}
                                    className="absolute w-20 h-20 bg-gradient-to-br from-indigo-500 to-indigo-700 rounded-full shadow-md cursor-grab active:cursor-grabbing transform-gpu will-change-transform"
                                    style={{
                                        transform: `translate(${joystickPos.x}px, ${joystickPos.y}px)`,
                                        transition: isDragging ? 'none' : 'transform 0.2s ease-out'
                                    }}
                                >
                                    <div className="absolute inset-2 rounded-full bg-indigo-600 flex items-center justify-center">
                                        <div className="w-1/2 h-1/2 rounded-full bg-indigo-400/30"></div>
                                    </div>
                                </div>
                            </div>
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
                </>
            )}
        </div>
    );
}