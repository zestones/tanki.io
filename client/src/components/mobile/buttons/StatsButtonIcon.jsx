import PropTypes from 'prop-types';

function StatsButtonIcon({ color }) {
    return (
        <svg width="40" height="40" viewBox="0 0 40 40" className="filter drop-shadow-md">
            <clipPath id="stats-btn-clip">
                <polygon points="0,5 5,0 35,0 40,5 40,35 35,40 5,40 0,35" />
            </clipPath>

            <rect
                x="0" y="0" width="40" height="40"
                fill="rgba(20,22,30,0.95)"
                stroke={color}
                strokeWidth="1.5"
                clipPath="url(#stats-btn-clip)"
            />

            <line x1="5" y1="0" x2="0" y2="5" stroke={color} strokeWidth="1" />
            <line x1="35" y1="0" x2="40" y2="5" stroke={color} strokeWidth="1" />
            <line x1="0" y1="35" x2="5" y2="40" stroke={color} strokeWidth="1" />
            <line x1="40" y1="35" x2="35" y2="40" stroke={color} strokeWidth="1" />

            <rect x="10" y="0" width="20" height="2" fill={color} />

            <polygon
                points="20,10 26,13 26,21 20,24 14,21 14,13"
                fill="transparent"
                stroke={color}
                strokeWidth="1.5"
            />

            <g fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round">
                <line x1="17" y1="21" x2="17" y2="16" />
                <line x1="20" y1="21" x2="20" y2="13" />
                <line x1="23" y1="21" x2="23" y2="15" />
            </g>

            <rect x="8" y="27" width="24" height="10" fill="rgba(0,0,0,0.5)" />
        </svg>
    );
}

StatsButtonIcon.propTypes = {
    color: PropTypes.string.isRequired,
};

export default StatsButtonIcon;