
import PropTypes from 'prop-types';

function MissionBriefing({ spacing, animateIn, layoutSize }) {
    return (
        <div className={`${spacing.stats} transition-all duration-700 delay-500 transform ${animateIn ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
            <div className="flex items-center mb-2">
                <div className="w-1 h-4 mr-2" style={{ backgroundColor: '#ff9800' }}></div>
                <h2 className="text-xs uppercase tracking-wider text-gray-300">Mission Briefing</h2>
            </div>

            <div className={`bg-yellow-950 bg-opacity-500 border border-gray-800 ${layoutSize === 'xs' ? 'p-2' : 'p-4'}`}>
                <div className={`space-y-${layoutSize === 'xs' ? '1' : '3'}`}>
                    <ul className="text-xs text-gray-300 space-y-1 pl-2">
                        <li className="flex">
                            <span className="text-gray-500 mr-2">•</span>
                            <span>Deploy your tank and engage hostiles</span>
                        </li>
                        <li className="flex">
                            <span className="text-gray-500 mr-2">•</span>
                            <span>Use tactical controls for navigation</span>
                        </li>
                        <li className="flex">
                            <span className="text-gray-500 mr-2">•</span>
                            <span>Execute firing sequence on enemies</span>
                        </li>
                        <li className="flex">
                            <span className="text-gray-500 mr-2">•</span>
                            <span>Secure battlefield dominance</span>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    );
}

MissionBriefing.propTypes = {
    spacing: PropTypes.object.isRequired,
    animateIn: PropTypes.bool.isRequired,
    layoutSize: PropTypes.string.isRequired
};

export default MissionBriefing;
