import PropTypes from 'prop-types';
import { withOpacity } from '../../../../../utils/colorUtils';

function UpgradePointsDisplay({ upgradePoints, tankColor }) {
    return (
        <div className="absolute top-4 right-4 flex flex-col items-end">
            <div className="relative">
                {/* Main container */}
                <svg width="150" height="60" viewBox="0 0 150 60" className="filter drop-shadow-lg">
                    {/* Main background shape */}
                    <polygon
                        points="15,0 150,0 150,40 135,60 0,60 0,20"
                        fill="rgba(10,12,18,0.9)"
                        stroke={tankColor}
                        strokeWidth="1.5"
                    />

                    {/* Left accent bar */}
                    <rect x="0" y="20" width="5" height="40" fill={tankColor} />

                    {/* Tech accent lines */}
                    <line x1="15" y1="0" x2="0" y2="20" stroke={tankColor} strokeWidth="1" />
                    <line x1="150" y1="40" x2="135" y2="60" stroke={tankColor} strokeWidth="1" />

                    {/* Decorative elements */}
                    <rect x="125" y="0" width="25" height="5" fill={tankColor} />
                    <rect x="0" y="30" width="150" height="1" fill={withOpacity(tankColor, 0.3)} />
                    <rect x="20" y="45" width="115" height="1" fill={withOpacity(tankColor, 0.2)} />
                </svg>

                {/* Content overlay */}
                <div className="absolute inset-0 flex items-center px-3">
                    {/* Left side - label */}
                    <div className="flex flex-col mr-3">
                        <span className="text-[10px] font-mono leading-tight tracking-wider opacity-70 uppercase"
                            style={{ color: withOpacity(tankColor, 0.8) }}>
                            Tactical
                        </span>
                        <span className="text-xs font-mono leading-tight tracking-wider font-semibold uppercase"
                            style={{ color: tankColor }}>
                            Points
                        </span>
                    </div>

                    {/* Right side - Hexagonal icon with number */}
                    <div className="flex items-center">
                        {/* Hexagonal icon */}
                        <div className="relative mr-2">
                            <svg width="26" height="30" viewBox="0 0 26 30">
                                {/* Base hexagon */}
                                <polygon
                                    points="13,0 26,7.5 26,22.5 13,30 0,22.5 0,7.5"
                                    fill="rgba(0,0,0,0.5)"
                                    stroke={tankColor}
                                    strokeWidth="1.5"
                                />
                                {/* Inner hexagon */}
                                <polygon
                                    points="13,5 21,9.5 21,20.5 13,25 5,20.5 5,9.5"
                                    fill="transparent"
                                    stroke={withOpacity(tankColor, 0.7)}
                                    strokeWidth="1"
                                />
                                {/* Center dot */}
                                <circle cx="13" cy="15" r="2" fill={tankColor} />
                                {/* Tech lines */}
                                <line x1="13" y1="5" x2="13" y2="0" stroke={withOpacity(tankColor, 0.7)} strokeWidth="1" />
                                <line x1="13" y1="25" x2="13" y2="30" stroke={withOpacity(tankColor, 0.7)} strokeWidth="1" />
                                <line x1="5" y1="9.5" x2="0" y2="7.5" stroke={withOpacity(tankColor, 0.7)} strokeWidth="1" />
                                <line x1="21" y1="9.5" x2="26" y2="7.5" stroke={withOpacity(tankColor, 0.7)} strokeWidth="1" />
                                <line x1="5" y1="20.5" x2="0" y2="22.5" stroke={withOpacity(tankColor, 0.7)} strokeWidth="1" />
                                <line x1="21" y1="20.5" x2="26" y2="22.5" stroke={withOpacity(tankColor, 0.7)} strokeWidth="1" />
                            </svg>
                        </div>

                        {/* Number display */}
                        <div className="flex flex-col items-center">
                            <span className="text-2xl font-bold font-mono" style={{ color: tankColor }}>
                                {upgradePoints}
                            </span>
                            <div className="h-1 w-full" style={{ backgroundColor: withOpacity(tankColor, 0.5) }} />
                        </div>
                    </div>
                </div>
            </div>

            {/* Subtitle with tech border */}
            <div className="mt-1 px-3 py-1 bg-black bg-opacity-70 relative" style={{ borderLeft: `2px solid ${tankColor}` }}>
                <span className="text-[10px] font-mono opacity-80" style={{ color: tankColor }}>
                    UPGRADES AVAILABLE
                </span>
            </div>
        </div>
    );
}

UpgradePointsDisplay.propTypes = {
    upgradePoints: PropTypes.number.isRequired,
    tankColor: PropTypes.string.isRequired
};

export default UpgradePointsDisplay;
