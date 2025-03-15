import { Group, Circle } from 'react-konva';
import PropTypes from 'prop-types';

function Explosion({ explosion }) {
    return (
        <Group>
            {/* Outer explosion glow */}
            <Circle
                x={explosion.x}
                y={explosion.y}
                radius={explosion.radius * 1.2}
                fillRadialGradientStartPoint={{ x: 0, y: 0 }}
                fillRadialGradientStartRadius={0}
                fillRadialGradientEndPoint={{ x: 0, y: 0 }}
                fillRadialGradientEndRadius={explosion.radius * 1.2}
                fillRadialGradientColorStops={[
                    0, 'rgba(255, 255, 255, 0)',
                    0.7, 'rgba(255, 165, 0, 0.1)',
                    1, 'rgba(255, 0, 0, 0)'
                ]}
            />

            {/* Main explosion */}
            <Circle
                x={explosion.x}
                y={explosion.y}
                radius={explosion.radius}
                fillRadialGradientStartPoint={{ x: 0, y: 0 }}
                fillRadialGradientStartRadius={0}
                fillRadialGradientEndPoint={{ x: 0, y: 0 }}
                fillRadialGradientEndRadius={explosion.radius}
                fillRadialGradientColorStops={[
                    0, 'rgba(255, 255, 255, 0.9)',
                    0.2, 'rgba(255, 255, 0, 0.8)',
                    0.5, 'rgba(255, 165, 0, 0.6)',
                    0.8, 'rgba(255, 0, 0, 0.4)',
                    1, 'rgba(0, 0, 0, 0)'
                ]}
            />
        </Group>
    );
}

Explosion.propTypes = {
    explosion: PropTypes.shape({
        x: PropTypes.number.isRequired,
        y: PropTypes.number.isRequired,
        radius: PropTypes.number.isRequired,
    }).isRequired,
};

export default Explosion;