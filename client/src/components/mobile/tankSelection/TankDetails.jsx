import { Info, Target } from 'lucide-react';
import PropTypes from 'prop-types';

function TankDetails({ selectedTank, animateIn }) {
    return (
        <div className={`bg-black bg-opacity-70 h-full overflow-y-auto`}>
            <div className="border-t border-gray-800" style={{ borderColor: selectedTank.color, opacity: 0.5 }}></div>

            <div className="flex border-b border-gray-800">
                <div className="px-4 py-2 text-xs font-medium uppercase border-b-2"
                    style={{ borderColor: selectedTank.color }}>
                    Profile
                </div>
                <div className="px-4 py-2 text-xs text-gray-500">Skills</div>
                <div className="px-4 py-2 text-xs text-gray-500">Equipment</div>
            </div>

            <div className="p-4 space-y-4">
                <div className={`transition-opacity duration-300 ${animateIn ? 'opacity-100' : 'opacity-0'}`}>
                    <div className="flex items-center mb-2">
                        <Info size={12} className="mr-2" style={{ color: selectedTank.color }} />
                        <h3 className="text-xs uppercase tracking-wider text-gray-400">Description</h3>
                    </div>
                    <p className="text-sm text-gray-300">{selectedTank.description}</p>
                </div>

                <div className={`transition-opacity duration-300 delay-100 ${animateIn ? 'opacity-100' : 'opacity-0'}`}>
                    <div className="flex items-center mb-2">
                        <Target size={12} className="mr-2" style={{ color: selectedTank.color }} />
                        <h3 className="text-xs uppercase tracking-wider text-gray-400">Combat Attributes</h3>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <div className="flex justify-between text-xs">
                                <span className="text-gray-500">RANGE</span>
                                <span className="text-white">{selectedTank.range}</span>
                            </div>
                            <div className="flex justify-between text-xs mt-2">
                                <span className="text-gray-500">SPECIALTY</span>
                                <span className="text-white">{selectedTank.stats.specialty}</span>
                            </div>
                        </div>

                        <div>
                            <div className="text-xs text-gray-500 mb-1">ABILITIES</div>
                            <ul className="text-xs text-white">
                                {selectedTank.abilities.map((ability) => (
                                    <li key={`ability-${ability}`} className="flex items-center">
                                        <span className="inline-block w-1 h-1 mr-1"
                                            style={{ backgroundColor: selectedTank.color }}></span>
                                        {ability}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

TankDetails.propTypes = {
    selectedTank: PropTypes.shape({
        color: PropTypes.string.isRequired,
        description: PropTypes.string.isRequired,
        range: PropTypes.string.isRequired,
        stats: PropTypes.shape({
            specialty: PropTypes.string.isRequired
        }).isRequired,
        abilities: PropTypes.arrayOf(PropTypes.string).isRequired
    }).isRequired,
    animateIn: PropTypes.bool.isRequired,
};

export default TankDetails;
