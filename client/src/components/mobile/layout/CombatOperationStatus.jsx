import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';


function CombatOperationStatus({ spacing, animateIn, themeColor, layoutSize }) {
    const [currentTime, setCurrentTime] = useState('');

    // Update time display
    useEffect(() => {
        const interval = setInterval(() => {
            const now = new Date();
            const formatted = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`;
            setCurrentTime(formatted);
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    return (
        <div className={`${spacing.stats} transition-all duration-700 delay-500 transform ${animateIn ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
            <div className="flex items-center mb-2">
                <div className="w-1 h-4 mr-2" style={{ backgroundColor: themeColor }}></div>
                <h2 className="text-xs uppercase tracking-wider text-gray-300">Combat Operation Status</h2>
            </div>

            <div className={`bg-black bg-opacity-50 border border-gray-800 ${layoutSize === 'xs' ? 'p-2' : 'p-4'}`}>
                <div className="flex justify-between items-center mb-2">
                    <div className="flex items-center">
                        <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
                        <span className="text-xs text-green-400">OPERATION ACTIVE</span>
                    </div>
                    <span className="text-xs text-gray-500 font-mono">ID: TK-274</span>
                </div>

                <div className={`space-y-${layoutSize === 'xs' ? '1' : '3'}`}>
                    <div className="flex justify-between text-xs">
                        <span className="text-gray-400">Active Units</span>
                        <span className="text-white font-mono">6</span>
                    </div>
                    <div className="flex justify-between text-xs">
                        <span className="text-gray-400">Battlefield Status</span>
                        <span className="text-white font-mono">CONTESTED</span>
                    </div>
                    {layoutSize !== 'xs' && (
                        <div className="flex justify-between text-xs">
                            <span className="text-gray-400">Operation Time</span>
                            <span className="text-white font-mono">{currentTime}</span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

CombatOperationStatus.propTypes = {
    spacing: PropTypes.object.isRequired,
    animateIn: PropTypes.bool.isRequired,
    themeColor: PropTypes.string.isRequired,
    layoutSize: PropTypes.string.isRequired
};

export default CombatOperationStatus;
