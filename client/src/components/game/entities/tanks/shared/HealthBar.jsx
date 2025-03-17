import { Rect } from 'react-konva';
import PropTypes from 'prop-types';

function HealthBar({ hp, x, y, size, color }) {
    return (
        <>
            {/* Health bar background */}
            <Rect
                x={x - 25}
                y={y - size - 15}
                width={50}
                height={8}
                fill="rgba(0,0,0,0.6)"
                cornerRadius={4}
                shadowColor="black"
                shadowBlur={2}
                shadowOffset={{ x: 0, y: 1 }}
                shadowOpacity={0.5}
            />

            {/* Health bar foreground */}
            <Rect
                x={x - 23}
                y={y - size - 14}
                width={(hp / 100) * 46}
                height={6}
                fill={color}
                cornerRadius={3}
            />
        </>
    )
}

HealthBar.propTypes = {
    hp: PropTypes.number.isRequired,
    x: PropTypes.number.isRequired,
    y: PropTypes.number.isRequired,
    size: PropTypes.number.isRequired,
    color: PropTypes.string.isRequired,
};

export default HealthBar;