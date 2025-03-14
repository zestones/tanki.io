function NavBar({ themeColor, title, version }) {
    return (
        <div className="bg-black bg-opacity-70 py-2 px-4 flex justify-between items-center border-b border-gray-800">
            <div className="flex items-center">
                <div className="w-1 h-5 mr-2" style={{ backgroundColor: themeColor }}></div>
                <h1 className="text-sm font-light tracking-widest">
                    TANKI.IO
                </h1>
            </div>
            <div className="text-xs text-gray-400 font-mono">
                SYSTEM v2.5
            </div>
        </div>
    );
}

export default NavBar;