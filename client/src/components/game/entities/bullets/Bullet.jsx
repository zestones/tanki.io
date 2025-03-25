import PropTypes from 'prop-types';
import GuardianBullet from './GuardianBullet';
import JuggernautBullet from './JuggernautBullet';
import SentinelBullet from './SentinelBullet';
import ShredderBullet from './ShredderBullet';
import ThunderboltBullet from './ThunderboltBullet';


function Bullet({ bullet, tankType, color }) {
    switch (tankType) {
        case 'ST-N01': // SENTINEL - Balanced (Green)
            return <SentinelBullet bullet={bullet} color={color} />;

        case 'GD-N02': // GUARDIAN - Defender (Blue)
            return <GuardianBullet bullet={bullet} color={color} />;

        case 'SH-N03': // SHREDDER - Assault (Red)
            return <ShredderBullet bullet={bullet} color={color} />;

        case 'JG-N04': // JUGGERNAUT - Heavy (Yellow)
            return <JuggernautBullet bullet={bullet} color={color} />;

        case 'TB-N05': // THUNDERBOLT - Scout (Purple)
            return <ThunderboltBullet bullet={bullet} color={color} />;

        default: // Fallback to original bullet design
            return <SentinelBullet bullet={bullet} color={color} />;
    }
}

Bullet.propTypes = {
    bullet: PropTypes.shape({
        x: PropTypes.number.isRequired,
        y: PropTypes.number.isRequired,
        direction: PropTypes.number.isRequired
    }).isRequired,
    color: PropTypes.string,
    tankType: PropTypes.string
};

export default Bullet;