import PropTypes from 'prop-types';

function NavBar({ themeColor, title, version }) {
    return (
        <div className="bg-black bg-opacity-70 py-2 px-4 flex justify-between items-center border-b border-gray-800">
            <div className="flex items-center">
                <div className="w-1 h-5 mr-2" style={{ backgroundColor: themeColor }}></div>
                <h1 className="text-sm font-light tracking-widest">
                    {title}
                </h1>
            </div>
            <div className="text-xs text-gray-400 font-mono">
                {version}
            </div>
        </div>
    );
}

NavBar.propTypes = {
    themeColor: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    version: PropTypes.string.isRequired
};

export default NavBar;