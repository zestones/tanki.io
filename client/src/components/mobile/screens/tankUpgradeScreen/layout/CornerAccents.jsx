import PropTypes from 'prop-types';

function CornerAccents({ tankColor }) {
    return (
        <>
            <div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2"
                style={{ borderColor: tankColor }}></div>
            <div className="absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2"
                style={{ borderColor: tankColor }}></div>
            <div className="absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2"
                style={{ borderColor: tankColor }}></div>
            <div className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2"
                style={{ borderColor: tankColor }}></div>
        </>
    );
}

CornerAccents.propTypes = {
    tankColor: PropTypes.string.isRequired
};

export default CornerAccents;
