import { Shield, Target, Zap } from 'lucide-react';
import PropTypes from 'prop-types';

function TankStats({ selectedTank, spacing }) {
    const renderHexStat = (value, label, icon) => {
        const maxValue = 6;
        const percentage = Math.min((value / maxValue) * 100, 100);

        return (
            <div className="flex flex-col items-center">
                <div className="relative w-12 h-14 mb-1">
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-12 h-12 bg-gray-800 rounded-md transform rotate-45"></div>
                    </div>

                    <div className="absolute inset-0 flex items-center justify-center overflow-hidden"
                        style={{ clipPath: `polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)` }}>
                        <div
                            className="absolute bottom-0 w-12 transition-all duration-500 ease-out"
                            style={{
                                height: `${percentage}%`,
                                backgroundColor: selectedTank.color,
                                opacity: 0.7,
                                boxShadow: `0 0 10px ${selectedTank.color}`
                            }}
                        ></div>
                    </div>

                    <div className="absolute inset-0 flex items-center justify-center text-white">
                        {icon}
                    </div>
                </div>
                <span className="text-xs text-gray-400">{label}</span>
                <span className="text-xs font-bold text-white">{value}</span>
            </div>
        );
    };

    return (
        <div className={`flex justify-around px-8 ${spacing.tankStats} bg-gray-900 bg-opacity-70`}>
            {renderHexStat(selectedTank.stats.health, "HP", <Shield size={14} />)}
            {renderHexStat(selectedTank.stats.damage, "DMG", <Target size={14} />)}
            {renderHexStat(selectedTank.stats.speed, "SPD", <Zap size={14} />)}
        </div>
    );
};

TankStats.propTypes = {
    selectedTank: PropTypes.shape({
        color: PropTypes.string.isRequired,
        stats: PropTypes.shape({
            health: PropTypes.number.isRequired,
            damage: PropTypes.number.isRequired,
            speed: PropTypes.number.isRequired
        }).isRequired
    }).isRequired,
    spacing: PropTypes.object.isRequired
};

export default TankStats;
