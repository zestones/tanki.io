import { useRef } from 'react';
import PlayerStatus from '../components/mobile/controller/PlayerStatus';
import Joystick from '../components/mobile/controller/Joystick';
import RespawnCountdown from '../components/mobile/screens/CountdownScreen';
import FullscreenButton from '../components/mobile/buttons/FullscreenButton';
import LoadingScreen from '../components/common/LoadingScreen';
import useConnectionManager from '../hooks/useConnectionManager';
import { useFullscreen } from '../hooks/useFullScreen';

export default function Controller() {
    const containerRef = useRef(null);
    const { isFullscreen, enterFullscreen } = useFullscreen(containerRef);

    const {
        isConnecting,
        username,
        health,
        score,
        respawnCountdown,
        handleMove,
        handleStopMoving,
        handleAim
    } = useConnectionManager();

    // Loading screen
    if (isConnecting) {
        return <LoadingScreen />;
    }

    return (
        <div
            ref={containerRef}
            className="relative h-screen w-screen bg-zinc-900 overflow-hidden touch-none"
        >
            {respawnCountdown > 0 && (
                <RespawnCountdown countdown={respawnCountdown} />
            )}

            <div className="absolute top-4 right-4">
                <FullscreenButton
                    isFullscreen={isFullscreen}
                    onClick={enterFullscreen}
                />
            </div>

            <div className="absolute top-0 left-0 right-0 p-4">
                <PlayerStatus
                    username={username}
                    health={health}
                    score={score} // Pass score to PlayerStatus
                />
            </div>

            <div className="absolute bottom-10 left-10">
                <Joystick
                    onMove={handleMove}
                    onStop={handleStopMoving}
                    type="movement"
                />
            </div>

            <div className="absolute bottom-10 right-10">
                <Joystick
                    onMove={handleAim}
                    onStop={handleStopMoving}
                    type="aiming"
                />
            </div>
        </div>
    );
}