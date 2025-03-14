import { Line } from 'react-konva';

export default function Grid({ arenaWidth, arenaHeight }) {
    const GRID_SIZE = 40;

    return (
        <>
            {/* Horizontal grid lines */}
            {Array.from({ length: Math.ceil(arenaHeight / GRID_SIZE) }).map((_, i) => (
                <Line
                    key={`grid-h-${i}`}
                    points={[0, i * GRID_SIZE, arenaWidth, i * GRID_SIZE]}
                    stroke="rgba(99, 102, 241, 0.1)"
                    strokeWidth={1}
                />
            ))}

            {/* Vertical grid lines */}
            {Array.from({ length: Math.ceil(arenaWidth / GRID_SIZE) }).map((_, i) => (
                <Line
                    key={`grid-v-${i}`}
                    points={[i * GRID_SIZE, 0, i * GRID_SIZE, arenaHeight]}
                    stroke="rgba(99, 102, 241, 0.1)"
                    strokeWidth={1}
                />
            ))}
        </>
    );
}