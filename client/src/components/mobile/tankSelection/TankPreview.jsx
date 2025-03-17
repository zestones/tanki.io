import { Layer, Stage } from 'react-konva';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import PropTypes from 'prop-types';

function TankPreview({ selectedTank, tankRotation, animateIn, onNext, onPrev, TankComponent, spacing, layoutSize }) {
    const previewSizes = {
        xs: { width: 200, height: 200 },
        sm: { width: 240, height: 240 },
        md: { width: 260, height: 260 },
        lg: { width: 280, height: 280 }
    };

    const size = previewSizes[layoutSize];

    return (
        <div className={`relative flex items-center justify-center ${spacing.tankPreview}`}>
            <div className={`transition-all duration-300 transform ${animateIn ? 'scale-100 opacity-100' : 'scale-90 opacity-0'}`}>
                <Stage width={size.width} height={size.height}>
                    <Layer>
                        <TankComponent
                            x={size.width / 2}
                            y={size.height / 2}
                            rotation={tankRotation}
                            hp={100}
                            username={selectedTank.name}
                            isDead={false}
                        />
                    </Layer>
                </Stage>
            </div>

            <button
                onClick={onPrev}
                className="absolute left-0 z-10 p-2 bg-black bg-opacity-20 text-white focus:outline-none"
                style={{ borderRight: `2px solid ${selectedTank.color}` }}
            >
                <ChevronLeft size={20} />
            </button>
            <button
                onClick={onNext}
                className="absolute right-0 z-10 p-2 bg-black bg-opacity-20 text-white focus:outline-none"
                style={{ borderLeft: `2px solid ${selectedTank.color}` }}
            >
                <ChevronRight size={20} />
            </button>

            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-0 left-0 w-10 h-10 border-t-2 border-l-2 border-gray-700 opacity-70"></div>
                <div className="absolute top-0 right-0 w-10 h-10 border-t-2 border-r-2 border-gray-700 opacity-70"></div>
                <div className="absolute bottom-0 left-0 w-10 h-10 border-b-2 border-l-2 border-gray-700 opacity-70"></div>
                <div className="absolute bottom-0 right-0 w-10 h-10 border-b-2 border-r-2 border-gray-700 opacity-70"></div>
            </div>
        </div>
    );
};

TankPreview.propTypes = {
    selectedTank: PropTypes.shape({
        stats: PropTypes.shape({
            defense: PropTypes.number.isRequired
        }).isRequired,
        name: PropTypes.string.isRequired,
        color: PropTypes.string.isRequired
    }).isRequired,
    tankRotation: PropTypes.number.isRequired,
    animateIn: PropTypes.bool.isRequired,
    onNext: PropTypes.func.isRequired,
    onPrev: PropTypes.func.isRequired,
    TankComponent: PropTypes.elementType.isRequired,
    spacing: PropTypes.shape({
        tankPreview: PropTypes.string.isRequired
    }).isRequired,
    layoutSize: PropTypes.oneOf(['xs', 'sm', 'md', 'lg']).isRequired
};

export default TankPreview;
