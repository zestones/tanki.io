import PropTypes from 'prop-types';
import { Circle, Group, Line, Text } from 'react-konva';
import { shadeColor } from '../../../../../utils/colorUtils';
import HealthBar from '../shared/HealthBar';

const TANK_SIZE = 30;

function SentinelTank({ x, y, rotation, hp, username, isDead, color = "#2ecc71" }) {
    if (isDead) return null;

    const barrelLength = TANK_SIZE;

    let fillColor = "#4CAF50";
    if (hp <= 66 && hp > 33) fillColor = "#FFC107";
    if (hp <= 33) fillColor = "#F44336";

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

            {/* Barrel shadow */}
            <Line
                points={[
                    x + 2,
                    y + 2,
                    x + 2 + Math.cos((rotation * Math.PI) / 180) * barrelLength,
                    y + 2 - Math.sin((rotation * Math.PI) / 180) * barrelLength
                ]}
                stroke="rgba(0,0,0,0.5)"
                strokeWidth={6}
                lineCap="round"
                opacity={0.5}
            />

            {/* Barrel */}
            <Line
                points={[
                    x,
                    y,
                    x + Math.cos((rotation * Math.PI) / 180) * barrelLength,
                    y - Math.sin((rotation * Math.PI) / 180) * barrelLength
                ]}
                stroke="#333"
                strokeWidth={5}
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

SentinelTank.propTypes = {
    x: PropTypes.number.isRequired,
    y: PropTypes.number.isRequired,
    rotation: PropTypes.number.isRequired,
    hp: PropTypes.number.isRequired,
    username: PropTypes.string.isRequired,
    isDead: PropTypes.bool.isRequired,
    color: PropTypes.string
};

export default SentinelTank;