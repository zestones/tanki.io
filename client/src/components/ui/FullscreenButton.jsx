function FullscreenButton({ isFullscreen, enterFullscreen }) {
    if (isFullscreen) return null;

    return (
        <button
            onClick={enterFullscreen}
            className="absolute top-2 right-2 z-50 bg-indigo-600 text-white rounded-full p-2 shadow-lg"
            aria-label="Enter fullscreen mode"
        >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5v-4m0 4h-4m4 0l-5-5" />
            </svg>
        </button>
    );
}

export default FullscreenButton;