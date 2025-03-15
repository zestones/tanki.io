import { Group, Circle, Line, Text, Rect } from 'react-konva';
import { shadeColor } from '../../../../../utils/colorUtils';
import PropTypes from 'prop-types';
import HealthBar from '../shared/HealthBar';

const TANK_SIZE = 30;

function ShredderTank({ x, y, rotation, hp, username, isDead, color = "#e74c3c" }) {
    // If the tank is dead, render nothing
    if (isDead) return null;

    // Define barrel lengths and widths
    const centralBarrelLength = TANK_SIZE * 0.8; // 24 units
    const sideBarrelLength = TANK_SIZE * 0.6;    // 18 units
    const barrelWidth = 4;
    const offset = 4; // Distance between barrels

    // Calculate rotation in radians and direction vectors
    const theta = (rotation * Math.PI) / 180;
    const dx = Math.cos(theta);
    const dy = -Math.sin(theta);
    const perpDx = -Math.sin(theta); // Perpendicular direction for side barrels
    const perpDy = -Math.cos(theta);

    // Central barrel coordinates
    const centralStartX = x;
    const centralStartY = y;
    const centralEndX = x + dx * centralBarrelLength;
    const centralEndY = y + dy * centralBarrelLength;

    // Left barrel coordinates
    const leftStartX = x + offset * perpDx;
    const leftStartY = y + offset * perpDy;
    const leftEndX = leftStartX + dx * sideBarrelLength;
    const leftEndY = leftStartY + dy * sideBarrelLength;

    // Right barrel coordinates
    const rightStartX = x - offset * perpDx;
    const rightStartY = y - offset * perpDy;
    const rightEndX = rightStartX + dx * sideBarrelLength;
    const rightEndY = rightStartY + dy * sideBarrelLength;

    // Determine fill color based on health points
    let fillColor = "#4CAF50"; // Green for full health (3 HP)
    if (hp === 2) fillColor = "#FFC107"; // Yellow for 2 HP
    if (hp === 1) fillColor = "#F44336"; // Red for 1 HP

    return (
        <Group>
            {/* Tank shadow */}
            <Circle
                x={x + 4}
                y={y + 4}
                radius={TANK_SIZE / 2 + 2}
                fill="rgba(0,0,0,0.4)"
                opacity={0.5}
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

            {/* Tank body */}
            <Circle
                x={x}
                y={y}
                radius={TANK_SIZE / 2}
                fillRadialGradientStartPoint={{ x: -TANK_SIZE / 4, y: -TANK_SIZE / 4 }}
                fillRadialGradientStartRadius={1}
                fillRadialGradientEndPoint={{ x: 0, y: 0 }}
                fillRadialGradientEndRadius={TANK_SIZE}
                fillRadialGradientColorStops={[
                    0, shadeColor(fillColor, 40),
                    1, shadeColor(fillColor, -20)
                ]}
                stroke="#000"
                strokeWidth={2}
            />

            {/* Barrel shadows */}
            <Line
                points={[centralStartX + 2, centralStartY + 2, centralEndX + 2, centralEndY + 2]}
                stroke="rgba(0,0,0,0.5)"
                strokeWidth={barrelWidth + 2}
                lineCap="round"
                opacity={0.5}
            />
            <Line
                points={[leftStartX + 2, leftStartY + 2, leftEndX + 2, leftEndY + 2]}
                stroke="rgba(0,0,0,0.5)"
                strokeWidth={barrelWidth + 2}
                lineCap="round"
                opacity={0.5}
            />
            <Line
                points={[rightStartX + 2, rightStartY + 2, rightEndX + 2, rightEndY + 2]}
                stroke="rgba(0,0,0,0.5)"
                strokeWidth={barrelWidth + 2}
                lineCap="round"
                opacity={0.5}
            />

            {/* Barrels */}
            <Line
                points={[centralStartX, centralStartY, centralEndX, centralEndY]}
                stroke="#333"
                strokeWidth={barrelWidth}
                lineCap="round"
            />
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

            {/* Turret center */}
            <Circle
                x={x}
                y={y}
                radius={TANK_SIZE / 4}
                fill="#333"
                stroke="#000"
                strokeWidth={1}
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

            {/* Health bar */}
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

ShredderTank.propTypes = {
    x: PropTypes.number.isRequired,
    y: PropTypes.number.isRequired,
    rotation: PropTypes.number.isRequired,
    hp: PropTypes.number.isRequired,
    username: PropTypes.string.isRequired,
    isDead: PropTypes.bool.isRequired,
    color: PropTypes.string
};

export default ShredderTank;