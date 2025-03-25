import PropTypes from 'prop-types';
import { Circle, Group, Line, RegularPolygon, Ring } from 'react-konva';

const BULLET_SIZE = 5;

function JuggernautBullet({ bullet }) {
    return (
        <Group>
            {/* Impact shockwave - representing breakthrough capability */}
            <Circle
                x={bullet.x}
                y={bullet.y}
                radius={BULLET_SIZE * 2.3}
                fill="rgba(241, 196, 15, 0.08)"
                stroke="rgba(241, 196, 15, 0.3)"
                strokeWidth={0.8}
            />

            <RegularPolygon
                x={bullet.x}
                y={bullet.y}
                sides={6}
                radius={BULLET_SIZE * 2}
                stroke="rgba(241, 196, 15, 0.5)"
                strokeWidth={1}
                fill="rgba(241, 196, 15, 0.15)"
                rotation={bullet.direction * 0.2}
            />

            {/* Heavy Artillery trail with energy particles */}
            <Line
                points={[
                    bullet.x - Math.cos((bullet.direction * Math.PI) / 180) * BULLET_SIZE * 10,
                    bullet.y + Math.sin((bullet.direction * Math.PI) / 180) * BULLET_SIZE * 10,
                    bullet.x - Math.cos((bullet.direction * Math.PI) / 180) * BULLET_SIZE * 6,
                    bullet.y + Math.sin((bullet.direction * Math.PI) / 180) * BULLET_SIZE * 6,
                    bullet.x - Math.cos((bullet.direction * Math.PI) / 180) * BULLET_SIZE * 3,
                    bullet.y + Math.sin((bullet.direction * Math.PI) / 180) * BULLET_SIZE * 3,
                    bullet.x,
                    bullet.y
                ]}
                stroke="rgba(241, 196, 15, 0.7)"
                strokeWidth={BULLET_SIZE * 1.3}
                lineCap="round"
                tension={0.2}
            />

            {/* Secondary energy trail - smoother animation feel */}
            <Line
                points={[
                    bullet.x - Math.cos((bullet.direction * Math.PI) / 180) * BULLET_SIZE * 8,
                    bullet.y + Math.sin((bullet.direction * Math.PI) / 180) * BULLET_SIZE * 8,
                    bullet.x,
                    bullet.y
                ]}
                stroke="rgba(243, 213, 78, 0.6)"
                strokeWidth={BULLET_SIZE * 0.9}
                lineCap="round"
            />

            {/* Primary projectile - large caliber shell */}
            <Circle
                x={bullet.x}
                y={bullet.y}
                radius={BULLET_SIZE * 1.6}
                fill="rgba(241, 196, 15, 0.6)"
                stroke="rgba(243, 156, 18, 0.8)"
                strokeWidth={0.6}
            />

            {/* Originium energy core */}
            <RegularPolygon
                x={bullet.x}
                y={bullet.y}
                sides={3}
                radius={BULLET_SIZE * 1.1}
                fill="#f1c40f"
                rotation={bullet.direction}
                stroke="rgba(255, 255, 255, 0.6)"
                strokeWidth={0.8}
            />

            {/* Secondary energy core */}
            <Circle
                x={bullet.x}
                y={bullet.y}
                radius={BULLET_SIZE * 0.7}
                fill="#f39c12"
            />

            {/* Compression rings - showing stored energy */}
            <Ring
                x={bullet.x}
                y={bullet.y}
                innerRadius={BULLET_SIZE * 2}
                outerRadius={BULLET_SIZE * 2.1}
                fill="rgba(241, 196, 15, 0)"
                stroke="rgba(243, 156, 18, 0.7)"
                strokeWidth={0.5}
            />
            <Ring
                x={bullet.x}
                y={bullet.y}
                innerRadius={BULLET_SIZE * 2.3}
                outerRadius={BULLET_SIZE * 2.4}
                fill="rgba(241, 196, 15, 0)"
                stroke="rgba(243, 156, 18, 0.4)"
                strokeWidth={0.4}
            />

            {/* Direction indicators - showing path of impact */}
            <Line
                points={[
                    bullet.x + Math.cos((bullet.direction * Math.PI) / 180) * BULLET_SIZE * 1.8,
                    bullet.y - Math.sin((bullet.direction * Math.PI) / 180) * BULLET_SIZE * 1.8,
                    bullet.x + Math.cos((bullet.direction * Math.PI) / 180) * BULLET_SIZE * 2.5,
                    bullet.y - Math.sin((bullet.direction * Math.PI) / 180) * BULLET_SIZE * 2.5,
                ]}
                stroke="rgba(243, 156, 18, 0.7)"
                strokeWidth={BULLET_SIZE * 0.4}
                lineCap="round"
            />

            <Circle
                x={bullet.x - BULLET_SIZE / 3}
                y={bullet.y - BULLET_SIZE / 3}
                radius={BULLET_SIZE / 2.5}
                fill="rgba(255, 255, 255, 0.9)"
            />
        </Group>
    );
}

JuggernautBullet.propTypes = {
    bullet: PropTypes.shape({
        x: PropTypes.number.isRequired,
        y: PropTypes.number.isRequired,
        direction: PropTypes.number.isRequired
    }).isRequired
};

export default JuggernautBullet;
