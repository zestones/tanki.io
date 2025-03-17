import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { Layer, Stage } from 'react-konva';

function TankDisplay({ TankComponent, scale, username }) {
    const [tankRotation, setTankRotation] = useState(0);

    // Auto-rotation effect
    useEffect(() => {
        const interval = setInterval(() => {
            setTankRotation((prev) => (prev + 0.5) % 360);
        }, 50);
        return () => clearInterval(interval);
    }, []);

    return (
        <div
            className="relative flex items-center justify-center z-10"
            style={{
                transform: `scale(${scale})`,
                transition: 'transform 0.1s ease-out'
            }}
        >
            <div className="w-48 h-48 flex items-center justify-center">
                <Stage width={200} height={120}>
                    <Layer>
                        <TankComponent
                            x={100}
                            y={60}
                            rotation={tankRotation}
                            hp={100}
                            username={username}
                            isDead={false}
                        />
                    </Layer>
                </Stage>
            </div>
        </div>
    );
}

TankDisplay.propTypes = {
    TankComponent: PropTypes.func.isRequired,
    scale: PropTypes.number.isRequired,
    username: PropTypes.string.isRequired
};

export default TankDisplay;
