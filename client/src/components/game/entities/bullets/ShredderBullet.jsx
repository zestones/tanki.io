import PropTypes from 'prop-types';
import { Circle, Group, Line, RegularPolygon, Star } from 'react-konva';

const BULLET_SIZE = 5;

function ShredderBullet({ bullet }) {
    return (
        <Group>
            {/* Originium-infused exhaust trail */}
            <Line
                points={[
                    bullet.x - Math.cos((bullet.direction * Math.PI) / 180) * BULLET_SIZE * 8,
                    bullet.y + Math.sin((bullet.direction * Math.PI) / 180) * BULLET_SIZE * 8,
                    bullet.x - Math.cos((bullet.direction * Math.PI) / 180) * BULLET_SIZE * 5,
                    bullet.y + Math.sin((bullet.direction * Math.PI) / 180) * BULLET_SIZE * 5,
                    bullet.x - Math.cos((bullet.direction * Math.PI) / 180) * BULLET_SIZE * 2.5,
                    bullet.y + Math.sin((bullet.direction * Math.PI) / 180) * BULLET_SIZE * 2.5,
                    bullet.x,
                    bullet.y
                ]}
                stroke="rgba(231, 76, 60, 0.7)"
                strokeWidth={BULLET_SIZE * 0.8}
                lineCap="round"
                tension={0.3}
            />

            {/* Area damage indicator - ripple effect */}
            <Circle
                x={bullet.x}
                y={bullet.y}
                radius={BULLET_SIZE * 3}
                fill="rgba(231, 76, 60, 0.1)"
                stroke="rgba(231, 76, 60, 0.3)"
                strokeWidth={0.5}
            />

            {/* Originium crystal core */}
            <RegularPolygon
                x={bullet.x}
                y={bullet.y}
                sides={5}
                radius={BULLET_SIZE}
                fill="#e74c3c"
                rotation={bullet.direction * 0.8}
                stroke="rgba(255, 255, 255, 0.5)"
                strokeWidth={0.5}
            />

            {/* Inner energy core */}
            <Circle
                x={bullet.x}
                y={bullet.y}
                radius={BULLET_SIZE * 0.6}
                fill="#f5b7b1"
            />

            {/* Energy burst particles - showing rapid-fire capability */}
            <Star
                x={bullet.x + Math.cos((bullet.direction * Math.PI) / 180 + Math.PI / 2) * BULLET_SIZE * 1.2}
                y={bullet.y - Math.sin((bullet.direction * Math.PI) / 180 + Math.PI / 2) * BULLET_SIZE * 1.2}
                numPoints={4}
                innerRadius={BULLET_SIZE * 0.3}
                outerRadius={BULLET_SIZE * 0.6}
                fill="#e74c3c"
                rotation={bullet.direction}
            />
            <Star
                x={bullet.x + Math.cos((bullet.direction * Math.PI) / 180 - Math.PI / 2) * BULLET_SIZE * 1.2}
                y={bullet.y - Math.sin((bullet.direction * Math.PI) / 180 - Math.PI / 2) * BULLET_SIZE * 1.2}
                numPoints={4}
                innerRadius={BULLET_SIZE * 0.3}
                outerRadius={BULLET_SIZE * 0.6}
                fill="#e74c3c"
                rotation={bullet.direction * 1.5}
            />

            {/* Energy field - representing area damage */}
            <RegularPolygon
                x={bullet.x}
                y={bullet.y}
                sides={8}
                radius={BULLET_SIZE * 1.8}
                stroke="rgba(231, 76, 60, 0.8)"
                strokeWidth={0.7}
                fill="rgba(231, 76, 60, 0)"
                rotation={bullet.direction * 0.3}
            />

            {/* Damage propagation lines */}
            <Line
                points={[
                    bullet.x,
                    bullet.y,
                    bullet.x + Math.cos((bullet.direction * Math.PI) / 180 + Math.PI / 3) * BULLET_SIZE * 2,
                    bullet.y - Math.sin((bullet.direction * Math.PI) / 180 + Math.PI / 3) * BULLET_SIZE * 2
                ]}
                stroke="rgba(231, 76, 60, 0.8)"
                strokeWidth={0.5}
            />
            <Line
                points={[
                    bullet.x,
                    bullet.y,
                    bullet.x + Math.cos((bullet.direction * Math.PI) / 180 - Math.PI / 3) * BULLET_SIZE * 2,
                    bullet.y - Math.sin((bullet.direction * Math.PI) / 180 - Math.PI / 3) * BULLET_SIZE * 2
                ]}
                stroke="rgba(231, 76, 60, 0.8)"
                strokeWidth={0.5}
            />

            {/* Light refraction */}
            <Circle
                x={bullet.x - BULLET_SIZE / 4}
                y={bullet.y - BULLET_SIZE / 4}
                radius={BULLET_SIZE / 5}
                fill="rgba(255, 255, 255, 0.9)"
            />
        </Group>
    );
}

ShredderBullet.propTypes = {
    bullet: PropTypes.shape({
        x: PropTypes.number.isRequired,
        y: PropTypes.number.isRequired,
        direction: PropTypes.number.isRequired
    }).isRequired
};

export default ShredderBullet;
