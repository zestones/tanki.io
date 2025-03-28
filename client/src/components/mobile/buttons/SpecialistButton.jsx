import { useEffect, useState, useRef } from 'react';
import { withOpacity } from '../../../utils/colorUtils';
import PropTypes from 'prop-types';

function SpecialistButton({ specialistState, onActivate, size = 80, color = '#3a86ff' }) {
    const [cooldownPercent, setCooldownPercent] = useState(0);
    const [activePercent, setActivePercent] = useState(0);
    const [isAvailable, setIsAvailable] = useState(true);
    const [isActive, setIsActive] = useState(false);
    const [isPressed, setIsPressed] = useState(false);
    const [remainingTime, setRemainingTime] = useState(0);
    const buttonRef = useRef(null);

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
                const remaining = Math.max(0, total - elapsed);
                const remainingPercent = Math.max(0, Math.min(remaining / total, 1)); // Fix calculation
                setActivePercent(remainingPercent * 100);
                setRemainingTime(Math.ceil(remaining / 1000)); // Convert to seconds
            } else {
                setActivePercent(0);
                setRemainingTime(0);
            }

            // Handle cooldown indicator when specialist is not active but in cooldown
            if (!specialistState.isActive && specialistState.lastActivationTime > 0) {
                const elapsed = now - specialistState.lastActivationTime;
                const total = specialistState.cooldown;

                if (elapsed < total) {
                    setIsAvailable(false);
                    const progress = Math.min(elapsed / total, 1);
                    setCooldownPercent(progress * 100);
                    setRemainingTime(Math.ceil((total - elapsed) / 1000)); // Convert to seconds
                } else {
                    setIsAvailable(true);
                    setCooldownPercent(100);
                    setRemainingTime(0);
                }
            } else if (!specialistState.isActive) {
                setIsAvailable(true);
                setCooldownPercent(100);
                setRemainingTime(0);
            }
        };

        updateStatus();
        const interval = setInterval(updateStatus, 100);
        return () => clearInterval(interval);
    }, [specialistState]);

    // Handle button press animation
    const handlePress = (e) => {
        // Prevent any default browser behavior that might interfere
        e.preventDefault();
        e.stopPropagation();

        if (!isAvailable || isActive) return;

        setIsPressed(true);
        onActivate();

        // Create activation burst effect
        const button = buttonRef.current;
        if (button) {
            const burst = document.createElement('div');
            burst.className = 'absolute inset-0 pointer-events-none';
            burst.style.zIndex = 50;

            const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
            svg.setAttribute('width', '100%');
            svg.setAttribute('height', '100%');
            svg.setAttribute('viewBox', '0 0 100 100');
            svg.style.position = 'absolute';

            const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
            circle.setAttribute('cx', '50');
            circle.setAttribute('cy', '50');
            circle.setAttribute('r', '1');
            circle.setAttribute('fill', 'none');
            circle.setAttribute('stroke', color);
            circle.setAttribute('stroke-width', '2');
            circle.style.transform = 'translate(0, 0)';
            circle.style.opacity = '1';

            svg.appendChild(circle);
            burst.appendChild(svg);
            button.appendChild(burst);

            // Animate the burst
            const animate = () => {
                const currentR = parseFloat(circle.getAttribute('r'));
                const opacity = parseFloat(circle.style.opacity);

                if (currentR >= 50) {
                    button.removeChild(burst);
                    return;
                }

                circle.setAttribute('r', currentR + 2);
                circle.style.opacity = opacity - 0.04;

                requestAnimationFrame(animate);
            };

            requestAnimationFrame(animate);
        }

        // Reset press state after animation
        setTimeout(() => setIsPressed(false), 300);
    };

    // Add explicit touch handler to ensure the button works with multi-touch
    const handleTouchStart = (e) => {
        // Prevent other handlers from capturing this touch
        e.stopPropagation();
        handlePress(e);
    };

    useEffect(() => {
        // Add direct touch event listener to ensure button responds to touches
        const buttonElement = buttonRef.current;
        if (buttonElement) {
            buttonElement.addEventListener('touchstart', handleTouchStart, { passive: false });

            return () => {
                buttonElement.removeEventListener('touchstart', handleTouchStart);
            };
        }
    }, [isAvailable, isActive]); // Re-add listener when availability changes

    // Visual states
    let buttonState = 'ready';
    if (isActive) {
        buttonState = 'active';
    } else if (!isAvailable) {
        buttonState = 'cooldown';
    }

    // Color schemes for different states
    const colorSchemes = {
        ready: {
            primary: color,
            secondary: '#8bffff',
            accent: '#ffffff',
            dark: '#101318',
            glow: color,
            shadow: `0 0 15px ${withOpacity(color, 0.6)}, 0 0 30px ${withOpacity(color, 0.4)}`
        },
        cooldown: {
            primary: '#444856',
            secondary: '#2a2e36',
            accent: '#7a8294',
            dark: '#131519',
            glow: '#444856',
            shadow: 'none'
        },
        active: {
            primary: '#ff3860',
            secondary: '#ff8c9e',
            accent: '#ffffff',
            dark: '#260a14',
            glow: '#ff3860',
            shadow: `0 0 15px ${withOpacity('#ff3860', 0.6)}, 0 0 30px ${withOpacity('#ff3860', 0.4)}`
        }
    };

    const scheme = colorSchemes[buttonState];

    // Dynamic rotation for active state
    const rotationDeg = isActive ? ((Date.now() / 30) % 360) : 0;

    return (
        <div
            ref={buttonRef}
            className="relative select-none z-20"
            style={{ width: size, height: size }}
        >
            {/* Ambient Glow Effect */}
            <div
                className={`absolute inset-0 rounded-full transition-opacity duration-500 blur-xl`}
                style={{
                    background: `radial-gradient(circle at center, ${scheme.glow} 0%, transparent 70%)`,
                    opacity: (isActive || isAvailable) ? 0.4 : 0,
                    transform: 'scale(1.2)'
                }}
            />

            {/* Rotating Energy Field (Active Only) */}
            {isActive && (
                <div className="absolute inset-0" style={{ zIndex: 1 }}>
                    <svg width="100%" height="100%" viewBox="0 0 100 100">
                        <defs>
                            <linearGradient id="energyGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                <stop offset="0%" stopColor={withOpacity(scheme.primary, 0.8)} />
                                <stop offset="100%" stopColor={withOpacity(scheme.secondary, 0.2)} />
                            </linearGradient>
                        </defs>

                        {/* Outer Rotating Elements */}
                        <g style={{ transform: `rotate(${rotationDeg}deg)`, transformOrigin: 'center' }}>
                            {[0, 60, 120, 180, 240, 300].map((angle, i) => (
                                <path
                                    key={'arc-' + i}
                                    d={`M 50,50 L ${50 + 46 * Math.cos(angle * Math.PI / 180)},${50 + 46 * Math.sin(angle * Math.PI / 180)} A 46,46 0 0,1 ${50 + 46 * Math.cos((angle + 30) * Math.PI / 180)},${50 + 46 * Math.sin((angle + 30) * Math.PI / 180)} Z`}
                                    fill={withOpacity(scheme.glow, 0.15)}
                                    stroke={withOpacity(scheme.secondary, 0.7)}
                                    strokeWidth="0.5"
                                />
                            ))}
                        </g>

                        {/* Inner Rotating Elements - Counter Direction */}
                        <g style={{ transform: `rotate(${-rotationDeg * 1.5}deg)`, transformOrigin: 'center' }}>
                            {[0, 72, 144, 216, 288].map((angle, i) => (
                                <line
                                    key={'line-' + i}
                                    x1="50"
                                    y1="50"
                                    x2={50 + 30 * Math.cos(angle * Math.PI / 180)}
                                    y2={50 + 30 * Math.sin(angle * Math.PI / 180)}
                                    stroke={withOpacity(scheme.accent, 0.5)}
                                    strokeWidth="0.75"
                                />
                            ))}
                        </g>
                    </svg>
                </div>
            )}

            {/* Main Button - Use onClick for mouse and let our custom touch handler handle touch events */}
            <button
                onClick={handlePress}
                disabled={!isAvailable || isActive}
                className="relative h-full w-full transition-all duration-300 outline-none focus:outline-none group"
                style={{
                    transform: isPressed ? 'scale(0.93)' : 'scale(1)',
                    zIndex: 2
                }}
            >
                {/* Main Button Structure - Layered Rings */}
                <svg width="100%" height="100%" viewBox="0 0 100 100" className="absolute inset-0">
                    <defs>
                        <filter id="glow" x="-30%" y="-30%" width="160%" height="160%">
                            <feGaussianBlur stdDeviation="2" result="blur" />
                            <feComposite in="SourceGraphic" in2="blur" operator="over" />
                        </filter>

                        {/* Futuristic pattern for button */}
                        <pattern id="techPattern" patternUnits="userSpaceOnUse" width="10" height="10" patternTransform="rotate(45)">
                            <line x1="0" y1="0" x2="0" y2="10" stroke={withOpacity(scheme.accent, 0.2)} strokeWidth="0.5" />
                        </pattern>
                    </defs>

                    {/* Outer Ring */}
                    <circle
                        cx="50" cy="50" r="48"
                        fill="none"
                        stroke={scheme.primary}
                        strokeWidth="2"
                        filter="url(#glow)"
                    />

                    {/* Middle Sci-Fi Ring with Notches */}
                    <circle
                        cx="50" cy="50" r="44"
                        fill="none"
                        stroke={scheme.secondary}
                        strokeWidth="1"
                        strokeDasharray="3,2"
                    />

                    {/* Main Button Background */}
                    <circle
                        cx="50" cy="50" r="40"
                        fill={scheme.dark}
                        stroke={scheme.accent}
                        strokeWidth="0.5"
                    />

                    {/* Tech Pattern Fill */}
                    <circle
                        cx="50" cy="50" r="38"
                        fill="url(#techPattern)"
                    />

                    {/* Energy Core */}
                    <circle
                        cx="50" cy="50" r="20"
                        fill={`url(#${buttonState}Gradient)`}
                        className={isActive ? "animate-pulse-fast" : ""}
                    />

                    {/* Cooldown Fill - Semi-transparent overlay */}
                    {!isAvailable && (
                        <>
                            <clipPath id="cooldownMask">
                                <circle cx="50" cy="50" r="40" />
                            </clipPath>

                            <rect
                                x="0" y={100 - cooldownPercent}
                                width="100" height="100"
                                fill={`url(#cooldownFill)`}
                                clipPath="url(#cooldownMask)"
                            />
                        </>
                    )}

                    {/* Tech Accents */}
                    {[0, 90, 180, 270].map((angle, i) => (
                        <path
                            key={"accent-" + i}
                            d={`M ${50 + 42 * Math.cos(angle * Math.PI / 180)},${50 + 42 * Math.sin(angle * Math.PI / 180)} 
                               L ${50 + 46 * Math.cos(angle * Math.PI / 180)},${50 + 46 * Math.sin(angle * Math.PI / 180)}
                               L ${50 + 46 * Math.cos((angle + 10) * Math.PI / 180)},${50 + 46 * Math.sin((angle + 10) * Math.PI / 180)}
                               L ${50 + 42 * Math.cos((angle + 10) * Math.PI / 180)},${50 + 42 * Math.sin((angle + 10) * Math.PI / 180)} Z`}
                            fill={scheme.primary}
                            stroke={scheme.accent}
                            strokeWidth="0.5"
                        />
                    ))}

                    {/* Define gradients - must be after all uses to avoid ID conflicts */}
                    <linearGradient id="readyGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor={withOpacity(scheme.primary, 0.9)} />
                        <stop offset="100%" stopColor={withOpacity(scheme.primary, 0.4)} />
                    </linearGradient>

                    <linearGradient id="activeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor={withOpacity(scheme.primary, 0.9)}>
                            <animate attributeName="stop-color"
                                values={`${withOpacity(scheme.primary, 0.9)};${withOpacity(scheme.secondary, 0.7)};${withOpacity(scheme.primary, 0.9)}`}
                                dur="2s" repeatCount="indefinite" />
                        </stop>
                        <stop offset="100%" stopColor={withOpacity(scheme.secondary, 0.5)}>
                            <animate attributeName="stop-color"
                                values={`${withOpacity(scheme.secondary, 0.5)};${withOpacity(scheme.primary, 0.7)};${withOpacity(scheme.secondary, 0.5)}`}
                                dur="2s" repeatCount="indefinite" />
                        </stop>
                    </linearGradient>

                    <linearGradient id="cooldownGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor={withOpacity(scheme.primary, 0.5)} />
                        <stop offset="100%" stopColor={withOpacity(scheme.dark, 0.8)} />
                    </linearGradient>

                    <linearGradient id="cooldownFill" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor={withOpacity(scheme.primary, 0.2)} />
                        <stop offset="100%" stopColor={withOpacity(scheme.dark, 0.8)} />
                    </linearGradient>
                </svg>

                {/* Active Time Indicator - Fixed to correctly show remaining time */}
                {isActive && (
                    <svg className="absolute inset-0 z-10" viewBox="0 0 100 100">
                        {/* Background circle for the timer */}
                        <circle
                            cx="50" cy="50" r="43"
                            fill="none"
                            stroke={withOpacity(scheme.dark, 0.5)}
                            strokeWidth="3"
                        />
                        {/* Timer circle that shows remaining time */}
                        <circle
                            cx="50" cy="50" r="43"
                            fill="none"
                            stroke={scheme.primary}
                            strokeWidth="3"
                            strokeDasharray={`${activePercent * 2.7} 270`}
                            strokeDashoffset="0"
                            transform="rotate(-90 50 50)"
                            strokeLinecap="round"
                            filter="url(#glow)"
                        />
                    </svg>
                )}

                {/* Content Overlay */}
                <div className="absolute inset-0 flex flex-col items-center justify-center z-10">
                    {/* Time Remaining */}
                    {(isActive || !isAvailable) && (
                        <div
                            className="mt-1 font-mono"
                            style={{
                                color: scheme.accent,
                                fontSize: `${size * 0.16}px`,
                                fontWeight: 'bold',
                                textShadow: isActive ? `0 0 3px ${withOpacity(scheme.accent, 0.5)}` : 'none'
                            }}
                        >
                            {remainingTime}s
                        </div>
                    )}
                </div>
            </button>

            {/* Focus Points around the button */}
            {(isAvailable || isActive) && (
                <>
                    {[90, 180, 270, 360].map((angle, i) => (
                        <div
                            key={'point-' + i}
                            className={`absolute w-1.5 h-1.5 rounded-full ${isActive ? 'animate-pulse' : ''}`}
                            style={{
                                top: `calc(50% + ${Math.sin(angle * Math.PI / 180) * size * 0.6}px)`,
                                left: `calc(50% + ${Math.cos(angle * Math.PI / 180) * size * 0.6}px)`,
                                transform: 'translate(-50%, -50%)',
                                backgroundColor: scheme.secondary,
                                boxShadow: `0 0 5px ${scheme.glow}`
                            }}
                        />
                    ))}
                </>
            )}
        </div>
    );
}

SpecialistButton.propTypes = {
    specialistState: PropTypes.shape({
        isActive: PropTypes.bool.isRequired,
        lastActivationTime: PropTypes.number.isRequired,
        duration: PropTypes.number.isRequired,
        cooldown: PropTypes.number.isRequired,
        activeUntil: PropTypes.number.isRequired
    }).isRequired,
    onActivate: PropTypes.func.isRequired,
    size: PropTypes.number,
    color: PropTypes.string
};

export default SpecialistButton;
