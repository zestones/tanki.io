import PropTypes from 'prop-types';

function LoadingScreen({ title, message }) {
    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black flex items-center justify-center">
            <div className="text-center">
                <div className="relative w-24 h-24 mx-auto mb-6">
                    <div className="absolute inset-0 w-full h-full border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
                    <div className="absolute inset-2 w-[calc(100%-16px)] h-[calc(100%-16px)] border-4 border-indigo-300 border-b-transparent rounded-full animate-spin animation-delay-150"></div>
                </div>
                <h2 className="text-white text-2xl font-bold mb-2">{title}</h2>
                <p className="text-indigo-300 text-lg">{message}</p>
            </div>
        </div>
    );
}

LoadingScreen.defaultProps = {
    title: 'TANKI.IO',
    message: 'Connecting to battlefield...'
};

LoadingScreen.propTypes = {
    title: PropTypes.string,
    message: PropTypes.string
};

export default LoadingScreen;