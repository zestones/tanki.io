function PlayerStatus({ username, health }) {
    return (
        <div className="absolute top-2 left-0 right-0 mx-auto w-fit bg-black/50 backdrop-blur-md rounded-full px-4 py-1.5 flex items-center gap-3 shadow-lg border border-indigo-500/20">
            <div className="text-white font-semibold">{username}</div>
            <div className="flex space-x-1">
                {[...Array(3)].map((_, i) => (
                    <div
                        key={i}
                        className={`w-4 h-4 rounded-full ${i < health ? 'bg-green-500' : 'bg-gray-700'} transition-colors duration-300 ${i < health ? 'shadow-sm shadow-green-300' : ''}`}
                    ></div>
                ))}
            </div>
        </div>
    );
}

export default PlayerStatus;