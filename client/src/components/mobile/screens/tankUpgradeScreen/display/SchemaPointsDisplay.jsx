import PropTypes from 'prop-types';
import SchemaLabel from '../../../modal/SchemaLabel';

function SchemaPointsDisplay({ points, tankColor, scale, onUpgrade, upgradeEffect }) {
    return (
        <svg width="600" height="600" viewBox="-300 -300 600 600" className="absolute" style={{
            pointerEvents: 'none',
            transform: `scale(${scale})`
        }}>
            {points.map((point, index) => (
                <SchemaLabel
                    key={'schema-point-' + index}
                    point={point}
                    tankColor={tankColor}
                    onUpgrade={point.statKey ? () => onUpgrade(point.statKey) : null}
                    upgradeEffect={upgradeEffect === point.statKey}
                />
            ))}
        </svg>
    );
}

SchemaPointsDisplay.propTypes = {
    points: PropTypes.arrayOf(
        PropTypes.shape({
            x: PropTypes.number.isRequired,
            y: PropTypes.number.isRequired,
            label: PropTypes.string.isRequired,
            value: PropTypes.string.isRequired,
            statKey: PropTypes.string,
            upgradable: PropTypes.bool
        })
    ).isRequired,
    tankColor: PropTypes.string.isRequired,
    scale: PropTypes.number.isRequired,
    onUpgrade: PropTypes.func.isRequired,
    upgradeEffect: PropTypes.string
};

export default SchemaPointsDisplay;
