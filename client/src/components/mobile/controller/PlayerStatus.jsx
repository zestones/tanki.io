import PropTypes from 'prop-types';
import { withOpacity } from '../../../utils/colorUtils';
import ScanTechButton from '../buttons/ScanTechButton';
import StatsButtonIcon from '../buttons/StatsButtonIcon';



function PlayerStatus({ onToggleStats, username, tankType, health, score = 0, tankColor = '#ff8c00' }) {
    // Calculate health percentage for progress bar
    // TODO : make the 3 match the max health in the server
    const healthPercentage = Math.max(0, Math.min(100, (health / 100) * 100));

    const clipPathStyle = "polygon(0% 0%, 100% 0%, 98% 100%, 0% 100%, 2% 50%)";

    return (
        <div
            className="bg-[#1a1a20]/80 shadow-lg p-3 text-white flex items-center justify-between w-full max-w-md mx-auto relative overflow-hidden"
            style={{
                clipPath: clipPathStyle,
                borderLeft: `4px solid ${tankColor}`
            }}
        >
            <div className="absolute inset-0" style={{
                background: `linear-gradient(45deg, ${withOpacity(tankColor, 0.05)} 25%, transparent 25%, transparent 50%, ${withOpacity(tankColor, 0.05)} 50%, ${withOpacity(tankColor, 0.05)} 75%, transparent 75%, transparent)`,
                backgroundSize: '10px 10px'
            }}></div>

            {/* Diagonal border accent */}
            <div className="absolute top-0 right-0 w-[40%] h-1" style={{ backgroundColor: withOpacity(tankColor, 0.7) }}></div>
            <div className="absolute bottom-0 left-0 w-[40%] h-1" style={{ backgroundColor: withOpacity(tankColor, 0.7) }}></div>

            <div className="flex items-center z-10">
                {/* Hexagonal avatar frame */}
                <div className="relative flex items-center justify-center w-12 h-12 mr-3">
                    <svg viewBox="0 0 100 100" className="absolute w-full h-full">
                        <polygon
                            points="50,0 100,25 100,75 50,100 0,75 0,25"
                            fill="#1a1a20"
                            stroke={withOpacity(tankColor, 0.7)}
                            strokeWidth="3"
                        />
                    </svg>
                    <div className="z-10 text-white w-6 h-6 flex items-center justify-center" style={{ backgroundColor: tankColor }}>
                        <span className="font-bold text-shadow">{username.charAt(0).toUpperCase()}</span>
                    </div>
                </div>

                <div>
                    <div className="flex items-center">
                        <span className="font-medium tracking-wide" style={{ color: tankColor }}>{username}</span>
                        <div className="ml-2 px-1 text-[10px] border" style={{
                            backgroundColor: withOpacity(tankColor, 0.2),
                            color: tankColor,
                            borderColor: withOpacity(tankColor, 0.4)
                        }}>
                            OPERATOR
                        </div>
                    </div>
                    <div className="text-xs mt-0.5 font-mono" style={{ color: withOpacity(tankColor, 0.7) }}>{tankType}{'//ACTIVE'}</div>
                </div>
            </div>

            <div className="flex items-center gap-3 z-10">
                <div className="flex flex-col">
                    <div className="flex items-center mb-1">
                        <span className="text-sm font-mono mr-1" style={{ color: tankColor }}>HP</span>
                        <span className="text-sm font-mono">{health}</span>
                    </div>
                    <div className="w-16 h-2 bg-[#1a1a20] relative" style={{ border: `1px solid ${withOpacity(tankColor, 0.3)}` }}>
                        <div className="absolute inset-0 flex">
                            {[...Array(10)].map((_, i) => (
                                <div
                                    key={'health-bar-' + i}
                                    className="h-full flex-1 mx-px"
                                    style={{
                                        backgroundColor: i * 10 < healthPercentage ? tankColor : 'transparent',
                                        opacity: i * 10 < healthPercentage ? 1 - (i * 0.07) : 0.1
                                    }}
                                ></div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="flex flex-col items-end">
                    <div className="flex items-center mb-1">
                        <span className="text-sm font-mono mr-1">{score}</span>
                        <span className="text-xs font-mono px-1 border" style={{
                            backgroundColor: withOpacity(tankColor, 0.2),
                            color: tankColor,
                            borderColor: withOpacity(tankColor, 0.4)
                        }}>PTS</span>
                    </div>
                </div>

                {/* Arknights-style Tank Stats Toggle Button */}
                <ScanTechButton
                    onClose={onToggleStats}
                    text='STATS'
                    icon={<StatsButtonIcon color={tankColor} />}
                    color={tankColor}
                    className="relative h-12 ml-1 focus:outline-none active:opacity-80 transition-opacity duration-100"
                    ariaLabel="Toggle tank stats"
                />
            </div>
        </div>
    );
}

PlayerStatus.propTypes = {
    onToggleStats: PropTypes.func.isRequired,
    username: PropTypes.string.isRequired,
    tankType: PropTypes.string.isRequired,
    health: PropTypes.number.isRequired,
    score: PropTypes.number,
    tankColor: PropTypes.string,
};

export default PlayerStatus;