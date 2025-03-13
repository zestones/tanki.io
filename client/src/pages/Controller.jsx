import { useRef } from 'react';

import FireButton from '../components/controller/FireButton';
import PlayerStatus from '../components/controller/PlayerStatus';
import Joystick from '../components/game/Joystick';
import RespawnCountdown from '../components/ui/CountdownScreen';
import FullscreenButton from '../components/ui/FullscreenButton';
import LoadingScreen from '../components/ui/LoadingScreen';
import useConnectionManager from '../hooks/useConnectionManager';
import { useFullscreen } from '../hooks/useFullScreen';

export default function Controller() {
    const containerRef = useRef(null);
    const { isFullscreen, enterFullscreen } = useFullscreen(containerRef);

    const {
        isConnecting,
        username,
        health,
        respawnCountdown,
        handleMove,
        handleStopMoving,
        handleShoot
    } = useConnectionManager();

    // Loading screen
    if (isConnecting) {
        return <LoadingScreen />;
    }

    return (
        <div
            ref={containerRef}
            className="fixed inset-0 bg-gradient-to-r from-gray-900 to-gray-800 flex items-center justify-center overflow-hidden select-none"
        >
            <FullscreenButton isFullscreen={isFullscreen} enterFullscreen={enterFullscreen} />
            <RespawnCountdown countdown={respawnCountdown} />

            <div className="w-full h-full flex flex-row items-center justify-between px-4 py-2">
                <div className="flex-1 flex items-center justify-center">
                    <Joystick onMove={handleMove} onStop={handleStopMoving} />
                </div>

                <PlayerStatus username={username} health={health} />
                <div className="flex-1 flex items-center justify-center">
                    <FireButton onShoot={handleShoot} />
                </div>
            </div>
        </div>
    );
}