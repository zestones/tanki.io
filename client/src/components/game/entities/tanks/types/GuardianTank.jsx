import { Group, RegularPolygon, Circle, Line, Text, Rect } from 'react-konva';
import { shadeColor } from '../../../../../utils/colorUtils';
import PropTypes from 'prop-types';
import HealthBar from '../shared/HealthBar';

const TANK_SIZE = 38;

function GuardianTank({ x, y, rotation, hp, username, isDead, color = "#3498db" }) {
    if (isDead) return null;

    const barrelLength = TANK_SIZE * 0.8;
    const barrelWidth = 6;
    const offset = 5;

    // Health-based color
    let fillColor = "#4CAF50";
    if (hp <= 66 && hp > 33) fillColor = "#FFC107";
    if (hp <= 33) fillColor = "#F44336";

    // Barrel positioning calculations
    const theta = (rotation * Math.PI) / 180;
    const dx = Math.cos(theta);
    const dy = -Math.sin(theta);
    const perpDx = -Math.sin(theta);
    const perpDy = -Math.cos(theta);

    const leftStartX = x + offset * perpDx;
    const leftStartY = y + offset * perpDy;
    const rightStartX = x - offset * perpDx;
    const rightStartY = y - offset * perpDy;

    const leftEndX = leftStartX + dx * barrelLength;
    const leftEndY = leftStartY + dy * barrelLength;
    const rightEndX = rightStartX + dx * barrelLength;
    const rightEndY = rightStartY + dy * barrelLength;

    return (
        <Group>
            {/* Shadow */}
            <RegularPolygon
                x={x + 5}
                y={y + 5}
                sides={6}
                radius={TANK_SIZE / 2}
                rotation={0}
                fill="rgba(0,0,0,0.5)"
                opacity={0.6}
            />

            {/* Treads */}
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

            {/* Body */}
            <RegularPolygon
                x={x}
                y={y}
                sides={6}
                radius={TANK_SIZE / 2}
                rotation={0}
                fillRadialGradientStartPoint={{ x: -TANK_SIZE / 4, y: -TANK_SIZE / 4 }}
                fillRadialGradientStartRadius={1}
                fillRadialGradientEndPoint={{ x: 0, y: 0 }}
                fillRadialGradientEndRadius={TANK_SIZE}
                fillRadialGradientColorStops={[0, shadeColor(fillColor, 30), 1, shadeColor(fillColor, -30)]}
                stroke="#333"
                strokeWidth={3}
            />

            {/* Reinforcement Plating */}
            <RegularPolygon
                x={x}
                y={y}
                sides={6}
                radius={TANK_SIZE / 2 - 5}
                fill={shadeColor(fillColor, -40)}
                stroke="#222"
                strokeWidth={1}
            />

            {/* Turret Base */}
            <Circle
                x={x}
                y={y}
                radius={TANK_SIZE / 3}
                fill="#444"
                stroke="#333"
                strokeWidth={2}
            />

            {/* Turret Center */}
            <Circle
                x={x}
                y={y}
                radius={TANK_SIZE / 5}
                fill="#555"
                stroke="#333"
                strokeWidth={1}
            />

            {/* Barrel Shadows */}
            <Line
                points={[leftStartX + 3, leftStartY + 3, leftEndX + 3, leftEndY + 3]}
                stroke="rgba(0,0,0,0.6)"
                strokeWidth={barrelWidth + 2}
                lineCap="round"
                opacity={0.5}
            />
            <Line
                points={[rightStartX + 3, rightStartY + 3, rightEndX + 3, rightEndY + 3]}
                stroke="rgba(0,0,0,0.6)"
                strokeWidth={barrelWidth + 2}
                lineCap="round"
                opacity={0.5}
            />

            {/* Barrels */}
            <Line
                points={[leftStartX, leftStartY, leftEndX, leftEndY]}
                stroke="#333"
                strokeWidth={barrelWidth}
                lineCap="round"
            />
            <Line
                points={[rightStartX, rightStartY, rightEndX, rightEndY]}
                stroke="#333"
                strokeWidth={barrelWidth}
                lineCap="round"
            />

            {/* Username */}
            <Text
                x={x - 50}
                y={y + TANK_SIZE + 5}
                text={username}
                fontSize={14}
                fontStyle="bold"
                fill={color}
                align="center"
                width={100}
                shadowColor="black"
                shadowBlur={4}
                shadowOffset={{ x: 0, y: 0 }}
                shadowOpacity={1}
            />

            {/* Health Bar */}
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

GuardianTank.propTypes = {
    x: PropTypes.number.isRequired,
    y: PropTypes.number.isRequired,
    rotation: PropTypes.number.isRequired,
    hp: PropTypes.number.isRequired,
    username: PropTypes.string.isRequired,
    isDead: PropTypes.bool.isRequired,
    color: PropTypes.string
};

export default GuardianTank;