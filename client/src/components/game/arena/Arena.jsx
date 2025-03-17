import { Rect, Group, Line } from 'react-konva';
import Grid from './Grid';

import Bullet from '../entities/bullets/Bullet';
import Explosion from '../fx/Explosion';

import PropTypes from 'prop-types';

import { tankComponentMap } from '../../../utils/tankComponentMap';

function Arena({ gameState }) {
    const { arenaWidth, arenaHeight, players, bullets, explosions } = gameState;

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

            {/* Hexagonal center decoration */}
            <Group>
                <Line
                    points={[
                        arenaWidth / 2, arenaHeight / 2 - 80,
                        arenaWidth / 2 + 70, arenaHeight / 2 - 40,
                        arenaWidth / 2 + 70, arenaHeight / 2 + 40,
                        arenaWidth / 2, arenaHeight / 2 + 80,
                        arenaWidth / 2 - 70, arenaHeight / 2 + 40,
                        arenaWidth / 2 - 70, arenaHeight / 2 - 40
                    ]}
                    closed={true}
                    stroke="rgba(78, 201, 255, 0.4)"
                    strokeWidth={1.5}
                    dash={[10, 5]}
                    shadowColor="rgba(78, 201, 255, 0.6)"
                    shadowBlur={10}
                    shadowOpacity={0.3}
                />
                <Line
                    points={[
                        arenaWidth / 2, arenaHeight / 2 - 40,
                        arenaWidth / 2 + 35, arenaHeight / 2 - 20,
                        arenaWidth / 2 + 35, arenaHeight / 2 + 20,
                        arenaWidth / 2, arenaHeight / 2 + 40,
                        arenaWidth / 2 - 35, arenaHeight / 2 + 20,
                        arenaWidth / 2 - 35, arenaHeight / 2 - 20
                    ]}
                    closed={true}
                    stroke="rgba(255, 140, 0, 0.4)"
                    strokeWidth={1}
                    shadowColor="rgba(255, 140, 0, 0.6)"
                    shadowBlur={10}
                    shadowOpacity={0.3}
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