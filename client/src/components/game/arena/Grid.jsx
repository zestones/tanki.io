import PropTypes from 'prop-types';
import { Circle, Line } from 'react-konva';

function Grid({ arenaWidth, arenaHeight }) {
    const energyLineCount = 5; // Reduced from 5 to 3

    const energyLines = [];
    for (let i = 1; i <= energyLineCount; i++) {
        const offset = (i * arenaWidth) / (energyLineCount + 1);
        energyLines.push(
            <Line
                key={`energy-v-${i}`}
                points={[offset, 0, offset, arenaHeight]}
                stroke="rgba(78, 201, 255, 0.08)"
                strokeWidth={1.5}
                dash={[30, 20, 10, 20]}
            />
        );

        const yOffset = (i * arenaHeight) / (energyLineCount + 1);
        energyLines.push(
            <Line
                key={`energy-h-${i}`}
                points={[0, yOffset, arenaWidth, yOffset]}
                stroke="rgba(78, 201, 255, 0.08)"
                strokeWidth={1.5}
                dash={[30, 20, 10, 20]}
            />
        );
    }

    // Create ambient energy nodes at intersection points - FIXED the infinite loop
    const energyNodes = [];
    for (let i = 1; i <= energyLineCount; i++) {
        for (let j = 1; j <= energyLineCount; j++) { // Fixed: was using i in the condition
            const xPos = (i * arenaWidth) / (energyLineCount + 1);
            const yPos = (j * arenaHeight) / (energyLineCount + 1);

            // Only place nodes at some intersections for better aesthetic and performance
            if ((i + j) % 2 !== 0) continue; // More strict condition to reduce nodes

            energyNodes.push(
                <Circle
                    key={`node-${i}-${j}`}
                    x={xPos}
                    y={yPos}
                    radius={4}
                    fill="rgba(78, 201, 255, 0.3)"
                    shadowColor="rgba(78, 201, 255, 0.6)"
                    shadowBlur={10}
                    shadowOpacity={0.5}
                />
            );
        }
    }
    return <>{energyLines}{energyNodes}</>;
}

Grid.propTypes = {
    arenaWidth: PropTypes.number.isRequired,
    arenaHeight: PropTypes.number.isRequired
};

export default Grid;