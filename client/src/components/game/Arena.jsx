import { Rect } from 'react-konva';
import Grid from './Grid';
import SentinelTank from './tanks/SentinelTank';
import Bullet from './Bullet';
import Explosion from './Explosion';

export default function Arena({ gameState }) {
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
                <Explosion key={`explosion-${index}`} explosion={explosion} />
            ))}

            {bullets.map((bullet, index) => (
                <Bullet key={`bullet-${index}`} bullet={bullet} />
            ))}

            {Array.from(players.entries()).map(([sessionId, player]) => (
                <SentinelTank
                    key={`tank-${sessionId}`}
                    x={player.x}
                    y={player.y}
                    rotation={player.direction}
                    hp={player.hp}
                    username={player.username}
                />
            ))}
        </>
    );
}