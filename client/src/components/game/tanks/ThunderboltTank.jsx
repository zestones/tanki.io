import { Group, RegularPolygon, Circle, Line, Text, Rect } from 'react-konva';
import { shadeColor } from '../../../utils/colorUtils'; // Utility to adjust color brightness
import PropTypes from 'prop-types';
import HealthBar from './shared/HealthBar'; // Reusable HealthBar component

// Define tank size constant
const TANK_SIZE = 30;

function ThunderboltTank({ x, y, rotation, hp, username, isDead }) {
    // If the tank is dead, render nothing
    if (isDead) return null;

    // Define constants for tank features
    const barrelLength = TANK_SIZE; // Length of the barrel
    const barrelWidth = 5; // Width of the barrel
    const ringPositions = [0.25, 0.5, 0.75]; // Positions for barrel rings
    const ringLength = 6; // Length of each ring
    const decalOffset = 10; // Offset for lightning decals from center
    const themeColor = '#00BFFF'; // Electric blue theme color

    // Set body color based on HP
    let fillColor = "#4CAF50"; // Green for full health (hp = 3)
    if (hp === 2) fillColor = "#FFC107"; // Yellow for medium health
    if (hp === 1) fillColor = "#F44336"; // Red for low health

    // Calculate rotation in radians and direction vectors
    const theta = (rotation * Math.PI) / 180;
    const dx = Math.cos(theta); // X-direction for barrel
    const dy = -Math.sin(theta); // Y-direction for barrel
    const perpDx = -Math.sin(theta); // Perpendicular X for rings
    const perpDy = -Math.cos(theta); // Perpendicular Y for rings

    // Barrel start and end points
    const barrelStartX = x;
    const barrelStartY = y;
    const barrelEndX = x + dx * barrelLength;
    const barrelEndY = y + dy * barrelLength;

    // Define lightning bolt decal points (relative coordinates)
    const relativePoints = [-1, -4, 1, -2, -1, 0, 1, 2, -1, 4];
    // Right decal absolute points
    const rightDecalPoints = relativePoints.map((val, index) =>
        index % 2 === 0 ? x + decalOffset + val : y + val
    );
    // Left decal relative points (mirrored horizontally)
    const leftRelativePoints = relativePoints.map((val, index) =>
        index % 2 === 0 ? -val : val
    );
    // Left decal absolute points
    const leftDecalPoints = leftRelativePoints.map((val, index) =>
        index % 2 === 0 ? x - decalOffset + val : y + val
    );

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
                fillRadialGradientColorStops={[
                    0, shadeColor(fillColor, 40), // Lighter at center
                    1, shadeColor(fillColor, -20) // Darker at edges
                ]}
                stroke="#000"
                strokeWidth={2}
            />

            {/* Lightning bolt decals */}
            <Line points={rightDecalPoints} stroke={themeColor} strokeWidth={2} />
            <Line points={leftDecalPoints} stroke={themeColor} strokeWidth={2} />

            {/* Barrel shadow */}
            <Line
                points={[barrelStartX + 2, barrelStartY + 2, barrelEndX + 2, barrelEndY + 2]}
                stroke="rgba(0,0,0,0.5)"
                strokeWidth={barrelWidth + 2}
                lineCap="round"
                opacity={0.5}
            />

            {/* Barrel */}
            <Line
                points={[barrelStartX, barrelStartY, barrelEndX, barrelEndY]}
                stroke="#333"
                strokeWidth={barrelWidth}
                lineCap="round"
            />

            {/* Barrel rings */}
            {ringPositions.map((p) => {
                const ringCenterX = barrelStartX + p * (barrelEndX - barrelStartX);
                const ringCenterY = barrelStartY + p * (barrelEndY - barrelStartY);
                return (
                    <Line
                        key={p}
                        points={[
                            ringCenterX - (ringLength / 2) * perpDx,
                            ringCenterY - (ringLength / 2) * perpDy,
                            ringCenterX + (ringLength / 2) * perpDx,
                            ringCenterY + (ringLength / 2) * perpDy
                        ]}
                        stroke={themeColor}
                        strokeWidth={2}
                        lineCap="round"
                    />
                );
            })}

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
                fill={themeColor}
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

// Define prop types for type checking
ThunderboltTank.propTypes = {
    x: PropTypes.number.isRequired,
    y: PropTypes.number.isRequired,
    rotation: PropTypes.number.isRequired,
    hp: PropTypes.number.isRequired,
    username: PropTypes.string.isRequired,
    isDead: PropTypes.bool.isRequired
};

export default ThunderboltTank;