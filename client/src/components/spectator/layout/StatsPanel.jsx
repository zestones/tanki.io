import PropTypes from 'prop-types';

function StatsPanel({ gameState, viewportSize }) {
    return (
        <div className="absolute top-20 left-4 bg-black/60 backdrop-blur-sm text-white p-4 rounded-lg text-sm border border-white/10 shadow-lg max-w-xs">
            <h3 className="font-bold mb-2 text-indigo-300">Game Stats</h3>
            <div className="grid grid-cols-2 gap-2">
                <div>Players:</div>
                <div className="text-right">{gameState.players.size}</div>
                <div>Bullets:</div>
                <div className="text-right">{gameState.bullets.length}</div>
                <div>Explosions:</div>
                <div className="text-right">{gameState.explosions.length}</div>
                <div>Arena Size:</div>
                <div className="text-right">{gameState.arenaWidth}×{gameState.arenaHeight}</div>
                <div>Viewport:</div>
                <div className="text-right">{viewportSize.width}×{viewportSize.height}</div>
            </div>
        </div>
    );
}
StatsPanel.propTypes = {
    gameState: PropTypes.shape({
        players: PropTypes.shape({
            size: PropTypes.number
        }),
        bullets: PropTypes.array,
        explosions: PropTypes.array,
        arenaWidth: PropTypes.number,
        arenaHeight: PropTypes.number
    }).isRequired,
    viewportSize: PropTypes.shape({
        width: PropTypes.number,
        height: PropTypes.number
    }).isRequired
};

export default StatsPanel;