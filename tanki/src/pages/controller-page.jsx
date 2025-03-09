import React, { useState, useEffect, useCallback } from 'react';
import { useGameService } from '../hooks/useGameService';
import { WEBSOCKET_CONFIG } from '../config/websocket.config';

const ControllerPage = () => {
    const [playerStats, setPlayerStats] = useState({
        health: 100,
        score: 0,
        level: 1,
        kills: 0,
        position: { x: 0, y: 0 },
    });

    const [powerups, setPowerups] = useState([]);
    const [joystickPosition, setJoystickPosition] = useState({ x: 0, y: 0 });
    const [isShooting, setIsShooting] = useState(false);
    const [turretAngle, setTurretAngle] = useState(0);
    const [touchStartPos, setTouchStartPos] = useState(null);
    const [joystickSize, setJoystickSize] = useState({ width: 120, height: 120 });
    const [showControls, setShowControls] = useState(true);
    const [isFullscreen, setIsFullscreen] = useState(false);

    const {
        isLoading,
        error,
        sendControlCommand,
    } = useGameService(WEBSOCKET_CONFIG.SERVER_URL);

    // Resize joystick based on screen size
    useEffect(() => {
        const handleResize = () => {
            const width = window.innerWidth;
            const height = window.innerHeight;
            const baseSize = Math.min(width / 4.5, height / 3.5);
            setJoystickSize({ width: baseSize, height: baseSize });
        };

        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Handle movement joystick
    const handleJoystickStart = useCallback((e) => {
        const touch = e.touches[0];
        const joystickContainer = document.getElementById('move-joystick');
        const rect = joystickContainer.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        setTouchStartPos({ x: centerX, y: centerY });
    }, []);

    const handleJoystickMove = useCallback((e) => {
        if (!touchStartPos) return;

        const touch = e.touches[0];
        const joystickContainer = document.getElementById('move-joystick');
        const rect = joystickContainer.getBoundingClientRect();
        const radius = rect.width / 2 - 20;
        const deltaX = touch.clientX - touchStartPos.x;
        const deltaY = touch.clientY - touchStartPos.y;
        const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
        const normalizedDistance = Math.min(distance, radius);
        const angle = Math.atan2(deltaY, deltaX);
        const joystickX = normalizedDistance * Math.cos(angle) / radius;
        const joystickY = normalizedDistance * Math.sin(angle) / radius;

        setJoystickPosition({ x: joystickX, y: joystickY });

        sendControlCommand({
            type: 'move',
            x: joystickX,
            y: joystickY
        });
    }, [touchStartPos, sendControlCommand]);

    const handleJoystickEnd = useCallback(() => {
        setJoystickPosition({ x: 0, y: 0 });
        setTouchStartPos(null);

        sendControlCommand({
            type: 'move',
            x: 0,
            y: 0
        });
    }, [sendControlCommand]);

    // Handle turret rotation
    const handleTurretStart = useCallback((e) => {
        handleTurretMove(e);
    }, []);

    const handleTurretMove = useCallback((e) => {
        const touch = e.touches[0];
        const turretContainer = document.getElementById('turret-control');
        const rect = turretContainer.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const deltaX = touch.clientX - centerX;
        const deltaY = touch.clientY - centerY;
        const angle = Math.atan2(deltaY, deltaX) * 180 / Math.PI;

        setTurretAngle(angle);

        sendControlCommand({
            type: 'rotate',
            angle: angle
        });
    }, [sendControlCommand]);

    // Handle shooting
    const handleShootStart = useCallback(() => {
        setIsShooting(true);
        sendControlCommand({
            type: 'shoot',
            shooting: true
        });
    }, [sendControlCommand]);

    const handleShootEnd = useCallback(() => {
        setIsShooting(false);
        sendControlCommand({
            type: 'shoot',
            shooting: false
        });
    }, [sendControlCommand]);

    // Simulate receiving player stats updates
    useEffect(() => {
        const interval = setInterval(() => {
            setPlayerStats(prev => ({
                ...prev,
                health: Math.max(0, prev.health + (Math.random() > 0.7 ? -5 : 1)),
                score: prev.score + Math.floor(Math.random() * 5),
                level: Math.floor(prev.score / 100) + 1,
                kills: Math.floor(prev.score / 200),
            }));
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    // On mount, check orientation and request screen lock for landscape
    useEffect(() => {
        const handleOrientationChange = () => {
            if (window.screen.orientation) {
                try {
                    window.screen.orientation.lock('landscape').catch(() => {
                        console.log('Could not lock screen orientation');
                    });
                } catch (error) {
                    console.log('Orientation API not supported');
                }
            }
        };

        handleOrientationChange();
        window.addEventListener('orientationchange', handleOrientationChange);

        return () => {
            window.removeEventListener('orientationchange', handleOrientationChange);
        };
    }, []);

    // Fullscreen toggle
    const toggleFullscreen = () => {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen().then(() => {
                setIsFullscreen(true);
            }).catch(err => {
                console.log(`Error attempting to enable fullscreen: ${err.message}`);
            });
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen().then(() => {
                    setIsFullscreen(false);
                });
            }
        }
    };

    // Calculate health bar color and gradient
    const getHealthColor = () => {
        if (playerStats.health > 70) return 'from-emerald-400 to-emerald-600';
        if (playerStats.health > 30) return 'from-amber-400 to-amber-600';
        return 'from-rose-500 to-red-700';
    };

    // Calculate joystick handle position
    const joystickHandleStyle = {
        transform: `translate(${joystickPosition.x * joystickSize.width / 3}px, ${joystickPosition.y * joystickSize.height / 3}px)`,
        boxShadow: `0 0 ${10 + Math.abs(joystickPosition.x * 5)}px rgba(59, 130, 246, 0.6)`
    };

    // Calculate turret rotation style
    const turretStyle = {
        transform: `rotate(${turretAngle}deg)`,
    };

    // Animation for shoot button pulse
    const shootBtnClass = isShooting
        ? 'bg-gradient-to-br from-rose-500 to-red-700 scale-90 shadow-lg'
        : 'bg-gradient-to-br from-rose-400 to-red-600 hover:scale-105 shadow-md';

    // Power ups configuration
    const powerupsConfig = [
        { color: 'blue', icon: '⚡', name: 'Speed', active: false },
        { color: 'emerald', icon: '🛡️', name: 'Shield', active: true },
        { color: 'rose', icon: '💥', name: 'Power', active: false },
        { color: 'amber', icon: '⚙️', name: 'Upgrade', active: false }
    ];

    return (
        <div className="relative h-screen w-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 overflow-hidden flex flex-col text-slate-50">
            {/* Particle background effect */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                {[...Array(30)].map((_, i) => (
                    <div
                        key={i}
                        className="absolute rounded-full bg-blue-600/10"
                        style={{
                            width: `${Math.random() * 12 + 3}px`,
                            height: `${Math.random() * 12 + 3}px`,
                            top: `${Math.random() * 100}%`,
                            left: `${Math.random() * 100}%`,
                            animation: `float ${Math.random() * 15 + 10}s linear infinite`,
                            animationDelay: `${Math.random() * 5}s`
                        }}
                    ></div>
                ))}
            </div>

            {/* Game grid overlay */}
            <div className="absolute inset-0 bg-grid-pattern opacity-5 pointer-events-none"></div>

            {/* Header with glass effect and player stats */}
            <div className="backdrop-blur-md bg-slate-900/80 border-b border-sky-700/30 px-4 py-2 flex justify-between items-center shadow-lg z-10">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-sky-400 to-blue-600 flex items-center justify-center shadow-md shadow-blue-500/30">
                        <span className="text-white font-bold text-xs">
                            {(sessionStorage.getItem('diep_username') || 'P').charAt(0)}
                        </span>
                    </div>
                    <div className="flex flex-col">
                        <span className="text-slate-400 text-xs tracking-wider">PLAYER</span>
                        <span className="text-sky-400 font-bold">{sessionStorage.getItem('diep_username') || 'Player'}</span>
                    </div>
                </div>

                <div className="flex items-center gap-6">
                    <div className="flex flex-col items-center">
                        <div className="h-6 w-6 rounded-md bg-gradient-to-br from-violet-400 to-purple-600 flex items-center justify-center mb-1 shadow-md">
                            <span className="text-white font-bold text-xs">{playerStats.level}</span>
                        </div>
                        <span className="text-slate-400 text-xs tracking-wider">LEVEL</span>
                    </div>

                    <div className="flex flex-col items-center">
                        <div className="flex items-center justify-center h-6 px-2 rounded-md bg-gradient-to-br from-amber-400 to-yellow-600 mb-1 shadow-md">
                            <span className="text-white font-bold text-xs">{playerStats.score}</span>
                        </div>
                        <span className="text-slate-400 text-xs tracking-wider">SCORE</span>
                    </div>

                    <div className="flex flex-col items-center">
                        <div className="h-6 w-6 rounded-md bg-gradient-to-br from-rose-400 to-red-600 flex items-center justify-center mb-1 shadow-md">
                            <span className="text-white font-bold text-xs">{playerStats.kills}</span>
                        </div>
                        <span className="text-slate-400 text-xs tracking-wider">KILLS</span>
                    </div>

                    <button
                        onClick={toggleFullscreen}
                        className="h-8 w-8 rounded-md bg-gradient-to-br from-slate-700 to-slate-800 flex items-center justify-center shadow-md border border-slate-600/40 transition-all hover:scale-105"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-slate-300" viewBox="0 0 20 20" fill="currentColor">
                            {isFullscreen ? (
                                <path fillRule="evenodd" d="M5 5h10v10H5V5zm1 1v8h8V6H6z" clipRule="evenodd" />
                            ) : (
                                <path fillRule="evenodd" d="M3 5a2 2 0 012-2h10a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2V5zm2 0v10h10V5H5z" clipRule="evenodd" />
                            )}
                        </svg>
                    </button>
                </div>
            </div>

            {/* Health bar with pulsing effect */}
            <div className="px-4 py-2 backdrop-blur-md bg-slate-900/60 border-b border-sky-700/30 shadow-md">
                <div className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center shadow-sm">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                        </svg>
                    </div>
                    <div className="h-4 flex-1 bg-slate-800/80 rounded-full overflow-hidden backdrop-blur-sm border border-slate-700/50">
                        <div
                            className={`h-full bg-gradient-to-r ${getHealthColor()} transition-all duration-300 relative flex items-center justify-end pr-2`}
                            style={{
                                width: `${playerStats.health}%`,
                                animation: playerStats.health < 30 ? 'pulse 2s infinite' : 'none'
                            }}
                        >
                            <div className="absolute inset-0 bg-white/20 rounded-full"
                                style={{
                                    clipPath: 'polygon(0 0, 20% 0, 60% 100%, 0 100%)',
                                    animation: 'slide 3s linear infinite'
                                }}
                            ></div>
                            {playerStats.health < 30 && (
                                <span className="text-white text-xs font-bold z-10 animate-pulse">CRITICAL</span>
                            )}
                        </div>
                    </div>
                    <span className={`text-white font-bold text-xs w-12 text-center px-2 py-1 rounded-full ${playerStats.health < 30 ? 'bg-rose-500/80 animate-pulse' : 'bg-slate-700/50'}`}>
                        {playerStats.health}%
                    </span>
                </div>
            </div>

            {/* Main controller area with glass effect */}
            <div className="flex-1 flex">
                {/* Left side - Movement joystick */}
                <div
                    id="move-joystick"
                    className="w-1/2 h-full flex items-center justify-center"
                    onTouchStart={handleJoystickStart}
                    onTouchMove={handleJoystickMove}
                    onTouchEnd={handleJoystickEnd}
                >
                    <div
                        className="rounded-full backdrop-blur-md bg-slate-800/40 border border-sky-500/30 relative flex items-center justify-center shadow-xl group"
                        style={{ width: joystickSize.width, height: joystickSize.height }}
                    >
                        {/* Animated glow effect */}
                        <div className="absolute inset-0 rounded-full bg-sky-500/5 group-active:bg-sky-500/10 animate-pulse"></div>

                        {/* Concentric circles for visual effect */}
                        <div className="absolute w-4/5 h-4/5 rounded-full border border-sky-400/20"></div>
                        <div className="absolute w-3/5 h-3/5 rounded-full border border-sky-400/15"></div>
                        <div className="absolute w-2/5 h-2/5 rounded-full border border-sky-400/10"></div>

                        {/* Direction indicators */}
                        <div className="absolute top-4 text-sky-400/40 text-xs font-bold">↑</div>
                        <div className="absolute right-4 text-sky-400/40 text-xs font-bold">→</div>
                        <div className="absolute bottom-4 text-sky-400/40 text-xs font-bold">↓</div>
                        <div className="absolute left-4 text-sky-400/40 text-xs font-bold">←</div>

                        <div className="absolute text-sky-400/60 text-xs uppercase font-bold tracking-widest">MOVE</div>

                        {/* Joystick handle */}
                        <div
                            className="w-1/3 h-1/3 rounded-full bg-gradient-to-br from-sky-400 to-blue-600 absolute shadow-lg border border-sky-300/50 flex items-center justify-center"
                            style={joystickHandleStyle}
                        >
                            <div className="absolute inset-0 rounded-full bg-sky-500/20 animate-ping"></div>
                            <div className="w-1/2 h-1/2 rounded-full bg-white/30"></div>
                        </div>
                    </div>
                </div>

                {/* Right side - Turret control and shoot button */}
                <div className="w-1/2 h-full flex flex-col">
                    {/* Turret rotation circle */}
                    <div
                        id="turret-control"
                        className="flex-1 flex items-center justify-center"
                        onTouchStart={handleTurretStart}
                        onTouchMove={handleTurretMove}
                    >
                        <div
                            className="rounded-full backdrop-blur-md bg-slate-800/40 border border-violet-500/30 relative flex items-center justify-center shadow-xl group"
                            style={{ width: joystickSize.width, height: joystickSize.height }}
                        >
                            {/* Animated glow effect */}
                            <div className="absolute inset-0 rounded-full bg-violet-500/5 group-active:bg-violet-500/10 animate-pulse"></div>

                            {/* Concentric circles and angle markers */}
                            <div className="absolute w-4/5 h-4/5 rounded-full border border-violet-400/20"></div>
                            <div className="absolute w-3/5 h-3/5 rounded-full border border-violet-400/15"></div>
                            <div className="absolute w-2/5 h-2/5 rounded-full border border-violet-400/10"></div>

                            {/* Angle markers */}
                            <div className="absolute inset-0">
                                <div className="absolute top-2 text-violet-400/40 text-xs font-bold">0°</div>
                                <div className="absolute right-2 text-violet-400/40 text-xs font-bold">90°</div>
                                <div className="absolute bottom-2 text-violet-400/40 text-xs font-bold">180°</div>
                                <div className="absolute left-2 text-violet-400/40 text-xs font-bold">270°</div>
                            </div>

                            <div className="absolute text-violet-400/60 text-xs uppercase font-bold tracking-widest">AIM</div>

                            {/* Turret pointer */}
                            <div
                                className="h-2 absolute left-1/2 rounded-r-full origin-left bg-gradient-to-r from-violet-400 to-purple-600 shadow-md shadow-purple-500/30"
                                style={{
                                    ...turretStyle,
                                    width: joystickSize.width / 2.5
                                }}
                            ></div>

                            {/* Dot at center */}
                            <div className="absolute w-3 h-3 rounded-full bg-violet-500 z-10"></div>
                        </div>
                    </div>

                    {/* Shoot button */}
                    <div className="h-1/3 flex items-center justify-center pb-6">
                        <button
                            className={`rounded-full ${shootBtnClass} transition-all duration-100 text-white font-bold relative flex flex-col items-center justify-center group`}
                            style={{ width: joystickSize.width * 0.9, height: joystickSize.width * 0.9 }}
                            onTouchStart={handleShootStart}
                            onTouchEnd={handleShootEnd}
                        >
                            {/* Ripple effect for firing */}
                            {isShooting ? (
                                <>
                                    <div className="absolute inset-0 rounded-full bg-rose-500/20 animate-ping"></div>
                                    <div className="absolute inset-0 rounded-full bg-rose-500/10 animate-ping animation-delay-200"></div>
                                </>
                            ) : (
                                <div className="absolute inset-0 rounded-full bg-white/5 group-hover:bg-white/10 transition-colors"></div>
                            )}

                            <div className="absolute inset-0 rounded-full border-2 border-rose-400/50"></div>

                            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 15l-6 6m0 0l-6-6m6 6V9a6 6 0 0112 0v3" />
                            </svg>
                            <span className="text-sm font-bold tracking-widest">FIRE</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* Powerup bar at the bottom */}
            <div className="h-16 backdrop-blur-md bg-slate-900/80 border-t border-sky-700/30 flex items-center justify-between px-6">
                <div className="text-xs text-sky-400 uppercase font-bold tracking-widest">POWERUPS</div>
                <div className="flex space-x-4">
                    {/* Powerup slots with glowing effect */}
                    {powerupsConfig.map((powerup, index) => (
                        <div
                            key={index}
                            className={`w-12 h-12 rounded-full bg-slate-800/60 border ${powerup.active ? `border-${powerup.color}-500` : 'border-slate-700/50'} flex flex-col items-center justify-center shadow-md transform transition hover:scale-110 relative`}
                        >
                            {powerup.active && (
                                <div className={`absolute inset-0 rounded-full border border-${powerup.color}-400/50 animate-pulse`}></div>
                            )}
                            <span className="text-xl">{powerup.icon}</span>
                            <span className="text-xs text-slate-400 mt-0.5">{powerup.name}</span>
                        </div>
                    ))}
                </div>
                <div className="w-12 h-12 rounded-full bg-slate-800/60 border border-slate-700/50 flex items-center justify-center shadow-md transition hover:scale-110">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                </div>
            </div>

            {/* Loading overlay with animated spinner */}
            {isLoading && (
                <div className="absolute inset-0 backdrop-blur-lg bg-slate-900/90 flex items-center justify-center z-50">
                    <div className="text-white text-center">
                        <div className="w-20 h-20 mx-auto mb-6 relative">
                            <div className="absolute inset-0 rounded-full border-4 border-sky-500/20 animate-ping"></div>
                            <svg className="animate-spin w-full h-full text-sky-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                        </div>
                        <p className="text-xl font-bold">Connecting to game...</p>
                        <div className="flex items-center justify-center gap-1 mt-3">
                            <div className="w-2 h-2 bg-sky-500 rounded-full animate-bounce"></div>
                            <div className="w-2 h-2 bg-sky-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                            <div className="w-2 h-2 bg-sky-500 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                        </div>
                    </div>
                </div>
            )}

            {/* Error message with glass effect */}
            {error && (
                <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 backdrop-blur-md bg-rose-500/80 text-white px-6 py-3 rounded-full text-sm shadow-lg border border-rose-400/50 animate-bounce">
                    <div className="flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        {error}
                    </div>
                </div>
            )}
        </div>
    );
};

export default ControllerPage;