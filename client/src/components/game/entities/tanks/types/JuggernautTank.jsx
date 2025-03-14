import { Group, Circle, Line, Text, Rect, RegularPolygon } from 'react-konva';
import { shadeColor } from '../../../../../utils/colorUtils';
import HealthBar from '../shared/HealthBar';
import PropTypes from 'prop-types';

const TANK_SIZE = 38; // Slightly larger than standard tank

export default function JuggernautTank({ x, y, rotation, hp, username, isDead }) {
    if (isDead) return null;

    const barrelLength = TANK_SIZE * 1.2;
    const barrelWidth = 8;

    let fillColor = "#4CAF50";
    if (hp === 2) fillColor = "#FFC107";
    if (hp === 1) fillColor = "#F44336";

    return (
        <Group>
            {/* Tank shadow */}
            <Circle
                x={x + 5}
                y={y + 5}
                radius={TANK_SIZE / 2 + 3}
                fill="rgba(0,0,0,0.5)"
                opacity={0.6}
            />

            {/* Treads - left */}
            <Rect
                x={x - TANK_SIZE / 2 - 5}
                y={y - TANK_SIZE / 3}
                width={TANK_SIZE + 10}
                height={TANK_SIZE / 4}
                fill="#333"
                cornerRadius={3}
                stroke="#222"
                strokeWidth={1}
            />

            {/* Treads - right */}
            <Rect
                x={x - TANK_SIZE / 2 - 5}
                y={y + TANK_SIZE / 12}
                width={TANK_SIZE + 10}
                height={TANK_SIZE / 4}
                fill="#333"
                cornerRadius={3}
                stroke="#222"
                strokeWidth={1}
            />

            {/* Tank body - main armor */}
            <RegularPolygon
                x={x}
                y={y}
                sides={8}
                radius={TANK_SIZE / 2}
                fillRadialGradientStartPoint={{ x: -TANK_SIZE / 4, y: -TANK_SIZE / 4 }}
                fillRadialGradientStartRadius={1}
                fillRadialGradientEndPoint={{ x: 0, y: 0 }}
                fillRadialGradientEndRadius={TANK_SIZE}
                fillRadialGradientColorStops={[
                    0, shadeColor(fillColor, 30),
                    1, shadeColor(fillColor, -30)
                ]}
                stroke="#333"
                strokeWidth={3}
                rotation={45}
            />

            {/* Reinforcement plating */}
            <RegularPolygon
                x={x}
                y={y}
                sides={8}
                radius={TANK_SIZE / 2 - 8}
                fill={shadeColor(fillColor, -40)}
                stroke="#222"
                strokeWidth={1}
                rotation={45}
            />

            {/* Barrel shadow */}
            <Line
                points={[
                    x + 3,
                    y + 3,
                    x + 3 + Math.cos((rotation * Math.PI) / 180) * barrelLength,
                    y + 3 - Math.sin((rotation * Math.PI) / 180) * barrelLength
                ]}
                stroke="rgba(0,0,0,0.6)"
                strokeWidth={barrelWidth + 2}
                lineCap="round"
                opacity={0.5}
            />

            {/* Main barrel */}
            <Line
                points={[
                    x,
                    y,
                    x + Math.cos((rotation * Math.PI) / 180) * barrelLength,
                    y - Math.sin((rotation * Math.PI) / 180) * barrelLength
                ]}
                stroke="#333"
                strokeWidth={barrelWidth}
                lineCap="round"
            />

            {/* Barrel reinforcement */}
            <Line
                points={[
                    x,
                    y,
                    x + Math.cos((rotation * Math.PI) / 180) * (barrelLength / 3),
                    y - Math.sin((rotation * Math.PI) / 180) * (barrelLength / 3)
                ]}
                stroke="#222"
                strokeWidth={barrelWidth + 4}
                lineCap="round"
            />

            {/* Turret base */}
            <Circle
                x={x}
                y={y}
                radius={TANK_SIZE / 3}
                fill={shadeColor(fillColor, -20)}
                stroke="#333"
                strokeWidth={2}
            />

            {/* Turret center */}
            <Circle
                x={x}
                y={y}
                radius={TANK_SIZE / 5}
                fill="#444"
                stroke="#222"
                strokeWidth={1}
            />

            {/* Username with special styling */}
            <Text
                x={x - 60}
                y={y + TANK_SIZE + 5}
                text={username}
                fontSize={16}
                fontStyle="bold"
                fill="#FFD700" // Gold color for Juggernaut
                align="center"
                width={120}
                shadowColor="black"
                shadowBlur={5}
                shadowOffset={{ x: 0, y: 0 }}
                shadowOpacity={1}
            />

            <HealthBar
                hp={hp}
                x={x}
                y={y}
                size={TANK_SIZE}
                color={fillColor}
            />

        </Group>
    );
}

JuggernautTank.propTypes = {
    x: PropTypes.number.isRequired,
    y: PropTypes.number.isRequired,
    rotation: PropTypes.number.isRequired,
    hp: PropTypes.number.isRequired,
    username: PropTypes.string.isRequired,
    isDead: PropTypes.bool.isRequired
};