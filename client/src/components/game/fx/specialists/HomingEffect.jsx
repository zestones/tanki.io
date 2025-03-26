import PropTypes from 'prop-types';

// Homing missiles are usually handled by the bullet rendering system
// This component doesn't render anything directly but could be used for additional effects
const HomingEffect = () => {
    // No visual rendering as the missile bullets themselves are handled elsewhere
    return null;
};

HomingEffect.propTypes = {
    effect: PropTypes.object.isRequired,
    player: PropTypes.object.isRequired
};

export default HomingEffect;
