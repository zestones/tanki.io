import PropTypes from 'prop-types';
import { Circle, Group, Line, RegularPolygon, Star } from 'react-konva';

const BULLET_SIZE = 5;

function ThunderboltBullet({ bullet }) {
    return (
        <Group>
            {/* EMP field effect */}
            <Circle
                x={bullet.x}
                y={bullet.y}
                radius={BULLET_SIZE * 4}
                fill="rgba(155, 89, 182, 0.08)"
                stroke="rgba(155, 89, 182, 0.2)"
                strokeWidth={0.5}
            />

            {/* Originium discharge patterns */}
            <RegularPolygon
                x={bullet.x}
                y={bullet.y}
                sides={8}
                radius={BULLET_SIZE * 2.8}
                fill="rgba(155, 89, 182, 0)"
                stroke="rgba(155, 89, 182, 0.4)"
                strokeWidth={0.6}
                rotation={bullet.direction * 0.5}
            />

            {/* Lightning trail with */}
            <Line
                points={[
                    bullet.x - Math.cos((bullet.direction * Math.PI) / 180) * BULLET_SIZE * 9,
                    bullet.y + Math.sin((bullet.direction * Math.PI) / 180) * BULLET_SIZE * 9,
                    bullet.x - Math.cos((bullet.direction * Math.PI) / 180) * BULLET_SIZE * 7 + BULLET_SIZE * 1.5,
                    bullet.y + Math.sin((bullet.direction * Math.PI) / 180) * BULLET_SIZE * 7 + BULLET_SIZE * 1.5,
                    bullet.x - Math.cos((bullet.direction * Math.PI) / 180) * BULLET_SIZE * 5 - BULLET_SIZE * 1.5,
                    bullet.y + Math.sin((bullet.direction * Math.PI) / 180) * BULLET_SIZE * 5 - BULLET_SIZE * 1.5,
                    bullet.x - Math.cos((bullet.direction * Math.PI) / 180) * BULLET_SIZE * 3 + BULLET_SIZE * 0.8,
                    bullet.y + Math.sin((bullet.direction * Math.PI) / 180) * BULLET_SIZE * 3 + BULLET_SIZE * 0.8,
                    bullet.x - Math.cos((bullet.direction * Math.PI) / 180) * BULLET_SIZE * 1.5 - BULLET_SIZE * 0.5,
                    bullet.y + Math.sin((bullet.direction * Math.PI) / 180) * BULLET_SIZE * 1.5 - BULLET_SIZE * 0.5,
                    bullet.x,
                    bullet.y
                ]}
                stroke="rgba(155, 89, 182, 0.8)"
                strokeWidth={BULLET_SIZE * 0.7}
                lineCap="round"
                tension={0}
            />

            {/* Secondary electric arcs */}
            <Line
                points={[
                    bullet.x - Math.cos((bullet.direction * Math.PI) / 180 + 0.2) * BULLET_SIZE * 6,
                    bullet.y + Math.sin((bullet.direction * Math.PI) / 180 + 0.2) * BULLET_SIZE * 6,
                    bullet.x - Math.cos((bullet.direction * Math.PI) / 180) * BULLET_SIZE * 4,
                    bullet.y + Math.sin((bullet.direction * Math.PI) / 180) * BULLET_SIZE * 4,
                ]}
                stroke="rgba(187, 143, 206, 0.7)"
                strokeWidth={BULLET_SIZE * 0.4}
                lineCap="round"
            />

            {/* Primary electric core - Originium-infused EMP module */}
            <Star
                x={bullet.x}
                y={bullet.y}
                numPoints={5}
                innerRadius={BULLET_SIZE * 0.7}
                outerRadius={BULLET_SIZE * 1.3}
                fill="#9b59b6"
                rotation={bullet.direction * 2}
                stroke="rgba(255, 255, 255, 0.5)"
                strokeWidth={0.5}
            />

            {/* Inner energy core with Arts concentration */}
            <Circle
                x={bullet.x}
                y={bullet.y}
                radius={BULLET_SIZE * 0.7}
                fill="#d2b4de"
            />

            {/* Electromagnetic pulse rings */}
            <Circle
                x={bullet.x}
                y={bullet.y}
                radius={BULLET_SIZE * 1.8}
                stroke="rgba(155, 89, 182, 0.8)"
                strokeWidth={0.7}
                fill="rgba(155, 89, 182, 0.1)"
            />
            <Circle
                x={bullet.x}
                y={bullet.y}
                radius={BULLET_SIZE * 2.5}
                stroke="rgba(155, 89, 182, 0.4)"
                strokeWidth={0.5}
                fill="rgba(155, 89, 182, 0)"
            />

            {/* Electric discharge tendrils */}
            {[0, 60, 120, 180, 240, 300].map((angle, i) => (
                <Line
                    key={"tendril" + i}
                    points={[
                        bullet.x,
                        bullet.y,
                        bullet.x + Math.cos(((bullet.direction + angle) * Math.PI) / 180) * BULLET_SIZE * (i % 2 === 0 ? 2 : 1.5),
                        bullet.y - Math.sin(((bullet.direction + angle) * Math.PI) / 180) * BULLET_SIZE * (i % 2 === 0 ? 2 : 1.5),
                    ]}
                    stroke="rgba(155, 89, 182, 0.9)"
                    strokeWidth={BULLET_SIZE * 0.3}
                    lineCap="round"
                />
            ))}

            {/* Energy junction points */}
            <Circle
                x={bullet.x - Math.cos((bullet.direction * Math.PI) / 180) * BULLET_SIZE * 3}
                y={bullet.y + Math.sin((bullet.direction * Math.PI) / 180) * BULLET_SIZE * 3}
                radius={BULLET_SIZE * 0.3}
                fill="rgba(155, 89, 182, 0.9)"
            />
            <Circle
                x={bullet.x - Math.cos((bullet.direction * Math.PI) / 180) * BULLET_SIZE * 6}
                y={bullet.y + Math.sin((bullet.direction * Math.PI) / 180) * BULLET_SIZE * 6}
                radius={BULLET_SIZE * 0.4}
                fill="rgba(155, 89, 182, 0.9)"
            />

            {/* Light refraction */}
            <Circle
                x={bullet.x - BULLET_SIZE / 4}
                y={bullet.y - BULLET_SIZE / 4}
                radius={BULLET_SIZE / 4}
                fill="rgba(255, 255, 255, 0.9)"
            />
        </Group>
    );
}

ThunderboltBullet.propTypes = {
    bullet: PropTypes.shape({
        x: PropTypes.number.isRequired,
        y: PropTypes.number.isRequired,
        direction: PropTypes.number.isRequired
    }).isRequired
};

export default ThunderboltBullet;
