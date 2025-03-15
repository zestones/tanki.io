import { Rect } from 'react-konva';
import Grid from './Grid';
import SentinelTank from '../entities/tanks/types/SentinelTank';
import Bullet from '../entities/bullets/Bullet';
import Explosion from '../fx/Explosion';
import PropTypes from 'prop-types';

function Arena({ gameState }) {
    const { arenaWidth, arenaHeight, players, bullets, explosions } = gameState;

    return (
        <>
            <Rect
                x={0}
                y={0}
                width={arenaWidth}
                height={arenaHeight}
                fill="#0f172a"
            />

            <Grid arenaWidth={arenaWidth} arenaHeight={arenaHeight} />

            <Rect
                x={0}
                y={0}
                width={arenaWidth}
                height={arenaHeight}
                stroke="rgba(99, 102, 241, 0.5)"
                strokeWidth={2}
            />

            {explosions.map((explosion, index) => (
                <Explosion key={'explosion-' + index} explosion={explosion} />
            ))}

            {bullets.map((bullet, index) => (
                <Bullet key={'bullet-' + index} bullet={bullet} />
            ))}

            {Array.from(players.entries()).map(([sessionId, player]) => (
                <SentinelTank
                    key={`tank-${sessionId}`}
                    x={player.x}
                    y={player.y}
                    rotation={player.direction}
                    hp={player.hp}
                    username={player.username}
                    isDead={player.isDead}
                />
            ))}
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