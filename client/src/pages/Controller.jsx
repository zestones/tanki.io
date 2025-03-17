import { useRef, useState } from 'react';

import { withOpacity } from '../utils/colorUtils';

import LoadingScreen from '../components/common/LoadingScreen';
import Joystick from '../components/mobile/controller/Joystick';
import PlayerStatus from '../components/mobile/controller/PlayerStatus';
import RespawnCountdown from '../components/mobile/screens/CountdownScreen';
import TankStatsModal from '../components/mobile/modal/TankStatsModal';
import useConnectionManager from '../hooks/useConnectionManager';

export default function Controller() {
    const containerRef = useRef(null);
    const [showTankStats, setShowTankStats] = useState(false);

    const {
        isConnecting,
        username,
        tank,
        health,
        score,
        respawnCountdown,
        handleMove,
        handleStopMoving,
        handleAim
    } = useConnectionManager();

    const tankColor = tank?.color ?? '#ff8c00';

    // Loading screen
    if (isConnecting) {
        return <LoadingScreen />;
    }

    return (
        <div
            ref={containerRef}
            className="relative h-screen w-screen bg-[#1a1a20] overflow-hidden touch-none flex flex-col"
        >
            <div className="absolute inset-0 bg-[#141418] z-0">
                {/* Hexagonal grid pattern */}
                <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI1MCIgaGVpZ2h0PSI0MyIgdmlld0JveD0iMCAwIDUwIDQzIj48cGF0aCBmaWxsPSJub25lIiBzdHJva2U9IiMzMDMwNDAiIHN0cm9rZS13aWR0aD0iMC44IiBkPSJNMjUsMSBMMSwyMSBMMSw2MSBMMjUsODEgTDQ5LDYxIEw0OSwyMSBMMjUsMSIgLz48L3N2Zz4=')] opacity-10"></div>
                {/* Overlay gradients */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#141418] via-transparent to-[#141418] opacity-70"></div>
                <div className="absolute inset-0" style={{ background: `radial-gradient(circle at center, ${withOpacity(tankColor, 0.05)}, transparent 70%)` }}></div>
            </div>

            <div className="absolute top-4 left-4 w-20 h-20">
                <svg width="80" height="80" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M0 0L80 0L80 16L16 16L16 80L0 80L0 0Z" fill={withOpacity(tankColor, 0.2)} />
                    <path d="M0 0L70 0L70 3L3 3L3 70L0 70L0 0Z" fill={withOpacity(tankColor, 0.5)} />
                </svg>
            </div>
            <div className="absolute top-4 right-4 w-20 h-20">
                <svg width="80" height="80" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ transform: 'scaleX(-1)' }}>
                    <path d="M0 0L80 0L80 16L16 16L16 80L0 80L0 0Z" fill={withOpacity(tankColor, 0.2)} />
                    <path d="M0 0L70 0L70 3L3 3L3 70L0 70L0 0Z" fill={withOpacity(tankColor, 0.5)} />
                </svg>
            </div>
            <div className="absolute bottom-4 left-4 w-20 h-20">
                <svg width="80" height="80" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ transform: 'scaleY(-1)' }}>
                    <path d="M0 0L80 0L80 16L16 16L16 80L0 80L0 0Z" fill={withOpacity(tankColor, 0.2)} />
                    <path d="M0 0L70 0L70 3L3 3L3 70L0 70L0 0Z" fill={withOpacity(tankColor, 0.5)} />
                </svg>
            </div>
            <div className="absolute bottom-4 right-4 w-20 h-20">
                <svg width="80" height="80" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ transform: 'scale(-1)' }}>
                    <path d="M0 0L80 0L80 16L16 16L16 80L0 80L0 0Z" fill={withOpacity(tankColor, 0.2)} />
                    <path d="M0 0L70 0L70 3L3 3L3 70L0 70L0 0Z" fill={withOpacity(tankColor, 0.5)} />
                </svg>
            </div>

            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 opacity-15 pointer-events-none">
                <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" fill="none">
                    <polygon points="50,3 97,25 97,75 50,97 3,75 3,25" stroke={withOpacity(tankColor, 0.3)} strokeWidth="1" />
                    <polygon points="50,15 85,30 85,70 50,85 15,70 15,30" stroke={withOpacity(tankColor, 0.2)} strokeWidth="1" />
                    <polygon points="50,30 70,40 70,60 50,70 30,60 30,40" stroke={withOpacity(tankColor, 0.4)} strokeWidth="1" />
                </svg>
            </div>

            {respawnCountdown > 0 && (
                <RespawnCountdown countdown={respawnCountdown} />
            )}

            {/* Tank Stats Button - Positioned to the right side of the screen */}
            <div className="absolute top-1/2 right-3 transform -translate-y-1/2 z-20">
                <button
                    onClick={() => setShowTankStats(!showTankStats)}
                    className="flex flex-col items-center"
                    aria-label="View Tank Statistics"
                >
                    <div className="relative w-14 h-14 flex items-center justify-center">
                        <svg viewBox="0 0 60 60" className="absolute inset-0">
                            <polygon
                                points="30,0 60,15 60,45 30,60 0,45 0,15"
                                fill="rgba(0,0,0,0.7)"
                                stroke={tankColor}
                                strokeWidth="2"
                            />
                        </svg>
                        <div className="relative z-10">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                                <path
                                    d="M4,18 L20,18 L17,6 L7,6 L4,18 Z M12,12 L12,14 M8,9 L8,14 M16,9 L16,14"
                                    stroke={tankColor}
                                    strokeWidth="1.5"
                                />
                                <path
                                    d="M8,5 L16,5 L16,7 L8,7 L8,5 Z"
                                    fill={withOpacity(tankColor, 0.5)}
                                />
                            </svg>
                        </div>
                    </div>
                    <div className="mt-1 text-xs font-mono" style={{ color: tankColor }}>SPECS</div>
                </button>
            </div>

            {!showTankStats && (
                <>
                    <div className="absolute top-0 left-0 right-0 p-4 z-10">
                        <PlayerStatus
                            username={username}
                            tankType={tank?.codeName}
                            health={health}
                            score={score}
                            tankColor={tankColor}
                        />
                    </div>


                    <div className="absolute bottom-10 left-10 z-10">
                        <div className="relative">
                            <div className="absolute -inset-4 -z-10">
                                <svg viewBox="0 0 180 180" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
                                    <polygon
                                        points="30,15 150,15 170,90 150,165 30,165 10,90"
                                        fill="rgba(0,0,0,0.7)"
                                        stroke="rgba(0,128,255,0.5)"
                                        strokeWidth="2"
                                    />
                                </svg>
                            </div>
                            <div className="absolute -top-8 left-0 text-xs text-blue-400 font-mono tracking-wider">
                                |TACTICAL MOVEMENT|
                            </div>
                            <div className="absolute -bottom-6 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-blue-500/30 to-transparent"></div>

                            <Joystick
                                onMove={handleMove}
                                onStop={handleStopMoving}
                                type="movement"
                            />
                        </div>
                    </div>

                    <div className="absolute bottom-10 right-10 z-10">
                        <div className="relative">
                            <div className="absolute -inset-4 -z-10">
                                <svg viewBox="0 0 180 180" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
                                    <polygon
                                        points="30,15 150,15 170,90 150,165 30,165 10,90"
                                        fill="rgba(0,0,0,0.7)"
                                        stroke="rgba(255,0,0,0.5)"
                                        strokeWidth="2"
                                    />
                                </svg>
                            </div>
                            <div className="absolute -top-8 right-0 text-xs text-red-600 font-mono tracking-wider">
                                |WEAPON SYSTEMS|
                            </div>
                            <div className="absolute -bottom-6 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-red-600/30 to-transparent"></div>

                            <Joystick
                                onMove={handleAim}
                                onStop={handleStopMoving}
                                type="aiming"
                            />
                        </div>
                    </div>
                </>
            )}

            <div className="absolute bottom-0 left-0 right-0 h-1" style={{ background: `linear-gradient(to right, ${withOpacity(tankColor, 0.5)}, transparent, ${withOpacity(tankColor, 0.5)})` }}></div>
            <div className="absolute inset-0 bg-[linear-gradient(transparent_50%,rgba(0,0,0,0.03)_50%)] bg-[length:100%_2px] pointer-events-none z-10"></div>

            {/* Tank Stats Modal */}
            <TankStatsModal
                isVisible={showTankStats}
                onClose={() => setShowTankStats(false)}
                tank={tank}
                username={username}
                health={health}
                score={score}
                tankColor={tankColor}
            />
        </div>
    );
}