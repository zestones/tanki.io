import { Group, Circle, Line } from 'react-konva';
import PropTypes from 'prop-types';

const BULLET_SIZE = 5;

function Bullet({ bullet }) {
    return (
        <Group>
            {/* Bullet trail */}
            <Line
                points={[
                    bullet.x - Math.cos((bullet.direction * Math.PI) / 180) * BULLET_SIZE * 6,
                    bullet.y + Math.sin((bullet.direction * Math.PI) / 180) * BULLET_SIZE * 6,
                    bullet.x,
                    bullet.y
                ]}
                stroke="rgba(255, 165, 0, 0.6)"
                strokeWidth={BULLET_SIZE}
                lineCap="round"
            />

            {/* Outer glow */}
            <Circle
                x={bullet.x}
                y={bullet.y}
                radius={BULLET_SIZE * 3}
                fill="rgba(255, 165, 0, 0.1)"
            />

            {/* Inner glow */}
            <Circle
                x={bullet.x}
                y={bullet.y}
                radius={BULLET_SIZE * 2}
                fill="rgba(255, 165, 0, 0.3)"
            />

            {/* Bullet body */}
            <Circle
                x={bullet.x}
                y={bullet.y}
                radius={BULLET_SIZE}
                fill="#FFA500"
            />

            {/* Highlight */}
            <Circle
                x={bullet.x - BULLET_SIZE / 3}
                y={bullet.y - BULLET_SIZE / 3}
                radius={BULLET_SIZE / 3}
                fill="rgba(255, 255, 255, 0.8)"
            />
        </Group>
    );
}

Bullet.propTypes = {
    bullet: PropTypes.shape({
        x: PropTypes.number.isRequired,
        y: PropTypes.number.isRequired,
        direction: PropTypes.number.isRequired
    }).isRequired
};

export default Bullet;