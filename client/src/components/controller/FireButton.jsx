function FireButton({ onShoot }) {
    return (
        <button
            className="w-32 h-32 rounded-full bg-gradient-to-r from-red-500 to-red-700 text-white font-bold text-2xl shadow-xl flex items-center justify-center active:scale-95 transition-all transform-gpu relative overflow-hidden active:shadow-red-500/50"
            onTouchStart={onShoot}
            onMouseDown={onShoot}
        >
            <div className="absolute inset-0 bg-white/10 rounded-full scale-90 transition-transform"></div>
            <div className="absolute inset-0 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
            </div>
        </button>
    );
}

export default FireButton;