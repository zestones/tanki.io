import PropTypes from 'prop-types';
import { useEffect, useRef, useState, useMemo } from 'react';
import { Circle, Group, Rect, Line, Star } from 'react-konva';

const OrbitalStrikeEffect = ({ effect }) => {
    const [progress, setProgress] = useState(0);
    const animationRef = useRef(null);
    const startTimeRef = useRef(null);
    const [particles, setParticles] = useState([]);
    const [debrisParticles, setDebrisParticles] = useState([]);
    const [shockwaveRings, setShockwaveRings] = useState([]);

    useEffect(() => {
        startTimeRef.current = Date.now();

        // Generate explosion particles with different characteristics
        const particleCount = 30;
        const newParticles = Array.from({ length: particleCount }, () => ({
            angle: Math.random() * Math.PI * 2,
            distance: Math.random() * effect.radius * 0.8,
            size: 2 + Math.random() * 6,
            speed: 0.5 + Math.random() * 1.5,
            opacity: 0.6 + Math.random() * 0.4,
            color: Math.random() > 0.6 ?
                [255, 220, 160] : // yellow-white
                Math.random() > 0.5 ?
                    [255, 150, 50] : // orange
                    [255, 100, 50]   // red-orange
        }));
        setParticles(newParticles);

        // Generate debris particles (larger chunks of material)
        const debrisCount = 15;
        const newDebris = Array.from({ length: debrisCount }, () => ({
            angle: Math.random() * Math.PI * 2,
            distance: Math.random() * effect.radius * 0.4,
            rotationSpeed: (Math.random() - 0.5) * 10,
            rotation: Math.random() * 360,
            size: 3 + Math.random() * 8,
            speed: 0.3 + Math.random() * 1.2,
            opacity: 0.8,
            form: Math.random() > 0.5 ? 'triangle' : 'rectangle'
        }));
        setDebrisParticles(newDebris);

        // Generate random shockwave rings
        const ringsCount = 4;
        const newRings = Array.from({ length: ringsCount }, (_, i) => ({
            delay: i * 0.1, // Stagger the rings
            thickness: 1 + Math.random() * 3,
            speed: 0.7 + Math.random() * 0.6,
            opacity: 0.5 + Math.random() * 0.5,
            dashOffset: Math.random() * 10
        }));
        setShockwaveRings(newRings);

        const animate = () => {
            const elapsed = Date.now() - startTimeRef.current;
            const newProgress = Math.min(elapsed / effect.duration, 1);
            setProgress(newProgress);

            // Keep animating until duration is reached
            if (newProgress < 1) {
                animationRef.current = requestAnimationFrame(animate);
            }
        };

        animationRef.current = requestAnimationFrame(animate);

        return () => {
            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current);
            }
        };
    }, [effect.id, effect.duration, effect.radius]);

    // The visuals will now be based directly on overall progress
    const effectRadius = effect.radius;

    // Generate blast lines (radiating energy lines)
    const blastLines = useMemo(() => {
        const lineCount = 16;
        return Array.from({ length: lineCount }, (_, i) => {
            const angle = (Math.PI * 2 / lineCount) * i;
            return {
                angle,
                length: 0.5 + Math.random() * 0.5,
                width: 1 + Math.random() * 2,
                delay: Math.random() * 0.1
            };
        });
    }, []);

    // Generate fractal nodes for the core explosion pattern
    const fractalNodes = useMemo(() => {
        const nodeCount = 5;
        return Array.from({ length: nodeCount }, (_, i) => {
            const angle = (Math.PI * 2 / nodeCount) * i;
            const distance = effectRadius * 0.2;
            return {
                x: Math.cos(angle) * distance,
                y: Math.sin(angle) * distance,
                size: 4 + Math.random() * 6
            };
        });
    }, [effectRadius]);

    // Calculate fade factor - start fading at 75% progress
    const fadeFactor = progress > 0.75 ? (1 - (progress - 0.75) / 0.25) : 1;

    // Dynamic elements based on the effect's progress
    const beamWidth = effectRadius * 0.2 * Math.sin(Math.PI * progress * 2); // Pulsing beam
    const beamHeight = effectRadius * 10; // Very tall beam from above
    const explosionRadius = effectRadius * Math.min(progress * 1.1, 1);
    const shockwaveProgress = progress * 1.2; // Faster than overall progress

    // Flickering and pulse effects
    const flicker = 0.8 + Math.sin(progress * Math.PI * 20) * 0.2;
    const pulseScale = 1 + Math.sin(progress * Math.PI * 6) * 0.2;

    // Colors with dynamic intensity
    const coreColor = `rgba(255, 255, 255, ${flicker * fadeFactor})`;
    const innerExplosionColor = `rgba(255, 220, 130, ${0.8 * fadeFactor})`;
    const outerExplosionColor = `rgba(255, 120, 50, ${0.7 * fadeFactor})`;
    const energyRingColor = `rgba(255, 160, 30, ${0.6 * flicker * fadeFactor})`;
    const beamColor = `rgba(220, 240, 255, ${0.9 * flicker * fadeFactor})`;

    // Generated blast wave hexagon points
    const blastWavePoints = useMemo(() => {
        const points = [];
        const sides = 6;
        for (let i = 0; i < sides; i++) {
            const angle = (Math.PI * 2 / sides) * i;
            points.push(Math.cos(angle));
            points.push(Math.sin(angle));
        }
        return points;
    }, []);

    return (
        <Group x={effect.position.x} y={effect.position.y}>
            {/* Beam from sky - still visible during explosion */}
            <Rect
                x={-beamWidth / 2}
                y={-beamHeight}
                width={beamWidth}
                height={beamHeight}
                fill={beamColor}
                shadowColor="white"
                shadowBlur={10}
                shadowOpacity={0.5 * fadeFactor}
                opacity={Math.max(0, 0.8 - progress * 0.5)}
            />

            {/* Core explosion elements */}
            <Group>
                {/* Bright core flash */}
                <Circle
                    radius={effectRadius * 0.25 * flicker}
                    fill={coreColor}
                    opacity={fadeFactor}
                    shadowColor="white"
                    shadowBlur={20}
                    shadowOpacity={0.8 * fadeFactor}
                />

                {/* Central explosion */}
                <Circle
                    radius={explosionRadius * 0.5}
                    fill={innerExplosionColor}
                    opacity={0.9 * fadeFactor}
                />

                {/* Outer explosion wave */}
                <Circle
                    radius={explosionRadius}
                    fill={outerExplosionColor}
                    opacity={0.7 * fadeFactor}
                />

                {/* Multiple shockwave rings */}
                {shockwaveRings.map((ring, i) => {
                    // Only show ring after its delay
                    const ringProgress = Math.max(0, shockwaveProgress - ring.delay);
                    if (ringProgress <= 0) return null;

                    return (
                        <Circle
                            key={"shockwave-ring-" + i}
                            radius={explosionRadius * Math.min(ringProgress * ring.speed, 1.2)}
                            stroke={energyRingColor}
                            strokeWidth={ring.thickness * (1 - ringProgress * 0.5)}
                            opacity={ring.opacity * (1 - ringProgress) * fadeFactor}
                            dash={[10, 5]}
                            dashOffset={ring.dashOffset + progress * 20}
                            perfectDrawEnabled={false}
                        />
                    );
                })}

                {/* Radiating blast lines */}
                {blastLines.map((line, i) => {
                    const lineOpacity = Math.max(0, Math.min(1, (progress - line.delay) * 2));
                    const lineLength = effectRadius * line.length * Math.min(progress * 2, 1);

                    return (
                        <Line
                            key={`blast-line-${i}`}
                            points={[
                                0, 0,
                                Math.cos(line.angle) * lineLength,
                                Math.sin(line.angle) * lineLength
                            ]}
                            stroke={`rgba(255, 220, 180, ${lineOpacity * fadeFactor})`}
                            strokeWidth={line.width * (1.5 - progress * 0.5)}
                            opacity={0.7 * fadeFactor}
                            lineCap="round"
                        />
                    );
                })}

                {/* Fractal-like core energy connections */}
                {fractalNodes.map((node, i, arr) => {
                    const nextNode = arr[(i + 1) % arr.length];
                    return (
                        <Group key={`fractal-${i}`} opacity={Math.min(1, progress * 3) * fadeFactor}>
                            {/* Node */}
                            <Circle
                                x={node.x * pulseScale}
                                y={node.y * pulseScale}
                                radius={node.size * (0.5 + Math.sin(progress * Math.PI * 10 + i) * 0.5)}
                                fill={coreColor}
                                opacity={0.8}
                            />

                            {/* Connection to next node */}
                            <Line
                                points={[
                                    node.x * pulseScale,
                                    node.y * pulseScale,
                                    nextNode.x * pulseScale,
                                    nextNode.y * pulseScale
                                ]}
                                stroke={innerExplosionColor}
                                strokeWidth={2 * (0.7 + Math.sin(progress * Math.PI * 5 + i) * 0.3)}
                                opacity={0.6}
                            />

                            {/* Connection to center */}
                            <Line
                                points={[0, 0, node.x * pulseScale, node.y * pulseScale]}
                                stroke={coreColor}
                                strokeWidth={1.5}
                                opacity={0.7}
                                dash={[4, 2]}
                                dashOffset={progress * 20}
                            />
                        </Group>
                    );
                })}

                {/* Energy particles */}
                {particles.map((particle, i) => {
                    const particleProgress = Math.min(1, progress * 1.5);
                    const distanceFactor = particle.distance * particleProgress;
                    const x = Math.cos(particle.angle) * distanceFactor * particle.speed;
                    const y = Math.sin(particle.angle) * distanceFactor * particle.speed;
                    const size = particle.size * (1 - progress * 0.3);
                    const [r, g, b] = particle.color;

                    return (
                        <Circle
                            key={`particle-${i}`}
                            x={x}
                            y={y}
                            radius={size}
                            fill={`rgba(${r}, ${g}, ${b}, ${particle.opacity * fadeFactor})`}
                            shadowColor={`rgb(${r}, ${g}, ${b})`}
                            shadowBlur={10}
                            shadowOpacity={0.6 * fadeFactor}
                        />
                    );
                })}

                {/* Debris chunks */}
                {debrisParticles.map((debris, i) => {
                    const debrisProgress = Math.min(1, progress * 1.3);
                    const distanceFactor = debris.distance * debrisProgress;
                    const x = Math.cos(debris.angle) * distanceFactor * debris.speed * effectRadius;
                    const y = Math.sin(debris.angle) * distanceFactor * debris.speed * effectRadius;
                    const rotation = debris.rotation + progress * debris.rotationSpeed * 360;
                    const opacity = Math.min(1, (1 - debrisProgress)) * debris.opacity * fadeFactor;

                    return debris.form === 'triangle' ? (
                        <Star
                            key={`debris-${i}`}
                            x={x}
                            y={y}
                            numPoints={3}
                            innerRadius={debris.size * 0.5}
                            outerRadius={debris.size}
                            fill={`rgba(255, 180, 120, ${opacity})`}
                            rotation={rotation}
                            opacity={opacity}
                        />
                    ) : (
                        <Rect
                            key={`debris-${i}`}
                            x={x - debris.size / 2}
                            y={y - debris.size / 2}
                            width={debris.size}
                            height={debris.size * 0.8}
                            fill={`rgba(255, 160, 100, ${opacity})`}
                            rotation={rotation}
                            opacity={opacity}
                        />
                    );
                })}

                {/* Miniature secondary explosions */}
                {[...Array(3)].map((_, i) => {
                    const angle = Math.PI * 2 * (i / 3);
                    const distance = effectRadius * 0.6;
                    const delay = 0.2 + i * 0.1;
                    const miniProgress = Math.max(0, Math.min(1, (progress - delay) * 3));
                    if (miniProgress <= 0) return null;

                    const x = Math.cos(angle) * distance;
                    const y = Math.sin(angle) * distance;
                    const size = effectRadius * 0.2 * miniProgress;

                    return (
                        <Group key={`mini-explosion-${i}`} x={x} y={y}>
                            <Circle
                                radius={size}
                                fill={innerExplosionColor}
                                opacity={(1 - miniProgress) * 0.8 * fadeFactor}
                            />
                            <Circle
                                radius={size * 0.6}
                                fill={coreColor}
                                opacity={(1 - miniProgress) * 0.9 * fadeFactor}
                            />
                        </Group>
                    );
                })}
            </Group>

            {/* Ground impact flash - indicates where explosion originates */}
            <Circle
                radius={effectRadius * 0.3 * (1 - progress * 0.7)}
                fill={coreColor}
                opacity={Math.max(0, 1 - progress * 1.5) * fadeFactor}
                shadowColor="white"
                shadowBlur={20}
                shadowOpacity={0.7 * fadeFactor}
            />
        </Group>
    );
};

OrbitalStrikeEffect.propTypes = {
    effect: PropTypes.shape({
        id: PropTypes.string.isRequired,
        playerId: PropTypes.string.isRequired,
        type: PropTypes.string.isRequired,
        position: PropTypes.shape({
            x: PropTypes.number.isRequired,
            y: PropTypes.number.isRequired
        }).isRequired,
        radius: PropTypes.number.isRequired,
        createdAt: PropTypes.number.isRequired,
        duration: PropTypes.number.isRequired,
        name: PropTypes.string.isRequired
    }).isRequired
};

export default OrbitalStrikeEffect;