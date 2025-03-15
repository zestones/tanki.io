import PropTypes from 'prop-types';

function Header({ spacing, animateIn, layoutSize }) {
    const getTextSizeClass = () => {
        if (layoutSize === 'xs') return 'text-xl';
        if (layoutSize === 'sm') return 'text-2xl';
        return 'text-3xl';
    };

    return (
        <div className={`px-4 ${spacing} transition-all duration-700 transform ${animateIn ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
            <div className="flex flex-col items-center mb-2">
                <div className="relative mb-1">
                    <h1 className={`${getTextSizeClass()} font-bold text-white tracking-wider`}>TANKI.IO</h1>
                    <div className="absolute -bottom-1 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-blue-400 to-transparent"></div>
                </div>
                <p className="text-xs text-gray-400 uppercase tracking-widest mt-1">Tactical Tank Combat System</p>
            </div>
        </div>
    );
}

Header.propTypes = {
    spacing: PropTypes.string.isRequired,
    animateIn: PropTypes.bool.isRequired,
    layoutSize: PropTypes.oneOf(['xs', 'sm', 'md', 'lg', 'xl']).isRequired
};

export default Header;