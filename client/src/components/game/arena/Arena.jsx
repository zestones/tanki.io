import { Rect, Group, Line } from 'react-konva';
import Grid from './Grid';

import Bullet from '../entities/bullets/Bullet';
import Explosion from '../fx/Explosion';

import PropTypes from 'prop-types';

import { tankComponentMap } from '../../../utils/tankComponentMap';

function Arena({ gameState }) {
    const { arenaWidth, arenaHeight, players, bullets, explosions } = gameState;

    const cornerSize = 100;

    return (
        <>
            <Rect
                x={0}
                y={0}
                width={arenaWidth}
                height={arenaHeight}
                fill="#0d0d10"
            />

            {/* Subtle radial gradient overlay */}
            <Rect
                x={0}
                y={0}
                width={arenaWidth}
                height={arenaHeight}
                fillRadialGradientStartPoint={{ x: arenaWidth / 2, y: arenaHeight / 2 }}
                fillRadialGradientStartRadius={0}
                fillRadialGradientEndPoint={{ x: arenaWidth / 2, y: arenaHeight / 2 }}
                fillRadialGradientEndRadius={Math.max(arenaWidth, arenaHeight) / 1.5}
                fillRadialGradientColorStops={[0, 'rgba(50, 50, 70, 0.2)', 1, 'rgba(10, 10, 15, 0)']}
            />

            <Grid arenaWidth={arenaWidth} arenaHeight={arenaHeight} />

            {/* Arena border with white accents */}
            <Rect
                x={0}
                y={0}
                width={arenaWidth}
                height={arenaHeight}
                stroke="rgba(255, 255, 255, 0.3)"
                strokeWidth={2}
            />

            <Group>
                {/* Top left */}
                <Line
                    points={[0, 0, cornerSize, 0, cornerSize, 2, 2, 2, 2, cornerSize, 0, cornerSize]}
                    closed={true}
                    fill="rgba(255, 255, 255, 0.2)"
                />
                {/* Top right */}
                <Line
                    points={[arenaWidth, 0, arenaWidth - cornerSize, 0, arenaWidth - cornerSize, 2, arenaWidth - 2, 2, arenaWidth - 2, cornerSize, arenaWidth, cornerSize]}
                    closed={true}
                    fill="rgba(255, 255, 255, 0.2)"
                />
                {/* Bottom left */}
                <Line
                    points={[0, arenaHeight, cornerSize, arenaHeight, cornerSize, arenaHeight - 2, 2, arenaHeight - 2, 2, arenaHeight - cornerSize, 0, arenaHeight - cornerSize]}
                    closed={true}
                    fill="rgba(255, 255, 255, 0.2)"
                />
                {/* Bottom right */}
                <Line
                    points={[arenaWidth, arenaHeight, arenaWidth - cornerSize, arenaHeight, arenaWidth - cornerSize, arenaHeight - 2, arenaWidth - 2, arenaHeight - 2, arenaWidth - 2, arenaHeight - cornerSize, arenaWidth, arenaHeight - cornerSize]}
                    closed={true}
                    fill="rgba(255, 255, 255, 0.2)"
                />
            </Group>

            {/* Decorative center lines */}
            <Group>
                <Line
                    points={[arenaWidth / 2, 0, arenaWidth / 2, arenaHeight]}
                    stroke="rgba(255, 255, 255, 0.05)"
                    strokeWidth={1}
                    dash={[10, 20]}
                />
                <Line
                    points={[0, arenaHeight / 2, arenaWidth, arenaHeight / 2]}
                    stroke="rgba(255, 255, 255, 0.05)"
                    strokeWidth={1}
                    dash={[10, 20]}
                />
            </Group>

            {explosions.map((explosion, index) => (
                <Explosion key={'explosion-' + index} explosion={explosion} />
            ))}

            {bullets.map((bullet, index) => (
                <Bullet key={'bullet-' + index} bullet={bullet} />
            ))}

            {Array.from(players.entries()).map(([sessionId, player]) => {
                const TankComponent = tankComponentMap[player.tank.type];
                return (
                    <TankComponent
                        key={`tank-${sessionId}`}
                        x={player.x}
                        y={player.y}
                        rotation={player.direction}
                        hp={player.hp}
                        username={player.username}
                        isDead={player.isDead}
                    />
                );
            })}
        </>
    );
}

Arena.propTypes = {
    gameState: PropTypes.shape({
        arenaWidth: PropTypes.number.isRequired,
        arenaHeight: PropTypes.number.isRequired,
        players: PropTypes.object.isRequired,
        bullets: PropTypes.arrayOf(PropTypes.object).isRequired,
        explosions: PropTypes.arrayOf(PropTypes.object).isRequired,
    }).isRequired,
};

export default Arena;