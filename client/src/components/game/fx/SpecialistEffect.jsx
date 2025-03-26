import PropTypes from 'prop-types';
import OrbitalStrikeEffect from './specialists/OrbitalStrikeEffect';
import ShieldEffect from './specialists/ShieldEffect';

const SpecialistEffect = ({ effect, player }) => {
    if (!player) return null;
    console.log('SpecialistEffect', effect);

    // Render different visual effects based on type
    switch (effect.type) {
        case 'shield':
            return <ShieldEffect effect={effect} player={player} />;

        case 'aoe':
            return <OrbitalStrikeEffect effect={effect} player={player} />;

        default:
            return null;
    }
};

SpecialistEffect.propTypes = {
    effect: PropTypes.shape({
        id: PropTypes.string.isRequired,
        playerId: PropTypes.string.isRequired,
        type: PropTypes.string.isRequired,
        position: PropTypes.shape({
            x: PropTypes.number.isRequired,
            y: PropTypes.number.isRequired
        }).isRequired,
        targetPosition: PropTypes.shape({
            x: PropTypes.number,
            y: PropTypes.number
        }),
        createdAt: PropTypes.number.isRequired,
        duration: PropTypes.number.isRequired,
        name: PropTypes.string
    }).isRequired,
    player: PropTypes.object
};

export default SpecialistEffect;
