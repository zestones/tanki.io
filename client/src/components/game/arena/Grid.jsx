import { Line } from 'react-konva';
import PropTypes from 'prop-types';

function Grid({ arenaWidth, arenaHeight }) {
    const GRID_SIZE = 80; // Larger grid for hexagonal pattern
    const HEX_SIZE = 40; // Size of hexagons
    const lines = [];

    for (let i = 0; i <= Math.ceil(arenaHeight / GRID_SIZE); i++) {
        lines.push(
            <Line
                key={'grid-h-' + i}
                points={[0, i * GRID_SIZE, arenaWidth, i * GRID_SIZE]}
                stroke="rgba(255, 255, 255, 0.06)"
                strokeWidth={i % 5 === 0 ? 1 : 0.5}
                dash={i % 5 === 0 ? [] : [5, 10]}
            />
        );
    }

    // Vertical grid lines
    for (let i = 0; i <= Math.ceil(arenaWidth / GRID_SIZE); i++) {
        lines.push(
            <Line
                key={'grid-v-' + i}
                points={[i * GRID_SIZE, 0, i * GRID_SIZE, arenaHeight]}
                stroke="rgba(255, 255, 255, 0.06)"
                strokeWidth={i % 5 === 0 ? 1 : 0.5}
                dash={i % 5 === 0 ? [] : [5, 10]}
            />
        );
    }

    // Add hexagonal patterns at intersections
    for (let y = 0; y < Math.ceil(arenaHeight / GRID_SIZE) + 1; y++) {
        for (let x = 0; x < Math.ceil(arenaWidth / GRID_SIZE) + 1; x++) {
            if ((x + y) % 3 === 0) { // Only place hexagons at some intersections for better aesthetic
                const centerX = x * GRID_SIZE;
                const centerY = y * GRID_SIZE;

                // Create a hexagon
                const points = [];
                for (let i = 0; i < 6; i++) {
                    const angle = (Math.PI / 3) * i - Math.PI / 6;
                    points.push(
                        centerX + HEX_SIZE * Math.cos(angle),
                        centerY + HEX_SIZE * Math.sin(angle)
                    );
                }

                lines.push(
                    <Line
                        key={`hex-${x}-${y}`}
                        points={points}
                        closed={true}
                        stroke="rgba(255, 255, 255, 0.1)"
                        strokeWidth={0.5}
                        dash={[5, 5]}
                    />
                );
            }
        }
    }

    lines.push(
        <Line
            key="diagonal-1"
            points={[0, 0, arenaWidth, arenaHeight]}
            stroke="rgba(255, 255, 255, 0.08)"
            strokeWidth={1}
            dash={[10, 15]}
        />
    );

    lines.push(
        <Line
            key="diagonal-2"
            points={[arenaWidth, 0, 0, arenaHeight]}
            stroke="rgba(255, 255, 255, 0.08)"
            strokeWidth={1}
            dash={[10, 15]}
        />
    );

    return <>{lines}</>;
}

Grid.propTypes = {
    arenaWidth: PropTypes.number.isRequired,
    arenaHeight: PropTypes.number.isRequired
};

export default Grid;