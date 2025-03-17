import PropTypes from 'prop-types';
import { withOpacity } from '../../../../../utils/colorUtils';

function BackgroundHexagon({ tankColor }) {
    return (
        <svg width="300" height="300" viewBox="0 0 300 300" className="absolute">
            <polygon
                points="150,0 300,75 300,225 150,300 0,225 0,75"
                fill="none"
                stroke={withOpacity(tankColor, 0.3)}
                strokeWidth="1"
            />
            <polygon
                points="150,50 250,100 250,200 150,250 50,200 50,100"
                fill="none"
                stroke={withOpacity(tankColor, 0.2)}
                strokeWidth="1"
            />
            <polygon
                points="150,100 200,125 200,175 150,200 100,175 100,125"
                fill="none"
                stroke={withOpacity(tankColor, 0.4)}
                strokeWidth="1"
            />
        </svg>
    );
}

BackgroundHexagon.propTypes = {
    tankColor: PropTypes.string.isRequired
};

export default BackgroundHexagon;
