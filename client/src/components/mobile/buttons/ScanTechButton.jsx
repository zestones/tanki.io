import propTypes from 'prop-types'
import { withOpacity } from '../../../utils/colorUtils'

function ScanTechButton({ text, icon, type, color, onClose, className, ariaLabel }) {
    const renderIcon = () => {
        switch (type) {
            case 'close':
                return (
                    <g stroke={color} strokeWidth="1.5" strokeLinecap="round">
                        <line x1="15" y1="15" x2="25" y2="25" />
                        <line x1="25" y1="15" x2="15" y2="25" />
                    </g>
                )
            case 'back':
                return (
                    <g stroke={color} strokeWidth="1.5" strokeLinecap="round">
                        <line x1="15" y1="20" x2="25" y2="20" />
                        <line x1="15" y1="20" x2="20" y2="15" />
                        <line x1="15" y1="20" x2="20" y2="25" />
                    </g>
                )
            default:
                return null
        }
    }

    return (
        <button
            className={className}
            onClick={onClose}
            aria-label={ariaLabel}
        >
            <div className="relative">
                {/* Button base with angled edges */}
                <svg width="40" height="40" viewBox="0 0 40 40" className="filter drop-shadow-md">
                    <polygon
                        points="0,5 5,0 40,0 40,35 35,40 0,40"
                        fill="rgba(10,12,18,0.9)"
                        stroke={color}
                        strokeWidth="1.5"
                    />

                    {/* Tech accent lines */}
                    <line x1="5" y1="0" x2="0" y2="5" stroke={color} strokeWidth="1" />
                    <line x1="40" y1="35" x2="35" y2="40" stroke={color} strokeWidth="1" />

                    {/* Decorative elements */}
                    <rect x="0" y="10" width="3" height="30" fill={color} />
                    <rect x="0" y="20" width="40" height="1" fill={withOpacity(color, 0.3)} />

                    {icon || renderIcon()}
                </svg>

                {/* Label text */}
                <div className="absolute bottom-0 left-0 right-0 text-center">
                    <span className="text-[8px] font-mono tracking-wider" style={{ color: color }}>
                        {text}
                    </span>
                </div>

                {/* Animated scan line effect */}
                <div
                    className="absolute top-0 left-0 w-full h-[1px] opacity-70"
                    style={{
                        backgroundColor: color,
                        animation: 'scanlineAnimation 2s linear infinite',
                        boxShadow: `0 0 4px ${color}`
                    }}
                ></div>
            </div>
        </button>
    )
}

ScanTechButton.propTypes = {
    text: propTypes.string.isRequired,
    color: propTypes.string.isRequired,
    onClose: propTypes.func.isRequired,
    icon: propTypes.element,
    type: propTypes.string,
    className: propTypes.string,
    ariaLabel: propTypes.string
}

export default ScanTechButton