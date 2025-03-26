import { Circle, Group, Text } from 'react-konva';
import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

const DecoyEffect = ({ effect, player }) => {
    const [opacity, setOpacity] = useState(0.7);
    const [positions, setPositions] = useState([]);

    useEffect(() => {
        // Generate random positions for decoys
        const decoyCount = 3; // Could be from effect.effect.decoyCount
        const newPositions = [];

        for (let i = 0; i < decoyCount; i++) {
            newPositions.push({
                x: effect.position.x + (Math.random() - 0.5) * 100,
                y: effect.position.y + (Math.random() - 0.5) * 100
            });
        }

        setPositions(newPositions);

        // Animation loop
        const duration = effect.duration;
        const startTime = effect.createdAt;

        const animate = () => {
            const now = Date.now();
            const elapsed = now - startTime;
            const progress = elapsed / duration;

            if (progress >= 1) return;

            setOpacity(0.8 + Math.sin(progress * Math.PI * 4) * 0.2);

            requestAnimationFrame(animate);
        };

        const animationFrame = requestAnimationFrame(animate);
        return () => cancelAnimationFrame(animationFrame);
    }, [effect]);

    return (
        <>
            {positions.map((pos, index) => (
                <Group
                    key={`decoy-${effect.id}-${index}`}
                    x={pos.x}
                    y={pos.y}
                    opacity={opacity}
                >
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
            ))}
        </>
    );
};

DecoyEffect.propTypes = {
    effect: PropTypes.object.isRequired,
    player: PropTypes.object.isRequired
};

export default DecoyEffect;
