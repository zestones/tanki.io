import PropTypes from 'prop-types';
import { useEffect, useMemo, useState } from 'react';
import { Circle, Group, Line, Ring, Text } from 'react-konva';

const ShieldEffect = ({ effect, player }) => {
    const [opacity, setOpacity] = useState(1);
    const [rotation, setRotation] = useState(0);
    const [scale, setScale] = useState(1);
    const [pulseScale, setPulseScale] = useState(0);
    const [particlePositions, setParticlePositions] = useState([]);
    const [shockwave, setShockwave] = useState({ active: false, scale: 0, opacity: 0 });

    // Generate shield geometry
    const hexPoints = useMemo(() => {
        const points = [];
        const radius = 42;
        for (let i = 0; i < 6; i++) {
            const angle = (Math.PI / 3) * i - Math.PI / 2;
            points.push(Math.cos(angle) * radius);
            points.push(Math.sin(angle) * radius);
        }
        return points;
    }, []);

    const innerHexPoints = useMemo(() => {
        const points = [];
        const radius = 34;
        for (let i = 0; i < 6; i++) {
            const angle = (Math.PI / 3) * i - Math.PI / 2 + Math.PI / 6; // Offset inner hex
            points.push(Math.cos(angle) * radius);
            points.push(Math.sin(angle) * radius);
        }
        return points;
    }, []);

    const outerRingPoints = useMemo(() => {
        const points = [];
        const radius = 48;
        const segments = 36; // More segments for smoother circle
        for (let i = 0; i <= segments; i++) {
            const angle = (Math.PI * 2 / segments) * i;
            points.push(Math.cos(angle) * radius);
            points.push(Math.sin(angle) * radius);
        }
        return points;
    }, []);

    // Initialize particles
    useEffect(() => {
        // Create energy particles that orbit the shield
        const particles = [];
        const count = 12;

        for (let i = 0; i < count; i++) {
            const angle = (Math.PI * 2 / count) * i;
            const radius = 40 + Math.random() * 10;
            particles.push({
                x: Math.cos(angle) * radius,
                y: Math.sin(angle) * radius,
                radius: 1 + Math.random() * 2.5,
                speed: 0.01 + Math.random() * 0.02,
                offset: i * (Math.PI * 2 / count),
                brightness: 0.5 + Math.random() * 0.5
            });
        }

        setParticlePositions(particles);
    }, []);

    // Animation loop
    useEffect(() => {
        const duration = effect.duration;
        const startTime = effect.createdAt;
        let animationFrame;

        // Create an initial shockwave effect on shield activation
        setShockwave({ active: true, scale: 0.1, opacity: 1 });

        const animate = (timestamp) => {
            const now = Date.now();
            const elapsed = now - startTime;
            const progress = elapsed / duration;

            if (progress >= 1) {
                cancelAnimationFrame(animationFrame);
                return;
            }

            // Main shield opacity with subtle pulsing
            setOpacity(0.7 + Math.sin(progress * Math.PI * 8) * 0.3);

            // Rotation for dynamic effect
            setRotation(progress * 180);

            // Pulse effect that grows outward
            const pulseFrequency = 1500; // ms
            const pulsePhase = (elapsed % pulseFrequency) / pulseFrequency;
            setPulseScale(pulsePhase);

            // Update particle positions
            setParticlePositions(prevParticles =>
                prevParticles.map(particle => ({
                    ...particle,
                    x: Math.cos(progress * Math.PI * 2 * particle.speed + particle.offset) * (40 + Math.sin(progress * 5) * 5),
                    y: Math.sin(progress * Math.PI * 2 * particle.speed + particle.offset) * (40 + Math.sin(progress * 5) * 5),
                }))
            );

            // Initial shockwave animation
            if (progress < 0.2) {
                setShockwave({
                    active: true,
                    scale: progress * 5, // Expand from 0 to 1x over the first 20% of duration
                    opacity: 1 - progress * 5 // Fade out over the same period
                });
            } else if (shockwave.active) {
                setShockwave({ active: false, scale: 0, opacity: 0 });
            }

            // Scale effect for activation/deactivation
            if (progress < 0.1) {
                // Initial activation expansion
                setScale(progress * 10);
            } else if (progress > 0.9) {
                // Final fade out
                setScale(1 - (progress - 0.9) * 10);
            } else {
                // Subtle breathing effect while active
                setScale(1 + Math.sin(progress * Math.PI * 6) * 0.05);
            }

            // Create periodic pulse shockwaves
            if (progress > 0.2 && Math.sin(progress * Math.PI * 8) > 0.95) {
                setShockwave({
                    active: true,
                    scale: 0.5,
                    opacity: 0.7
                });
            }

            animationFrame = requestAnimationFrame(animate);
        };

        animationFrame = requestAnimationFrame(animate);
        return () => cancelAnimationFrame(animationFrame);
    }, [effect]);

    // Calculate shield color and glow based on player's shield strength
    const shieldColor = useMemo(() => {
        // You could use player.hp to determine shield color intensity
        // For now we'll use a cyan blue color scheme
        return {
            primary: "rgba(80, 220, 255, 0.85)",
            secondary: "rgba(150, 240, 255, 0.6)",
            glow: "rgba(100, 210, 255, 0.5)",
            core: "rgba(220, 255, 255, 0.8)"
        };
    }, [player]);

    return (
        <Group x={player.x} y={player.y}>
            {/* Initial shockwave effect */}
            {shockwave.active && (
                <Ring
                    innerRadius={45 * shockwave.scale * 0.9}
                    outerRadius={45 * shockwave.scale}
                    fill="transparent"
                    stroke={shieldColor.primary}
                    strokeWidth={3}
                    opacity={shockwave.opacity}
                />
            )}

            {/* Pulsing outer ring */}
            <Ring
                innerRadius={45 * (0.9 + pulseScale * 0.3)}
                outerRadius={48 * (0.9 + pulseScale * 0.3)}
                fill="transparent"
                stroke={shieldColor.primary}
                strokeWidth={1.5}
                opacity={(1 - pulseScale) * opacity * scale}
                shadowColor={shieldColor.glow}
                shadowBlur={15}
                shadowOpacity={0.7}
            />

            {/* Smooth outer ring */}
            <Line
                points={outerRingPoints}
                closed={true}
                stroke={shieldColor.primary}
                strokeWidth={1}
                opacity={0.6 * opacity * scale}
                dash={[2, 5]}
                scale={{ x: 1 + Math.sin(rotation / 50) * 0.03, y: 1 + Math.cos(rotation / 50) * 0.03 }}
            />

            {/* Main hexagonal shield */}
            <Line
                points={hexPoints}
                closed={true}
                stroke={shieldColor.primary}
                strokeWidth={2.5}
                fill={"rgba(120, 230, 255, 0.12)"}
                rotation={rotation * 0.5}
                scale={{ x: scale, y: scale }}
                shadowColor={shieldColor.glow}
                shadowBlur={15}
                shadowOpacity={0.8 * opacity}
            />

            {/* Inner hexagonal pattern */}
            <Line
                points={innerHexPoints}
                closed={true}
                stroke={"rgba(255, 255, 255, 0.7)"}
                strokeWidth={1.5}
                dash={[5, 3]}
                fill="transparent"
                rotation={-rotation * 0.7} // Rotate in opposite direction
                scale={{ x: scale * 0.9, y: scale * 0.9 }}
                opacity={0.8 * opacity}
            />

            {/* Rune-like tech markings */}
            <Group rotation={rotation * 0.2} scale={{ x: scale, y: scale }} opacity={opacity * 0.9}>
                {/* Top rune */}
                <Line
                    points={[0, -28, -8, -36, 0, -44, 8, -36, 0, -28]}
                    stroke="rgba(200, 250, 255, 0.9)"
                    strokeWidth={1.5}
                    closed={true}
                />

                {/* Bottom rune */}
                <Line
                    points={[0, 28, -5, 36, 0, 40, 5, 36, 0, 28]}
                    stroke="rgba(200, 250, 255, 0.9)"
                    strokeWidth={1.5}
                    closed={true}
                />

                {/* Left rune */}
                <Line
                    points={[-28, 0, -36, -5, -40, 0, -36, 5, -28, 0]}
                    stroke="rgba(200, 250, 255, 0.9)"
                    strokeWidth={1.5}
                    closed={true}
                />

                {/* Right rune */}
                <Line
                    points={[28, 0, 36, -5, 40, 0, 36, 5, 28, 0]}
                    stroke="rgba(200, 250, 255, 0.9)"
                    strokeWidth={1.5}
                    closed={true}
                />
            </Group>

            {/* Energy particles */}
            {particlePositions.map((particle, i) => (
                <Circle
                    key={`shield-particle-${i}`}
                    x={particle.x}
                    y={particle.y}
                    radius={particle.radius * scale}
                    fill={`rgba(200, 250, 255, ${particle.brightness * opacity})`}
                    shadowColor={shieldColor.glow}
                    shadowBlur={8}
                    shadowOpacity={0.8}
                />
            ))}

            {/* Central energy core */}
            <Group scale={{ x: scale, y: scale }} opacity={opacity}>
                <Circle
                    radius={14}
                    fill="rgba(120, 230, 255, 0.2)"
                    stroke="rgba(200, 250, 255, 0.6)"
                    strokeWidth={1}
                />
                <Circle
                    radius={9}
                    fill="rgba(180, 255, 255, 0.4)"
                    stroke="rgba(255, 255, 255, 0.8)"
                    strokeWidth={1.5}
                    shadowColor="white"
                    shadowBlur={10}
                    shadowOpacity={0.6}
                />
                <Circle
                    radius={4}
                    fill="rgba(255, 255, 255, 0.9)"
                />
            </Group>

            {/* Shield status text */}
            <Text
                text="SHIELD"
                fontSize={7}
                fontFamily="'Rajdhani', sans-serif"
                fontStyle="bold"
                fill="rgba(255, 255, 255, 0.9)"
                align="center"
                verticalAlign="middle"
                offsetY={-22}
                opacity={opacity * scale}
            />

            {/* Decorative energy lines */}
            {[0, 60, 120, 180, 240, 300].map((angle, i) => (
                <Line
                    key={`energy-line-${i}`}
                    points={[0, 0, 30 * scale, 0]}
                    stroke={shieldColor.secondary}
                    strokeWidth={2}
                    rotation={angle + rotation * 0.2}
                    opacity={(0.4 + Math.sin((rotation / 180) * Math.PI + i) * 0.4) * opacity}
                />
            ))}
        </Group>
    );
};

ShieldEffect.propTypes = {
    effect: PropTypes.object.isRequired,
    player: PropTypes.object.isRequired
};

export default ShieldEffect;
