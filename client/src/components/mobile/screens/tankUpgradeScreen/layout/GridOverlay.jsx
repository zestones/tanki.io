import PropTypes from 'prop-types';
import { withOpacity } from '../../../../../utils/colorUtils';

function GridOverlay({ tankColor }) {
    return (
        <div className="absolute inset-0 pointer-events-none" style={{
            backgroundImage: `linear-gradient(to right, ${withOpacity(tankColor, 0.1)} 1px, transparent 1px), 
                        linear-gradient(to bottom, ${withOpacity(tankColor, 0.1)} 1px, transparent 1px)`,
            backgroundSize: '20px 20px'
        }}></div>
    );
}

GridOverlay.propTypes = {
    tankColor: PropTypes.string.isRequired
};

export default GridOverlay;
