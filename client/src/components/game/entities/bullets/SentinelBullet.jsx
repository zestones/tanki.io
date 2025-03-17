import PropTypes from 'prop-types';
import { Circle, Group, Line, RegularPolygon } from 'react-konva';

const BULLET_SIZE = 5;

function SentinelBullet({ bullet }) {
    return (
        <Group>
            {/* Adaptive field projection - representing versatility */}
            <RegularPolygon
                x={bullet.x}
                y={bullet.y}
                sides={8}
                radius={BULLET_SIZE * 3}
                fill="rgba(46, 204, 113, 0.08)"
                stroke="rgba(46, 204, 113, 0.25)"
                strokeWidth={0.5}
                rotation={bullet.direction * 0.3}
            />

            {/* Secondary field - rotating in opposite direction for adaptive effect */}
            <RegularPolygon
                x={bullet.x}
                y={bullet.y}
                sides={8}
                radius={BULLET_SIZE * 1.8}
                fill="rgba(46, 204, 113, 0.15)"
                stroke="rgba(46, 204, 113, 0.5)"
                strokeWidth={0.8}
                rotation={-bullet.direction * 0.2}
            />

            {/* Originium energy conduits - multi-stage trail showing adaptability */}
            <Line
                points={[
                    bullet.x - Math.cos((bullet.direction * Math.PI) / 180) * BULLET_SIZE * 8,
                    bullet.y + Math.sin((bullet.direction * Math.PI) / 180) * BULLET_SIZE * 8,
                    bullet.x - Math.cos((bullet.direction * Math.PI) / 180) * BULLET_SIZE * 6,
                    bullet.y + Math.sin((bullet.direction * Math.PI) / 180) * BULLET_SIZE * 6,
                    bullet.x - Math.cos((bullet.direction * Math.PI) / 180) * BULLET_SIZE * 3,
                    bullet.y + Math.sin((bullet.direction * Math.PI) / 180) * BULLET_SIZE * 3,
                    bullet.x,
                    bullet.y
                ]}
                stroke="rgba(46, 204, 113, 0.6)"
                strokeWidth={BULLET_SIZE * 0.9}
                lineCap="round"
                tension={0.3}
            />

            <Circle
                x={bullet.x - Math.cos((bullet.direction * Math.PI) / 180) * BULLET_SIZE * 6}
                y={bullet.y + Math.sin((bullet.direction * Math.PI) / 180) * BULLET_SIZE * 6}
                radius={BULLET_SIZE * 0.4}
                fill="rgba(46, 204, 113, 0.8)"
            />
            <Circle
                x={bullet.x - Math.cos((bullet.direction * Math.PI) / 180) * BULLET_SIZE * 3}
                y={bullet.y + Math.sin((bullet.direction * Math.PI) / 180) * BULLET_SIZE * 3}
                radius={BULLET_SIZE * 0.3}
                fill="rgba(46, 204, 113, 0.8)"
            />

            {/* Primary crystalline core structure - geometric and faceted like Originium */}
            <RegularPolygon
                x={bullet.x}
                y={bullet.y}
                sides={4}
                radius={BULLET_SIZE * 1.2}
                fill="#2ecc71"
                stroke="rgba(255, 255, 255, 0.6)"
                strokeWidth={0.5}
                rotation={bullet.direction * 0.5}
            />

            {/* Secondary core overlay - rotating independently for adaptive look */}
            <RegularPolygon
                x={bullet.x}
                y={bullet.y}
                sides={4}
                radius={BULLET_SIZE * 0.9}
                fill="#27ae60"
                rotation={-bullet.direction * 0.3}
            />

            {/* Central balanced energy core */}
            <Circle
                x={bullet.x}
                y={bullet.y}
                radius={BULLET_SIZE * 0.6}
                fill="#82e0aa"
            />

            {/* Energy rings showing balanced distribution */}
            <Circle
                x={bullet.x}
                y={bullet.y}
                radius={BULLET_SIZE * 2.2}
                stroke="rgba(46, 204, 113, 0.5)"
                strokeWidth={0.6}
                fill="rgba(46, 204, 113, 0)"
            />
            <Circle
                x={bullet.x}
                y={bullet.y}
                radius={BULLET_SIZE * 1.5}
                stroke="rgba(46, 204, 113, 0.7)"
                strokeWidth={0.8}
                fill="rgba(46, 204, 113, 0.1)"
            />

            {/* Stabilization fins - balanced design element */}
            {[0, 90, 180, 270].map((angle, i) => (
                <Line
                    key={'fin' + i}
                    points={[
                        bullet.x,
                        bullet.y,
                        bullet.x + Math.cos(((bullet.direction + angle) * Math.PI) / 180) * BULLET_SIZE * 1.4,
                        bullet.y - Math.sin(((bullet.direction + angle) * Math.PI) / 180) * BULLET_SIZE * 1.4,
                    ]}
                    stroke="rgba(46, 204, 113, 0.8)"
                    strokeWidth={BULLET_SIZE * 0.25}
                    lineCap="round"
                />
            ))}

            {/* Light refraction effect */}
            <Circle
                x={bullet.x - BULLET_SIZE / 4}
                y={bullet.y - BULLET_SIZE / 4}
                radius={BULLET_SIZE / 3}
                fill="rgba(255, 255, 255, 0.9)"
            />
        </Group>
    );
}

SentinelBullet.propTypes = {
    bullet: PropTypes.shape({
        x: PropTypes.number.isRequired,
        y: PropTypes.number.isRequired,
        direction: PropTypes.number.isRequired
    }).isRequired
};

export default SentinelBullet;
