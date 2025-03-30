import React, { useEffect, useState } from 'react';
import { Group, Circle, Line, Text, Ring } from 'react-konva';
import { useSpring, animated } from '@react-spring/konva';

function EMPEffect({ effect }) {
    const [waves, setWaves] = useState([]);
    const [glitchPhase, setGlitchPhase] = useState(0);
    const [dataPoints, setDataPoints] = useState([]);

    const primaryColor = '#36D1DC';
    const secondaryColor = '#5B86E5';
    const accentColor = '#FFFFFF';
    const gridColor = 'rgba(50, 60, 80, 0.3)';

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

    // Initialize waves and data points
    useEffect(() => {
        // Create initial waves
        const initialWaves = Array(5).fill(0).map((_, i) => ({
            id: i,
            radius: 0,
            opacity: 0.8,
            phase: i * 0.2, // Staggered phase
        }));

        setWaves(initialWaves);

        // Create data point UI elements
        const points = Array(8).fill(0).map((_, i) => ({
            id: i,
            angle: Math.random() * Math.PI * 2,
            distance: effect.radius * (0.6 + Math.random() * 0.3),
            text: Math.random() > 0.5
                ? Math.floor(Math.random() * 100).toString()
                : (Math.random() > 0.5 ? '01' : 'EMP'),
            opacity: 0.2 + Math.random() * 0.6
        }));

        setDataPoints(points);

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
                    let newRadius = wave.radius + 2;
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

        const glitchAnimation = setInterval(() => {
            setGlitchPhase(prev => (prev + 1) % 20);
        }, 100);

        // Clean up animations
        return () => {
            clearInterval(coreAnimation);
            clearInterval(waveAnimation);
            clearInterval(glitchAnimation);
        };
    }, [effect.createdAt, effect.radius]);

    // Create hexagonal grid pattern
    const renderGrid = () => {
        const gridLines = [];
        const gridSize = 20;
        const gridExtent = effect.radius * 1.2;

        // Horizontal lines
        for (let i = -gridExtent; i <= gridExtent; i += gridSize) {
            gridLines.push(
                <Line
                    key={`h-${i}`}
                    points={[-gridExtent, i, gridExtent, i]}
                    stroke={gridColor}
                    strokeWidth={1}
                    opacity={0.3}
                />
            );
        }

        // Vertical lines
        for (let i = -gridExtent; i <= gridExtent; i += gridSize) {
            gridLines.push(
                <Line
                    key={`v-${i}`}
                    points={[i, -gridExtent, i, gridExtent]}
                    stroke={gridColor}
                    strokeWidth={1}
                    opacity={0.3}
                />
            );
        }

        return gridLines;
    };

    // Apply distortion effect based on glitch phase
    const applyDistortion = (baseRadius, waveId) => {
        if (glitchPhase > 15) {
            return baseRadius + (waveId % 2 === 0 ? 3 : -2);
        }
        return baseRadius;
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

            {/* Pulse waves */}
            {waves.map(wave => (
                <Ring
                    key={wave.id}
                    innerRadius={applyDistortion(wave.radius, wave.id)}
                    outerRadius={applyDistortion(wave.radius + 2, wave.id)}
                    fill="transparent"
                    stroke={wave.id % 2 === 0 ? primaryColor : secondaryColor}
                    strokeWidth={2}
                    opacity={wave.opacity}
                    perfectDrawEnabled={false}
                />
            ))}

            {/* EMP boundary indicator */}
            <Circle
                radius={effect.radius}
                stroke={primaryColor}
                strokeWidth={1}
                dash={[5, 5]}
                opacity={0.3}
                perfectDrawEnabled={false}
            />

            {/* Central node/core */}
            <Group>
                <animated.Circle
                    radius={12}
                    fill={`rgba(54, 209, 220, ${coreProps.opacity})`}
                    scaleX={coreProps.scaleX}
                    scaleY={coreProps.scaleY}
                />
                <animated.Circle
                    radius={8}
                    fill={`rgba(91, 134, 229, ${coreProps.opacity * 0.8})`}
                    scaleX={coreProps.scaleX}
                    scaleY={coreProps.scaleY}
                />
                <Circle
                    radius={4}
                    fill={accentColor}
                    opacity={0.9}
                />
            </Group>

            {/* Center cross */}
            <Line
                points={[-10, 0, 10, 0]}
                stroke={accentColor}
                strokeWidth={1}
                opacity={0.7}
            />
            <Line
                points={[0, -10, 0, 10]}
                stroke={accentColor}
                strokeWidth={1}
                opacity={0.7}
            />
        </Group>
    );
};

export default EMPEffect;
