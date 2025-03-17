import PropTypes from 'prop-types';
import { withOpacity } from '../../../utils/colorUtils';

function SchemaLabel({ point, tankColor }) {
    const { x, y, label, value } = point;

    return (
        <g>
            {/* Connecting line */}
            <line
                x1="0"
                y1="0"
                x2={x}
                y2={y}
                stroke={withOpacity(tankColor, 0.5)}
                strokeWidth="1"
                strokeDasharray="4,4"
            />
            {/* End dot */}
            <circle
                cx={x}
                cy={y}
                r="3"
                fill={tankColor}
            />
            {/* Label background */}
            <rect
                x={x + (x > 0 ? 10 : -110)}
                y={y - 20}
                width="100"
                height="40"
                fill="rgba(0,0,0,0.7)"
                stroke={withOpacity(tankColor, 0.5)}
                strokeWidth="1"
            />
            {/* Label text */}
            <text
                x={x + (x > 0 ? 15 : -105)}
                y={y - 5}
                fill={withOpacity(tankColor, 0.7)}
                fontSize="10"
                fontFamily="monospace"
            >
                {label}
            </text>
            <text
                x={x + (x > 0 ? 15 : -105)}
                y={y + 10}
                fill={tankColor}
                fontSize="12"
                fontFamily="monospace"
                fontWeight="bold"
            >
                {value}
            </text>

            {/* Stat bars for numerical values */}
            {value.includes('/') && (
                <g>
                    <rect
                        x={x + (x > 0 ? 15 : -105)}
                        y={y + 15}
                        width="90"
                        height="3"
                        fill="rgba(0,0,0,0.5)"
                    />
                    <rect
                        x={x + (x > 0 ? 15 : -105)}
                        y={y + 15}
                        width={`${(parseInt(value) / 10) * 90}px`}
                        height="3"
                        fill={tankColor}
                    />
                </g>
            )}
        </g>
    );
}

SchemaLabel.propTypes = {
    point: PropTypes.shape({
        x: PropTypes.number.isRequired,
        y: PropTypes.number.isRequired,
        label: PropTypes.string.isRequired,
        value: PropTypes.string.isRequired
    }).isRequired,
    tankColor: PropTypes.string.isRequired
};

export default SchemaLabel;
