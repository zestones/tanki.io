import PropTypes from 'prop-types';
import { withOpacity } from '../../../utils/colorUtils';

function SchemaLabel({ point, tankColor, onUpgrade, upgradeEffect }) {
    const { x, y, label, value, upgradable } = point;

    // Width of the label container
    const boxWidth = 100;
    const boxHeight = 40;
    const isRightSide = x > 0;
    const boxX = x + (isRightSide ? 10 : -boxWidth - 10);

    // Calculate filled bar width for numerical stats
    const statValue = parseInt(value);
    const filledWidth = isNaN(statValue) ? 0 : (statValue / 10) * 90;

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

            {/* End dot with pulse effect when upgrading */}
            <circle
                cx={x}
                cy={y}
                r="3"
                fill={tankColor}
            />
            {upgradeEffect && (
                <>
                    <circle
                        cx={x}
                        cy={y}
                        r="10"
                        fill="none"
                        stroke={tankColor}
                        strokeWidth="1"
                        opacity="0.7"
                        style={{
                            animation: 'pulse 1s ease-out'
                        }}
                    >
                        <animate
                            attributeName="r"
                            from="3"
                            to="15"
                            dur="0.8s"
                            begin="0s"
                            repeatCount="1"
                        />
                        <animate
                            attributeName="opacity"
                            from="0.7"
                            to="0"
                            dur="0.8s"
                            begin="0s"
                            repeatCount="1"
                        />
                    </circle>
                </>
            )}

            {/* Label background with futuristic border */}
            <rect
                x={boxX}
                y={y - 20}
                width={boxWidth}
                height={boxHeight}
                fill="rgba(0,0,0,0.7)"
                stroke={withOpacity(tankColor, 0.5)}
                strokeWidth="1"
                rx="2"
            />

            {/* Upgrade-ready indicator line */}
            {upgradable && (
                <rect
                    x={boxX}
                    y={y - 20}
                    width={boxWidth}
                    height="2"
                    fill={tankColor}
                    opacity="0.8"
                />
            )}

            {/* Label text */}
            <text
                x={boxX + 5}
                y={y - 5}
                fill={withOpacity(tankColor, 0.7)}
                fontSize="10"
                fontFamily="monospace"
            >
                {label}
            </text>
            <text
                x={boxX + 5}
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
                        x={boxX + 5}
                        y={y + 15}
                        width="90"
                        height="3"
                        fill="rgba(80,80,80,0.5)"
                        rx="1"
                    />
                    <rect
                        x={boxX + 5}
                        y={y + 15}
                        width={filledWidth}
                        height="3"
                        fill={tankColor}
                        rx="1"
                        style={{
                            transition: 'width 0.3s ease-out'
                        }}
                    />
                    {upgradeEffect && (
                        <rect
                            x={boxX + 5 + filledWidth - 10}
                            y={y + 15}
                            width="10"
                            height="3"
                            fill={withOpacity(tankColor, 0.9)}
                            rx="1"
                        >
                            <animate
                                attributeName="opacity"
                                from="1"
                                to="0"
                                dur="0.8s"
                                begin="0s"
                                repeatCount="1"
                            />
                        </rect>
                    )}
                </g>
            )}

            {/* Upgrade button */}
            {upgradable && onUpgrade && (
                <g
                    onClick={onUpgrade}
                    style={{ cursor: 'pointer', pointerEvents: 'all' }}
                    className="upgrade-button"
                >
                    <rect
                        x={boxX + boxWidth - 20}
                        y={y - 20}
                        width="20"
                        height="20"
                        fill="rgba(0,0,0,0.8)"
                        stroke={tankColor}
                        strokeWidth="1"
                    />
                    <line
                        x1={boxX + boxWidth - 15}
                        y1={y - 10}
                        x2={boxX + boxWidth - 5}
                        y2={y - 10}
                        stroke={tankColor}
                        strokeWidth="1.5"
                    />
                    <line
                        x1={boxX + boxWidth - 10}
                        y1={y - 15}
                        x2={boxX + boxWidth - 10}
                        y2={y - 5}
                        stroke={tankColor}
                        strokeWidth="1.5"
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
        value: PropTypes.string.isRequired,
        statKey: PropTypes.string,
        upgradable: PropTypes.bool
    }).isRequired,
    tankColor: PropTypes.string.isRequired,
    onUpgrade: PropTypes.func,
    upgradeEffect: PropTypes.bool
};

export default SchemaLabel;
