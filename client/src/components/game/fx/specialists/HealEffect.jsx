import React, { useEffect, useState } from 'react';
import { Group, Circle, Line, Text, Ring } from 'react-konva';
import { useSpring, animated } from '@react-spring/konva';

function HealEffect({ effect }) {
    const [waves, setWaves] = useState([]);
    const [particles, setParticles] = useState([]);
    const [crossRotation, setCrossRotation] = useState(0);

    const primaryColor = '#2ECC71'; // Green
    const secondaryColor = '#1ABC9C'; // Teal
    const accentColor = '#FFFFFF';
    const gridColor = 'rgba(46, 204, 113, 0.2)';

    // Animation for central node
    const [coreProps, coreApi] = useSpring(() => ({
        scaleX: 1,
        scaleY: 1,
        opacity: 0.8,
        config: { tension: 200, friction: 20 }
    }));

    // Calculate remaining time and progress
    const elapsedTime = Date.now() - effect.createdAt;
    const remainingTime = Math.max(0, effect.duration - elapsedTime);
    const progress = Math.min(1, elapsedTime / effect.duration);

    // Initialize waves and particles
    useEffect(() => {
        // Create initial waves
        const initialWaves = Array(5).fill(0).map((_, i) => ({
            id: i,
            radius: 0,
            opacity: 0.8,
            phase: i * 0.2, // Staggered phase
        }));

        setWaves(initialWaves);

        // Create healing particles
        const healParticles = Array(12).fill(0).map((_, i) => ({
            id: i,
            angle: Math.random() * Math.PI * 2,
            distance: effect.radius * (0.3 + Math.random() * 0.6),
            size: 3 + Math.random() * 5,
            speed: 0.2 + Math.random() * 0.5,
            opacity: 0.2 + Math.random() * 0.6
        }));

        setParticles(healParticles);

        // Start animations
        const coreAnimation = setInterval(() => {
            const scaleValue = 1 + Math.random() * 0.2;
            coreApi.start({
                scaleX: scaleValue,
                scaleY: scaleValue,
                opacity: 0.7 + Math.random() * 0.3,
            });
        }, 500);

        const waveAnimation = setInterval(() => {
            setWaves(prevWaves =>
                prevWaves.map(wave => {
                    // Progress each wave
                    let newRadius = wave.radius + 1.5;
                    let newOpacity = wave.opacity;

                    // Reset wave when it reaches max radius
                    if (newRadius > effect.radius) {
                        newRadius = 0;
                        newOpacity = 0.8;
                    } else {
                        // Fade out as it expands
                        newOpacity = 0.8 * (1 - newRadius / effect.radius);
                    }

                    return {
                        ...wave,
                        radius: newRadius,
                        opacity: newOpacity
                    };
                })
            );
        }, 16);

        const particleAnimation = setInterval(() => {
            setParticles(prevParticles =>
                prevParticles.map(particle => {
                    // Move particles inward (healing converges to center)
                    const newDistance = particle.distance - particle.speed;

                    // Reset particles that reach the center
                    if (newDistance <= 10) {
                        return {
                            ...particle,
                            distance: effect.radius * (0.7 + Math.random() * 0.3),
                            angle: Math.random() * Math.PI * 2,
                            opacity: 0.2 + Math.random() * 0.6
                        };
                    }

                    return {
                        ...particle,
                        distance: newDistance
                    };
                })
            );
        }, 16);

        const crossAnimation = setInterval(() => {
            setCrossRotation(prev => (prev + 0.5) % 360);
        }, 50);

        // Clean up animations
        return () => {
            clearInterval(coreAnimation);
            clearInterval(waveAnimation);
            clearInterval(particleAnimation);
            clearInterval(crossAnimation);
        };
    }, [effect.createdAt, effect.radius]);

    // Create circular grid pattern
    const renderGrid = () => {
        const gridLines = [];
        const gridSize = 20;
        const gridExtent = effect.radius * 1.2;
        const ringCount = Math.floor(gridExtent / gridSize);

        // Circular rings
        for (let i = 1; i <= ringCount; i++) {
            gridLines.push(
                <Circle
                    key={`ring-${i}`}
                    radius={i * gridSize}
                    stroke={gridColor}
                    strokeWidth={1}
                />
            );
        }

        // Radial lines
        const radialCount = 12;
        for (let i = 0; i < radialCount; i++) {
            const angle = (i * 2 * Math.PI) / radialCount;
            const x = Math.cos(angle) * gridExtent;
            const y = Math.sin(angle) * gridExtent;

            gridLines.push(
                <Line
                    key={`radial-${i}`}
                    points={[0, 0, x, y]}
                    stroke={gridColor}
                    strokeWidth={1}
                />
            );
        }

        return gridLines;
    };

    return (
        <Group
            x={effect.position.x}
            y={effect.position.y}
            opacity={remainingTime > 300 ? 1 : remainingTime / 300} // Fade out at the end
        >
            {/* Background grid */}
            <Group>
                {renderGrid()}
            </Group>

            {/* Pulse waves - healing rings */}
            {waves.map(wave => (
                <Ring
                    key={wave.id}
                    innerRadius={wave.radius}
                    outerRadius={wave.radius + 2}
                    fill="transparent"
                    stroke={wave.id % 2 === 0 ? primaryColor : secondaryColor}
                    strokeWidth={2}
                    opacity={wave.opacity}
                    perfectDrawEnabled={false}
                />
            ))}

            {/* Healing boundary indicator */}
            <Circle
                radius={effect.radius}
                stroke={primaryColor}
                strokeWidth={1}
                dash={[5, 5]}
                opacity={0.3}
                perfectDrawEnabled={false}
            />

            {/* Healing particles converging toward center */}
            {particles.map(particle => {
                const x = Math.cos(particle.angle) * particle.distance;
                const y = Math.sin(particle.angle) * particle.distance;
                return (
                    <Circle
                        key={particle.id}
                        x={x}
                        y={y}
                        radius={particle.size}
                        fill={Math.random() > 0.5 ? primaryColor : secondaryColor}
                        opacity={particle.opacity}
                    />
                );
            })}

            {/* Central healing node */}
            <Group>
                <animated.Circle
                    radius={12}
                    fill={`rgba(46, 204, 113, ${coreProps.opacity})`}
                    scaleX={coreProps.scaleX}
                    scaleY={coreProps.scaleY}
                />
                <animated.Circle
                    radius={8}
                    fill={`rgba(26, 188, 156, ${coreProps.opacity * 0.8})`}
                    scaleX={coreProps.scaleX}
                    scaleY={coreProps.scaleY}
                />
                <Circle
                    radius={4}
                    fill={accentColor}
                    opacity={0.9}
                />
            </Group>

            {/* Rotating healing cross */}
            <Group rotation={crossRotation}>
                <Line
                    points={[-15, 0, 15, 0]}
                    stroke={accentColor}
                    strokeWidth={2}
                    opacity={0.7}
                />
                <Line
                    points={[0, -15, 0, 15]}
                    stroke={accentColor}
                    strokeWidth={2}
                    opacity={0.7}
                />
            </Group>
        </Group>
    );
}

export default HealEffect;
