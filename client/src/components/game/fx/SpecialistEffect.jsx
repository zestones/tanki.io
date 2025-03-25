import { Circle, Group, Image, Line, Rect, Star, Text } from 'react-konva';
import { useEffect, useState } from 'react';

const SpecialistEffect = ({ effect, player }) => {
    const [opacity, setOpacity] = useState(1);
    const [scale, setScale] = useState(1);
    const [rotation, setRotation] = useState(0);

    useEffect(() => {
        // Animate the effect
        const duration = effect.duration;
        const startTime = effect.createdAt;
        const endTime = startTime + duration;

        const animate = () => {
            const now = Date.now();
            const elapsed = now - startTime;
            const progress = elapsed / duration;

            if (progress >= 1) {
                return;
            }

            // Create different animations based on effect type
            switch (effect.type) {
                case 'dash':
                    setOpacity(1 - progress * 0.5);
                    setScale(1 + progress * 2);
                    break;

                case 'shield':
                    setOpacity(0.6 + Math.sin(progress * Math.PI * 10) * 0.2);
                    setRotation(progress * 360);
                    break;

                case 'homing':
                    setOpacity(1);
                    break;

                case 'decoy':
                    setOpacity(0.8 + Math.sin(progress * Math.PI * 4) * 0.2);
                    break;

                case 'aoe':
                    setScale(progress * 2);
                    setOpacity(1 - progress * 0.9);
                    break;

                default:
                    setOpacity(1 - progress);
            }

            requestAnimationFrame(animate);
        };

        const animationFrame = requestAnimationFrame(animate);

        return () => {
            cancelAnimationFrame(animationFrame);
        };
    }, [effect]);

    if (!player) return null;

    // Render different visual effects based on type
    switch (effect.type) {
        case 'dash':
            return (
                <Group x={player.x} y={player.y} opacity={opacity}>
                    {/* Trail effect */}
                    <Circle
                        radius={30 * scale}
                        fill="rgba(0, 100, 255, 0.3)"
                        opacity={opacity * 0.7}
                    />
                    <Circle
                        radius={15 * scale}
                        fill="rgba(100, 200, 255, 0.5)"
                        opacity={opacity * 0.9}
                    />
                </Group>
            );

        case 'shield':
            return (
                <Group x={player.x} y={player.y} opacity={opacity}>
                    {/* Shield effect */}
                    <Circle
                        radius={35}
                        fill="transparent"
                        stroke="rgba(100, 255, 150, 0.8)"
                        strokeWidth={3}
                        rotation={rotation}
                    />
                    <Circle
                        radius={30}
                        fill="rgba(100, 255, 150, 0.1)"
                    />
                </Group>
            );

        case 'homing':
            // Homing missiles are handled by the bullet rendering system
            return null;

        case 'decoy':
            // For decoys, we'd render ghost versions of the player
            // This is a simplified version
            return (
                <Group x={effect.position.x + (Math.random() - 0.5) * 100} y={effect.position.y + (Math.random() - 0.5) * 100} opacity={opacity * 0.7}>
                    <Circle
                        radius={20}
                        fill="rgba(150, 100, 255, 0.3)"
                    />
                    <Text
                        text="DECOY"
                        fontSize={10}
                        fill="white"
                        offsetX={15}
                        offsetY={5}
                    />
                </Group>
            );

        case 'aoe':
            const targetPos = effect.targetPosition || effect.position;
            return (
                <Group x={targetPos.x} y={targetPos.y} opacity={opacity}>
                    {/* Orbital strike effect */}
                    <Circle
                        radius={effect.radius || 150 * scale}
                        fill="rgba(255, 200, 50, 0.2)"
                    />
                    <Circle
                        radius={(effect.radius || 150) * 0.8 * scale}
                        fill="rgba(255, 150, 0, 0.1)"
                    />
                    <Circle
                        radius={5}
                        fill="rgba(255, 255, 200, 1)"
                    />
                    {/* Beam from above */}
                    <Rect
                        width={8}
                        height={500}
                        offsetX={4}
                        offsetY={500}
                        fill="rgba(255, 230, 150, 0.4)"
                    />
                </Group>
            );

        default:
            return null;
    }
};

export default SpecialistEffect;
