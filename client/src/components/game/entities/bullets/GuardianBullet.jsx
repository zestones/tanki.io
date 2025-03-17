import PropTypes from 'prop-types';
import { Circle, Group, Line, RegularPolygon } from 'react-konva';

const BULLET_SIZE = 5;

function GuardianBullet({ bullet }) {
    return (
        <Group>
            {/* Primary hexagonal shield projection */}
            <RegularPolygon
                x={bullet.x}
                y={bullet.y}
                sides={6}
                radius={BULLET_SIZE * 2.5}
                fill="rgba(52, 152, 219, 0.15)"
                stroke="rgba(52, 152, 219, 0.6)"
                strokeWidth={0.8}
                rotation={bullet.direction}
            />

            {/* Energy trail with hexagonal nodes */}
            <Line
                points={[
                    bullet.x - Math.cos((bullet.direction * Math.PI) / 180) * BULLET_SIZE * 7,
                    bullet.y + Math.sin((bullet.direction * Math.PI) / 180) * BULLET_SIZE * 7,
                    bullet.x - Math.cos((bullet.direction * Math.PI) / 180) * BULLET_SIZE * 4.5,
                    bullet.y + Math.sin((bullet.direction * Math.PI) / 180) * BULLET_SIZE * 4.5,
                    bullet.x - Math.cos((bullet.direction * Math.PI) / 180) * BULLET_SIZE * 2,
                    bullet.y + Math.sin((bullet.direction * Math.PI) / 180) * BULLET_SIZE * 2,
                    bullet.x,
                    bullet.y
                ]}
                stroke="rgba(52, 152, 219, 0.7)"
                strokeWidth={BULLET_SIZE * 0.8}
                lineCap="round"
            />

            <RegularPolygon
                x={bullet.x}
                y={bullet.y}
                sides={6}
                radius={BULLET_SIZE * 1.2}
                fill="#3498db"
                rotation={bullet.direction + 30}
            />

            {/* Inner energetic core */}
            <Circle
                x={bullet.x}
                y={bullet.y}
                radius={BULLET_SIZE * 0.7}
                fill="#85c1e9"
            />

            {/* Protective barrier effect (pulsing shield) */}
            <Circle
                x={bullet.x}
                y={bullet.y}
                radius={BULLET_SIZE * 2}
                stroke="rgba(52, 152, 219, 0.8)"
                strokeWidth={1.5}
                fill="rgba(52, 152, 219, 0.1)"
            />

            {/* Energy diffraction lines */}
            <Line
                points={[
                    bullet.x - BULLET_SIZE * 1.8,
                    bullet.y - BULLET_SIZE * 1.8,
                    bullet.x + BULLET_SIZE * 1.8,
                    bullet.y + BULLET_SIZE * 1.8
                ]}
                stroke="rgba(142, 202, 230, 0.8)"
                strokeWidth={0.8}
            />
            <Line
                points={[
                    bullet.x + BULLET_SIZE * 1.8,
                    bullet.y - BULLET_SIZE * 1.8,
                    bullet.x - BULLET_SIZE * 1.8,
                    bullet.y + BULLET_SIZE * 1.8
                ]}
                stroke="rgba(142, 202, 230, 0.8)"
                strokeWidth={0.8}
            />

            <Circle
                x={bullet.x - BULLET_SIZE / 4}
                y={bullet.y - BULLET_SIZE / 4}
                radius={BULLET_SIZE / 4}
                fill="rgba(255, 255, 255, 0.9)"
            />
        </Group>
    );
}

GuardianBullet.propTypes = {
    bullet: PropTypes.shape({
        x: PropTypes.number.isRequired,
        y: PropTypes.number.isRequired,
        direction: PropTypes.number.isRequired
    }).isRequired
};

export default GuardianBullet;
