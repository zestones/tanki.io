import PropTypes from 'prop-types';

function PlayerStatus({ username, tankType, health, score = 0 }) {
    // Calculate health percentage for progress bar
    // TODO : make the 3 match the max health in the server
    const healthPercentage = Math.max(0, Math.min(100, (health / 3) * 100));

    const clipPathStyle = "polygon(0% 0%, 100% 0%, 98% 100%, 0% 100%, 2% 50%)";

    return (
        <div
            className="bg-[#1a1a20]/80 border-l-4 border-[#ff8c00] shadow-lg p-3 text-white flex items-center justify-between w-full max-w-md mx-auto relative overflow-hidden"
            style={{ clipPath: clipPathStyle }}
        >
            <div className="absolute inset-0 bg-[linear-gradient(45deg,rgba(255,140,0,0.05)_25%,transparent_25%,transparent_50%,rgba(255,140,0,0.05)_50%,rgba(255,140,0,0.05)_75%,transparent_75%,transparent)] bg-[length:10px_10px]"></div>

            {/* Diagonal border accent */}
            <div className="absolute top-0 right-0 w-[40%] h-1 bg-[#ff8c00]/70"></div>
            <div className="absolute bottom-0 left-0 w-[40%] h-1 bg-[#ff8c00]/70"></div>

            <div className="flex items-center z-10">
                {/* Hexagonal avatar frame */}
                <div className="relative flex items-center justify-center w-12 h-12 mr-3">
                    <svg viewBox="0 0 100 100" className="absolute w-full h-full">
                        <polygon
                            points="50,0 100,25 100,75 50,100 0,75 0,25"
                            fill="#1a1a20"
                            stroke="rgba(255,140,0,0.7)"
                            strokeWidth="3"
                        />
                    </svg>
                    <div className="z-10 bg-[#ff8c00] text-white w-6 h-6 flex items-center justify-center">
                        <span className="font-bold text-shadow">{username.charAt(0).toUpperCase()}</span>
                    </div>
                </div>

                <div>
                    <div className="flex items-center">
                        <span className="font-medium tracking-wide text-[#ff8c00]">{username}</span>
                        <div className="ml-2 px-1 text-[10px] bg-[#ff8c00]/20 text-[#ff8c00] border border-[#ff8c00]/40">
                            OPERATOR
                        </div>
                    </div>
                    <div className="text-xs text-[#ff8c00]/70 mt-0.5 font-mono">{tankType}//ACTIVE</div>
                </div>
            </div>

            <div className="flex items-center gap-5 z-10">
                <div className="flex flex-col">
                    <div className="flex items-center mb-1">
                        <span className="text-sm font-mono text-[#ff8c00] mr-1">HP</span>
                        <span className="text-sm font-mono">{health}</span>
                    </div>
                    <div className="w-16 h-2 bg-[#1a1a20] relative border border-[#ff8c00]/30">
                        <div className="absolute inset-0 flex">
                            {[...Array(10)].map((_, i) => (
                                <div
                                    key={i}
                                    className="h-full flex-1 mx-px"
                                    style={{
                                        backgroundColor: i * 10 < healthPercentage ? '#ff8c00' : 'transparent',
                                        opacity: i * 10 < healthPercentage ? 1 - (i * 0.07) : 0.1
                                    }}
                                ></div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="flex flex-col items-end"></div>
                <div className="flex items-center mb-1">
                    <span className="text-sm font-mono mr-1">{score}</span>
                    <span className="text-xs font-mono px-1 bg-[#ff8c00]/20 text-[#ff8c00] border border-[#ff8c00]/40">PTS</span>
                </div>
                <div
                    className="text-xs text-[#ff8c00] font-mono border border-[#ff8c00]/30 px-1"
                    style={{ clipPath: "polygon(0% 0%, 100% 0%, 90% 100%, 0% 100%)" }}
                ></div>
            </div>
        </div>
    );
}

PlayerStatus.propTypes = {
    username: PropTypes.string.isRequired,
    tankType: PropTypes.string.isRequired,
    health: PropTypes.number.isRequired,
    score: PropTypes.number
};


export default PlayerStatus;