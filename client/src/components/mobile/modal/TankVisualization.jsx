import PropTypes from 'prop-types';
import { useEffect, useRef, useState } from 'react';
import { Layer, Stage } from 'react-konva';
import { withOpacity } from '../../../utils/colorUtils';
import ScanTechButton from '../buttons/ScanTechButton';
import SchemaLabel from './SchemaLabel';

function TankVisualization({ onClose, TankComponent, tankColor, stats: initialStats, username, onStatsChange }) {
    const [scale, setScale] = useState(1);
    const [tankRotation, setTankRotation] = useState(0);
    const containerRef = useRef(null);
    const lastDistance = useRef(null);

    // Stats management
    const [stats, setStats] = useState(initialStats || { defense: 0, damage: 0, speed: 0, specialty: 'N/A' });
    const [upgradePoints, setUpgradePoints] = useState(5); // Starting upgrade points
    const [upgradeEffect, setUpgradeEffect] = useState(null);

    // Auto-rotation effect
    useEffect(() => {
        const interval = setInterval(() => {
            setTankRotation((prev) => (prev + 0.5) % 360);
        }, 50);
        return () => clearInterval(interval);
    }, []);

    const handleUpgradeStat = (statName) => {
        if (upgradePoints <= 0 || stats[statName] >= 10) return;

        // Apply upgrade
        const newStats = {
            ...stats,
            [statName]: Math.min(stats[statName] + 1, 10)
        };

        setStats(newStats);
        setUpgradePoints(prev => prev - 1);

        // Trigger upgrade effect animation
        setUpgradeEffect(statName);
        setTimeout(() => setUpgradeEffect(null), 1000);

        // Notify parent component if provided
        if (onStatsChange) {
            onStatsChange(newStats);
        }
    };

    const schemaPoints = [
        {
            x: -120,
            y: -80,
            label: 'ARMOR PLATING',
            value: `${stats?.defense || 0}/10`,
            statKey: 'defense',
            upgradable: stats?.defense < 10 && upgradePoints > 0
        },
        {
            x: 120,
            y: -80,
            label: 'WEAPON SYSTEMS',
            value: `${stats?.damage || 0}/10`,
            statKey: 'damage',
            upgradable: stats?.damage < 10 && upgradePoints > 0
        },
        {
            x: -120,
            y: 80,
            label: 'ENGINE OUTPUT',
            value: `${stats?.speed || 0}/10`,
            statKey: 'speed',
            upgradable: stats?.speed < 10 && upgradePoints > 0
        },
        {
            x: 120,
            y: 80,
            label: 'SPECIALTY',
            value: stats?.specialty || 'N/A'
        }
    ];

    const handleTouchStart = (e) => {
        if (e.touches.length === 2) {
            const touch1 = e.touches[0];
            const touch2 = e.touches[1];

            // Calculate initial distance for zoom
            const distance = Math.hypot(
                touch2.clientX - touch1.clientX,
                touch2.clientY - touch1.clientY
            );
            lastDistance.current = distance;
        }
    };

    const handleTouchMove = (e) => {
        if (e.touches.length === 2) {
            const touch1 = e.touches[0];
            const touch2 = e.touches[1];

            // Handle zoom
            const newDistance = Math.hypot(
                touch2.clientX - touch1.clientX,
                touch2.clientY - touch1.clientY
            );

            if (lastDistance.current) {
                const delta = newDistance / lastDistance.current;
                const newScale = Math.min(Math.max(scale * delta, 0.5), 2);
                setScale(newScale);
            }
            lastDistance.current = newDistance;
        }
    };

    const handleTouchEnd = () => {
        lastDistance.current = null;
    };

    useEffect(() => {
        const container = containerRef.current;
        if (container) {
            container.addEventListener('touchstart', handleTouchStart);
            container.addEventListener('touchmove', handleTouchMove);
            container.addEventListener('touchend', handleTouchEnd);

            return () => {
                container.removeEventListener('touchstart', handleTouchStart);
                container.removeEventListener('touchmove', handleTouchMove);
                container.removeEventListener('touchend', handleTouchEnd);
            };
        }
    }, [scale]);

    return (
        <div
            ref={containerRef}
            className="relative w-full h-full flex items-center justify-center touch-none"
        >
            <ScanTechButton
                onClose={onClose}
                text='CLOSE'
                color={tankColor}
                type="close"
                className='absolute top-4 left-4 z-20 focus:outline-none active:opacity-80 transition-opacity duration-100'
            />

            {/* Background hexagon */}
            <svg width="300" height="300" viewBox="0 0 300 300" className="absolute">
                <polygon
                    points="150,0 300,75 300,225 150,300 0,225 0,75"
                    fill="none"
                    stroke={withOpacity(tankColor, 0.3)}
                    strokeWidth="1"
                />
                <polygon
                    points="150,50 250,100 250,200 150,250 50,200 50,100"
                    fill="none"
                    stroke={withOpacity(tankColor, 0.2)}
                    strokeWidth="1"
                />
                <polygon
                    points="150,100 200,125 200,175 150,200 100,175 100,125"
                    fill="none"
                    stroke={withOpacity(tankColor, 0.4)}
                    strokeWidth="1"
                />
            </svg>

            {/* Schema lines and labels */}
            <svg width="600" height="600" viewBox="-300 -300 600 600" className="absolute" style={{
                pointerEvents: 'none',
                transform: `scale(${scale})`
            }}>
                {schemaPoints.map((point, index) => (
                    <SchemaLabel
                        key={'schema-point-' + index}
                        point={point}
                        tankColor={tankColor}
                        onUpgrade={point.statKey ? () => handleUpgradeStat(point.statKey) : null}
                        upgradeEffect={upgradeEffect === point.statKey}
                    />
                ))}
            </svg>

            {/* Tank model */}
            <div
                className="relative flex items-center justify-center z-10"
                style={{
                    transform: `scale(${scale})`,
                    transition: 'transform 0.1s ease-out'
                }}
            >
                <div className="w-48 h-48 flex items-center justify-center">
                    <Stage width={200} height={120}>
                        <Layer>
                            <TankComponent
                                x={100}
                                y={60}
                                rotation={tankRotation}
                                hp={100}
                                username={username}
                                isDead={false}
                            />
                        </Layer>
                    </Stage>
                </div>
            </div>

            {/* Grid overlay */}
            <div className="absolute inset-0 pointer-events-none" style={{
                backgroundImage: `linear-gradient(to right, ${withOpacity(tankColor, 0.1)} 1px, transparent 1px), 
                            linear-gradient(to bottom, ${withOpacity(tankColor, 0.1)} 1px, transparent 1px)`,
                backgroundSize: '20px 20px'
            }}></div>

            {/* Corner accents */}
            <div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2" style={{ borderColor: tankColor }}></div>
            <div className="absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2" style={{ borderColor: tankColor }}></div>
            <div className="absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2" style={{ borderColor: tankColor }}></div>
            <div className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2" style={{ borderColor: tankColor }}></div>

            {/* Arknights-style Upgrade Points Display */}
            <div className="absolute top-4 right-4 flex flex-col items-end">
                <div className="relative">
                    {/* Main container */}
                    <svg width="150" height="60" viewBox="0 0 150 60" className="filter drop-shadow-lg">
                        {/* Main background shape */}
                        <polygon
                            points="15,0 150,0 150,40 135,60 0,60 0,20"
                            fill="rgba(10,12,18,0.9)"
                            stroke={tankColor}
                            strokeWidth="1.5"
                        />

                        {/* Left accent bar */}
                        <rect x="0" y="20" width="5" height="40" fill={tankColor} />

                        {/* Tech accent lines */}
                        <line x1="15" y1="0" x2="0" y2="20" stroke={tankColor} strokeWidth="1" />
                        <line x1="150" y1="40" x2="135" y2="60" stroke={tankColor} strokeWidth="1" />

                        {/* Decorative elements */}
                        <rect x="125" y="0" width="25" height="5" fill={tankColor} />
                        <rect x="0" y="30" width="150" height="1" fill={withOpacity(tankColor, 0.3)} />
                        <rect x="20" y="45" width="115" height="1" fill={withOpacity(tankColor, 0.2)} />
                    </svg>

                    {/* Content overlay */}
                    <div className="absolute inset-0 flex items-center px-3">
                        {/* Left side - label */}
                        <div className="flex flex-col mr-3">
                            <span className="text-[10px] font-mono leading-tight tracking-wider opacity-70 uppercase"
                                style={{ color: withOpacity(tankColor, 0.8) }}>
                                Tactical
                            </span>
                            <span className="text-xs font-mono leading-tight tracking-wider font-semibold uppercase"
                                style={{ color: tankColor }}>
                                Points
                            </span>
                        </div>

                        {/* Right side - Hexagonal icon with number */}
                        <div className="flex items-center">
                            {/* Hexagonal icon */}
                            <div className="relative mr-2">
                                <svg width="26" height="30" viewBox="0 0 26 30">
                                    {/* Base hexagon */}
                                    <polygon
                                        points="13,0 26,7.5 26,22.5 13,30 0,22.5 0,7.5"
                                        fill="rgba(0,0,0,0.5)"
                                        stroke={tankColor}
                                        strokeWidth="1.5"
                                    />
                                    {/* Inner hexagon */}
                                    <polygon
                                        points="13,5 21,9.5 21,20.5 13,25 5,20.5 5,9.5"
                                        fill="transparent"
                                        stroke={withOpacity(tankColor, 0.7)}
                                        strokeWidth="1"
                                    />
                                    {/* Center dot */}
                                    <circle cx="13" cy="15" r="2" fill={tankColor} />
                                    {/* Tech lines */}
                                    <line x1="13" y1="5" x2="13" y2="0" stroke={withOpacity(tankColor, 0.7)} strokeWidth="1" />
                                    <line x1="13" y1="25" x2="13" y2="30" stroke={withOpacity(tankColor, 0.7)} strokeWidth="1" />
                                    <line x1="5" y1="9.5" x2="0" y2="7.5" stroke={withOpacity(tankColor, 0.7)} strokeWidth="1" />
                                    <line x1="21" y1="9.5" x2="26" y2="7.5" stroke={withOpacity(tankColor, 0.7)} strokeWidth="1" />
                                    <line x1="5" y1="20.5" x2="0" y2="22.5" stroke={withOpacity(tankColor, 0.7)} strokeWidth="1" />
                                    <line x1="21" y1="20.5" x2="26" y2="22.5" stroke={withOpacity(tankColor, 0.7)} strokeWidth="1" />
                                </svg>
                            </div>

                            {/* Number display */}
                            <div className="flex flex-col items-center">
                                <span className="text-2xl font-bold font-mono" style={{ color: tankColor }}>
                                    {upgradePoints}
                                </span>
                                <div className="h-1 w-full" style={{ backgroundColor: withOpacity(tankColor, 0.5) }} />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Subtitle with tech border */}
                <div className="mt-1 px-3 py-1 bg-black bg-opacity-70 relative" style={{ borderLeft: `2px solid ${tankColor}` }}>
                    <span className="text-[10px] font-mono opacity-80" style={{ color: tankColor }}>
                        UPGRADES AVAILABLE
                    </span>
                </div>
            </div>

            {/* Updated instructions */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-xs font-mono text-gray-400 opacity-50">
                Pinch to zoom • Tap + to upgrade
            </div>
        </div>
    );
}

TankVisualization.propTypes = {
    onClose: PropTypes.func.isRequired,
    TankComponent: PropTypes.func,
    tankColor: PropTypes.string.isRequired,
    stats: PropTypes.shape({
        defense: PropTypes.number,
        damage: PropTypes.number,
        speed: PropTypes.number,
        specialty: PropTypes.string
    }),
    username: PropTypes.string.isRequired,
    onStatsChange: PropTypes.func
};

export default TankVisualization;
