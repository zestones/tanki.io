export default function Header({ spacing, animateIn, layoutSize }) {
    return (
        <div className={`px-4 ${spacing} transition-all duration-700 transform ${animateIn ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
            <div className="flex flex-col items-center mb-2">
                <div className="relative mb-1">
                    <h1 className={`${layoutSize === 'xs' ? 'text-xl' : layoutSize === 'sm' ? 'text-2xl' : 'text-3xl'} font-bold text-white tracking-wider`}>TANKI.IO</h1>
                    <div className="absolute -bottom-1 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-blue-400 to-transparent"></div>
                </div>
                <p className="text-xs text-gray-400 uppercase tracking-widest mt-1">Tactical Tank Combat System</p>
            </div>
        </div>
    );
}