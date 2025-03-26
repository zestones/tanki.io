import { useEffect, useState } from 'react';
import { withOpacity } from '../../../utils/colorUtils';

const SpecialistButton = ({
    specialistState,
    color = '#ff8c00',
    onActivate,
    size = 80
}) => {
    const [cooldownPercent, setCooldownPercent] = useState(0);
    const [activePercent, setActivePercent] = useState(0);
    const [isAvailable, setIsAvailable] = useState(true);
    const [isActive, setIsActive] = useState(false);
    const [isPressed, setIsPressed] = useState(false);

    // Update cooldown and active status
    useEffect(() => {
        const updateStatus = () => {
            const now = Date.now();

            // Handle active status from server
            setIsActive(specialistState.isActive);

            // Handle active time indicator when specialist is active
            if (specialistState.isActive && specialistState.activeUntil > now) {
                const elapsed = now - specialistState.lastActivationTime;
                const total = specialistState.duration;
                const remainingPercent = 1 - Math.min(elapsed / total, 1);
                setActivePercent(remainingPercent * 100);
            } else {
                setActivePercent(0);
            }

            // Handle cooldown indicator when specialist is not active but in cooldown
            if (!specialistState.isActive && specialistState.lastActivationTime > 0) {
                const elapsed = now - specialistState.lastActivationTime;
                const total = specialistState.cooldown;

                if (elapsed < total) {
                    setIsAvailable(false);
                    const progress = Math.min(elapsed / total, 1);
                    setCooldownPercent(progress * 100);
                } else {
                    setIsAvailable(true);
                    setCooldownPercent(100);
                }
            } else if (!specialistState.isActive) {
                setIsAvailable(true);
                setCooldownPercent(100);
            }
        };

        console.log("SpecialistButton received state:", specialistState);
        updateStatus();
        const interval = setInterval(updateStatus, 100);
        return () => clearInterval(interval);
    }, [specialistState]);

    // Handle button press animation
    const handlePress = () => {
        if (!isAvailable || isActive) return;

        setIsPressed(true);
        onActivate();

        // Reset press state after animation
        setTimeout(() => setIsPressed(false), 300);
    };

    // Visual states
    const buttonState = isActive ? 'active' : !isAvailable ? 'cooldown' : 'ready';

    // Color schemes for different states
    const colorSchemes = {
        ready: {
            outer: withOpacity(color, 0.7),
            inner: withOpacity(color, 0.4),
            pulse: withOpacity(color, 0.2),
            text: color,
            glow: `0 0 15px ${withOpacity(color, 0.6)}`
        },
        cooldown: {
            outer: '#444',
            inner: '#333',
            pulse: 'transparent',
            text: '#888',
            glow: 'none'
        },
        active: {
            outer: '#ffcc00',
            inner: '#ff9900',
            pulse: withOpacity('#ffcc00', 0.4),
            text: '#ffffff',
            glow: `0 0 15px ${withOpacity('#ffcc00', 0.8)}`
        }
    };

    const scheme = colorSchemes[buttonState];

    // Hexagon points for clip path
    const hexagonPoints = '50% 0%, 93.3% 25%, 93.3% 75%, 50% 100%, 6.7% 75%, 6.7% 25%';

    return (
        <div className="relative" style={{ width: size, height: size }}>
            {/* Pulse effect when ready */}
            {isAvailable && !isActive && (
                <div
                    className="absolute inset-0 animate-pulse-slow"
                    style={{
                        clipPath: `polygon(${hexagonPoints})`,
                        background: scheme.pulse,
                        transform: 'scale(1.2)',
                    }}
                />
            )}

            {/* Active effect */}
            {isActive && (
                <div
                    className="absolute inset-0 animate-pulse-fast"
                    style={{
                        clipPath: `polygon(${hexagonPoints})`,
                        background: scheme.pulse,
                        transform: 'scale(1.3)',
                    }}
                />
            )}

            {/* Button outer hexagon */}
            <button
                onClick={handlePress}
                disabled={!isAvailable || isActive}
                className="relative w-full h-full transition-transform duration-300 outline-none"
                style={{
                    transform: isPressed ? 'scale(0.95)' : 'scale(1)',
                }}
            >
                <div
                    className="absolute inset-0 transition-all duration-300"
                    style={{
                        clipPath: `polygon(${hexagonPoints})`,
                        background: scheme.outer,
                        boxShadow: scheme.glow,
                    }}
                />

                {/* Inner hexagon */}
                <div
                    className="absolute inset-2 transition-all duration-300"
                    style={{
                        clipPath: `polygon(${hexagonPoints})`,
                        background: scheme.inner,
                    }}
                />

                {/* Cooldown fill - circular progress from bottom */}
                {!isAvailable && (
                    <div className="absolute inset-0 overflow-hidden" style={{ clipPath: `polygon(${hexagonPoints})` }}>
                        <div
                            className="absolute bottom-0 left-0 right-0 bg-white/20 transition-all"
                            style={{
                                height: `${cooldownPercent}%`,
                                background: `linear-gradient(to top, ${withOpacity(color, 0.5)}, ${withOpacity(color, 0.2)})`,
                            }}
                        />
                    </div>
                )}

                {/* Active time indicator - radial progress */}
                {isActive && (
                    <div className="absolute inset-0 flex items-center justify-center">
                        <svg className="w-full h-full" viewBox="0 0 100 100">
                            <circle
                                cx="50" cy="50" r="40"
                                fill="none"
                                stroke="#ffcc00"
                                strokeWidth="4"
                                strokeDasharray={`${activePercent * 2.51} 251`}
                                strokeDashoffset="0"
                                transform="rotate(-90 50 50)"
                            />
                        </svg>
                    </div>
                )}

                {/* Text label */}
                <div className="absolute inset-0 flex items-center justify-center">
                    <span
                        className="font-bold uppercase tracking-wider text-xs transition-colors duration-300"
                        style={{ color: scheme.text }}
                    >
                        {isActive ? 'ACTIVE' : !isAvailable ? 'WAIT' : 'SPECIAL'}
                    </span>
                </div>
            </button>
        </div>
    );
};

export default SpecialistButton;
