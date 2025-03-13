import { Group, Circle, Line, Text, Rect } from 'react-konva';
import { shadeColor } from '../../utils/colorUtils';

const TANK_SIZE = 30;

export default function Tank({ player, sessionId }) {
    if (player.isDead) return null;

    const rotation = player.direction;
    const barrelLength = TANK_SIZE;

    let fillColor = "#4CAF50";
    if (player.hp === 2) fillColor = "#FFC107";
    if (player.hp === 1) fillColor = "#F44336";

    return (
        <Group>
            {/* Tank shadow */}
            <Circle
                x={player.x + 4}
                y={player.y + 4}
                radius={TANK_SIZE / 2 + 2}
                fill="rgba(0,0,0,0.4)"
                opacity={0.5}
            />

            {/* Tank body */}
            <Circle
                x={player.x}
                y={player.y}
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
                    player.x + 2,
                    player.y + 2,
                    player.x + 2 + Math.cos((rotation * Math.PI) / 180) * barrelLength,
                    player.y + 2 - Math.sin((rotation * Math.PI) / 180) * barrelLength
                ]}
                stroke="rgba(0,0,0,0.5)"
                strokeWidth={6}
                lineCap="round"
                opacity={0.5}
            />

            {/* Barrel */}
            <Line
                points={[
                    player.x,
                    player.y,
                    player.x + Math.cos((rotation * Math.PI) / 180) * barrelLength,
                    player.y - Math.sin((rotation * Math.PI) / 180) * barrelLength
                ]}
                stroke="#333"
                strokeWidth={5}
                lineCap="round"
            />

            {/* Turret center */}
            <Circle
                x={player.x}
                y={player.y}
                radius={TANK_SIZE / 4}
                fill="#333"
                stroke="#000"
                strokeWidth={1}
            />

            {/* Username */}
            <Text
                x={player.x - 50}
                y={player.y + TANK_SIZE + 5}
                text={player.username}
                fontSize={14}
                fontStyle="bold"
                fill="#FFF"
                align="center"
                width={100}
                shadowColor="black"
                shadowBlur={4}
                shadowOffset={{ x: 0, y: 0 }}
                shadowOpacity={1}
            />

            {/* Health bar background */}
            <Rect
                x={player.x - 25}
                y={player.y - TANK_SIZE - 15}
                width={50}
                height={8}
                fill="rgba(0,0,0,0.6)"
                cornerRadius={4}
                shadowColor="black"
                shadowBlur={2}
                shadowOffset={{ x: 0, y: 1 }}
                shadowOpacity={0.5}
            />

            {/* Health bar foreground */}
            <Rect
                x={player.x - 23}
                y={player.y - TANK_SIZE - 14}
                width={(player.hp / 3) * 46}
                height={6}
                fill={fillColor}
                cornerRadius={3}
            />
        </Group>
    );
}