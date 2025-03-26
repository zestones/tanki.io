import { Circle, Group, Rect } from 'react-konva';
import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

const OrbitalStrikeEffect = ({ effect }) => {
    const [opacity, setOpacity] = useState(1);
    const [scale, setScale] = useState(0.2);

    const targetPos = effect.targetPosition || effect.position;

    useEffect(() => {
        const duration = effect.duration;
        const startTime = effect.createdAt;

        const animate = () => {
            const now = Date.now();
            const elapsed = now - startTime;
            const progress = elapsed / duration;

            if (progress >= 1) return;

            setScale(Math.min(1 + progress, 2));
            setOpacity(1 - progress * 0.9);

            requestAnimationFrame(animate);
        };

        const animationFrame = requestAnimationFrame(animate);
        return () => cancelAnimationFrame(animationFrame);
    }, [effect]);

    return (
        <Group x={targetPos.x} y={targetPos.y} opacity={opacity}>
            {/* Orbital strike effect */}
            <Circle
                radius={150 * scale}
                fill="rgba(255, 200, 50, 0.2)"
            />
            <Circle
                radius={120 * scale}
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
};

OrbitalStrikeEffect.propTypes = {
    effect: PropTypes.object.isRequired,
    player: PropTypes.object.isRequired
};

export default OrbitalStrikeEffect;
