import PropTypes from 'prop-types';
import { useEffect, useMemo, useState } from 'react';
import { Circle, Group, Line, Ring, Text } from 'react-konva';

const DamageBoostEffect = ({ effect, player }) => {
    const [opacity, setOpacity] = useState(1);
    const [rotation, setRotation] = useState(0);
    const [scale, setScale] = useState(1);
    const [pulseScale, setPulseScale] = useState(0);
    const [particlePositions, setParticlePositions] = useState([]);
    const [flamePositions, setFlamePositions] = useState([]);
    const [energyWave, setEnergyWave] = useState({ active: false, scale: 0, opacity: 0 });

    // Generate boost geometry
    const boostPoints = useMemo(() => {
        const points = [];
        const radius = 45;
        for (let i = 0; i < 8; i++) {
            const angle = (Math.PI / 4) * i;
            points.push(Math.cos(angle) * radius);
            points.push(Math.sin(angle) * radius);
        }
        return points;
    }, []);

    const innerRingPoints = useMemo(() => {
        const points = [];
        const radius = 38;
        const segments = 36; // More segments for smoother circle
        for (let i = 0; i <= segments; i++) {
            const angle = (Math.PI * 2 / segments) * i;
            points.push(Math.cos(angle) * radius);
            points.push(Math.sin(angle) * radius);
        }
        return points;
    }, []);

    const outerRingPoints = useMemo(() => {
        const points = [];
        const radius = 52;
        const segments = 36;
        for (let i = 0; i <= segments; i++) {
            const angle = (Math.PI * 2 / segments) * i;
            points.push(Math.cos(angle) * radius);
            points.push(Math.sin(angle) * radius);
        }
        return points;
    }, []);

    // Initialize particles and flames
    useEffect(() => {
        // Create energy particles that orbit the boost aura
        const particles = [];
        const count = 16;

        for (let i = 0; i < count; i++) {
            const angle = (Math.PI * 2 / count) * i;
            const radius = 42 + Math.random() * 12;
            particles.push({
                x: Math.cos(angle) * radius,
                y: Math.sin(angle) * radius,
                radius: 1 + Math.random() * 2,
                speed: 0.02 + Math.random() * 0.03,
                offset: i * (Math.PI * 2 / count),
                brightness: 0.6 + Math.random() * 0.4
            });
        }

        setParticlePositions(particles);

        // Create flame-like effects
        const flames = [];
        const flameCount = 10;

        for (let i = 0; i < flameCount; i++) {
            const angle = (Math.PI * 2 / flameCount) * i;
            flames.push({
                baseAngle: angle,
                height: 12 + Math.random() * 8,
                width: 5 + Math.random() * 3,
                speed: 0.02 + Math.random() * 0.03,
                phase: Math.random() * Math.PI * 2
            });
        }

        setFlamePositions(flames);
    }, []);

    // Animation loop
    useEffect(() => {
        const duration = effect.duration;
        const startTime = effect.createdAt;
        let animationFrame;

        // Create an initial energy wave effect on boost activation
        setEnergyWave({ active: true, scale: 0.1, opacity: 1 });

        const animate = (timestamp) => {
            const now = Date.now();
            const elapsed = now - startTime;
            const progress = elapsed / duration;

            if (progress >= 1) {
                cancelAnimationFrame(animationFrame);
                return;
            }

            // Main boost opacity with intense pulsing
            setOpacity(0.8 + Math.sin(progress * Math.PI * 12) * 0.2);

            // Fast rotation for dynamic effect
            setRotation(progress * 240);

            // Pulse effect that grows outward
            const pulseFrequency = 1200; // ms
            const pulsePhase = (elapsed % pulseFrequency) / pulseFrequency;
            setPulseScale(pulsePhase);

            // Update particle positions
            setParticlePositions(prevParticles =>
                prevParticles.map(particle => ({
                    ...particle,
                    x: Math.cos(progress * Math.PI * 3 * particle.speed + particle.offset) * (42 + Math.sin(progress * 7) * 6),
                    y: Math.sin(progress * Math.PI * 3 * particle.speed + particle.offset) * (42 + Math.sin(progress * 7) * 6),
                }))
            );

            // Update flame positions and sizes
            setFlamePositions(prevFlames =>
                prevFlames.map(flame => ({
                    ...flame,
                    height: 12 + Math.random() * 8 + Math.sin(progress * 10 + flame.phase) * 5,
                    width: 5 + Math.random() * 3 + Math.sin(progress * 12 + flame.phase) * 2
                }))
            );

            // Initial energy wave animation
            if (progress < 0.15) {
                setEnergyWave({
                    active: true,
                    scale: progress * 6.5,
                    opacity: 1 - progress * 6.5
                });
            } else if (energyWave.active && progress >= 0.15) {
                setEnergyWave({ active: false, scale: 0, opacity: 0 });
            }

            // Scale effect for activation/deactivation
            if (progress < 0.08) {
                // Initial activation expansion
                setScale(progress * 12.5);
            } else if (progress > 0.92) {
                // Final fade out
                setScale(1 - (progress - 0.92) * 12.5);
            } else {
                // Intense pulsing effect while active
                setScale(1 + Math.sin(progress * Math.PI * 10) * 0.08);
            }

            // Create periodic energy pulses
            if (progress > 0.2 && Math.sin(progress * Math.PI * 10) > 0.93) {
                setEnergyWave({
                    active: true,
                    scale: 0.6,
                    opacity: 0.8
                });
            }

            animationFrame = requestAnimationFrame(animate);
        };

        animationFrame = requestAnimationFrame(animate);
        return () => cancelAnimationFrame(animationFrame);
    }, [effect]);

    // Calculate boost color and glow based on player's status
    const boostColor = useMemo(() => {
        return {
            primary: "rgba(255, 100, 30, 0.85)",
            secondary: "rgba(255, 180, 50, 0.7)",
            glow: "rgba(255, 120, 30, 0.6)",
            core: "rgba(255, 255, 150, 0.9)"
        };
    }, [player]);

    return (
        <Group x={player.x} y={player.y}>
            {/* Initial energy wave effect */}
            {energyWave.active && (
                <Ring
                    innerRadius={48 * energyWave.scale * 0.9}
                    outerRadius={48 * energyWave.scale}
                    fill="transparent"
                    stroke={boostColor.primary}
                    strokeWidth={3}
                    opacity={energyWave.opacity}
                />
            )}

            {/* Pulsing outer ring */}
            <Ring
                innerRadius={46 * (0.9 + pulseScale * 0.3)}
                outerRadius={50 * (0.9 + pulseScale * 0.3)}
                fill="transparent"
                stroke={boostColor.primary}
                strokeWidth={2}
                opacity={(1 - pulseScale) * opacity * scale}
                shadowColor={boostColor.glow}
                shadowBlur={15}
                shadowOpacity={0.8}
            />

            {/* Smooth outer ring */}
            <Line
                points={outerRingPoints}
                closed={true}
                stroke={boostColor.primary}
                strokeWidth={1.5}
                opacity={0.7 * opacity * scale}
                dash={[4, 3]}
                rotation={rotation * 0.2}
                scale={{ x: 1 + Math.sin(rotation / 40) * 0.04, y: 1 + Math.cos(rotation / 40) * 0.04 }}
                shadowColor={boostColor.glow}
                shadowBlur={10}
                shadowOpacity={0.5}
            />

            {/* Inner rotating ring */}
            <Line
                points={innerRingPoints}
                closed={true}
                stroke={boostColor.secondary}
                strokeWidth={1.5}
                rotation={-rotation * 0.5}
                opacity={0.8 * opacity * scale}
            />

            {/* Main octagon boost indicator */}
            <Line
                points={boostPoints}
                closed={true}
                stroke={boostColor.primary}
                strokeWidth={3}
                fill={"rgba(255, 120, 40, 0.15)"}
                rotation={rotation * 0.1}
                scale={{ x: scale, y: scale }}
                shadowColor={boostColor.glow}
                shadowBlur={20}
                shadowOpacity={0.9 * opacity}
            />

            {/* Flame effects around the boost */}
            <Group rotation={rotation * 0.05} scale={{ x: scale, y: scale }} opacity={opacity}>
                {flamePositions.map((flame, i) => (
                    <Group key={`flame-${i}`} rotation={flame.baseAngle * (180 / Math.PI)}>
                        <Line
                            points={[0, 0, -flame.width, -flame.height, 0, -(flame.height * 1.5), flame.width, -flame.height, 0, 0]}
                            closed={true}
                            fill={boostColor.secondary}
                            opacity={0.6 + Math.random() * 0.4}
                            x={40}
                        />
                    </Group>
                ))}
            </Group>

            {/* Energy particles */}
            {particlePositions.map((particle, i) => (
                <Circle
                    key={`boost-particle-${i}`}
                    x={particle.x}
                    y={particle.y}
                    radius={particle.radius * scale}
                    fill={`rgba(255, 200, 80, ${particle.brightness * opacity})`}
                    shadowColor={boostColor.glow}
                    shadowBlur={8}
                    shadowOpacity={0.9}
                />
            ))}

            {/* Central energy core */}
            <Group scale={{ x: scale, y: scale }} opacity={opacity}>
                <Circle
                    radius={16}
                    fill="rgba(255, 150, 50, 0.25)"
                    stroke="rgba(255, 180, 60, 0.7)"
                    strokeWidth={1.5}
                />
                <Circle
                    radius={11}
                    fill="rgba(255, 200, 80, 0.5)"
                    stroke="rgba(255, 220, 100, 0.8)"
                    strokeWidth={2}
                    shadowColor="rgba(255, 180, 60, 0.8)"
                    shadowBlur={12}
                    shadowOpacity={0.7}
                />
                <Circle
                    radius={5}
                    fill="rgba(255, 240, 180, 0.9)"
                />
            </Group>

            {/* Boost status text */}
            <Text
                text="DAMAGE BOOST"
                fontSize={7}
                fontFamily="'Rajdhani', sans-serif"
                fontStyle="bold"
                fill="rgba(255, 255, 255, 0.9)"
                align="center"
                verticalAlign="middle"
                offsetY={-25}
                opacity={opacity * scale}
            />

            {/* Energy bursts in different directions */}
            {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => (
                <Line
                    key={`energy-burst-${i}`}
                    points={[0, 0, 25 * scale, 0]}
                    stroke={`rgba(255, ${160 + Math.random() * 95}, 50, ${0.5 + Math.random() * 0.5})`}
                    strokeWidth={2 + Math.random() * 2}
                    rotation={angle + rotation * 0.1}
                    opacity={(0.4 + Math.sin((rotation / 120) * Math.PI + i) * 0.5) * opacity}
                />
            ))}
        </Group>
    );
};

DamageBoostEffect.propTypes = {
    effect: PropTypes.object.isRequired,
    player: PropTypes.object.isRequired
};

export default DamageBoostEffect;
