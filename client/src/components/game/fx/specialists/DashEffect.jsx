import { Circle, Group } from 'react-konva';
import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

const DashEffect = ({ effect, player }) => {
    const [opacity, setOpacity] = useState(1);
    const [scale, setScale] = useState(1);

    useEffect(() => {
        const duration = effect.duration;
        const startTime = effect.createdAt;

        const animate = () => {
            const now = Date.now();
            const elapsed = now - startTime;
            const progress = elapsed / duration;

            if (progress >= 1) return;

            setOpacity(1 - progress * 0.5);
            setScale(1 + progress * 2);

            requestAnimationFrame(animate);
        };

        const animationFrame = requestAnimationFrame(animate);
        return () => cancelAnimationFrame(animationFrame);
    }, [effect]);

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
};

DashEffect.propTypes = {
    effect: PropTypes.object.isRequired,
    player: PropTypes.object.isRequired
};

export default DashEffect;
