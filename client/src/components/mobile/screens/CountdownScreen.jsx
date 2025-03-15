import PropTypes from 'prop-types';

function CountdownScreen({ countdown }) {
    if (countdown === null) return null;

    return (
        <div className="absolute inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="text-center space-y-4">
                <h2 className="text-4xl font-bold text-red-500">Tank Destroyed!</h2>
                <div className="text-7xl font-bold text-white">
                    {countdown}
                </div>
                <p className="text-xl text-gray-300">Respawning in seconds...</p>
            </div>
        </div>
    );
}

CountdownScreen.propTypes = {
    countdown: PropTypes.number,
};

export default CountdownScreen;