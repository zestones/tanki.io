import PropTypes from 'prop-types';
import { useState, useRef, useEffect } from 'react';
import { withOpacity } from '../../../utils/colorUtils';
import { Stage, Layer } from 'react-konva';
import SchemaLabel from './SchemaLabel';

function TankVisualization({ TankComponent, tankColor, stats, username }) {
    const [scale, setScale] = useState(1);
    const [tankRotation, setTankRotation] = useState(0);
    const containerRef = useRef(null);
    const lastDistance = useRef(null);

    // Auto-rotation effect
    useEffect(() => {
        const interval = setInterval(() => {
            setTankRotation((prev) => (prev + 0.5) % 360);
        }, 50);
        return () => clearInterval(interval);
    }, []);

    const schemaPoints = [
        { x: -120, y: -80, label: 'ARMOR PLATING', value: `${stats?.defense || 0}/10` },
        { x: 120, y: -80, label: 'WEAPON SYSTEMS', value: `${stats?.damage || 0}/10` },
        { x: -120, y: 80, label: 'ENGINE OUTPUT', value: `${stats?.speed || 0}/10` },
        { x: 120, y: 80, label: 'SPECIALTY', value: stats?.specialty || 'N/A' }
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
                        key={index}
                        point={point}
                        tankColor={tankColor}
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

            {/* Updated zoom instructions */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-xs font-mono text-gray-400 opacity-50">
                Pinch to zoom
            </div>
        </div>
    );
}

TankVisualization.propTypes = {
    TankComponent: PropTypes.func,
    tankColor: PropTypes.string.isRequired,
    stats: PropTypes.shape({
        defense: PropTypes.number,
        damage: PropTypes.number,
        speed: PropTypes.number,
        specialty: PropTypes.string
    }),
    username: PropTypes.string.isRequired
};

export default TankVisualization;
