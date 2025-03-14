import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import RegistrationForm from '../components/mobile/form/RegistrationForm';
import CombatOperationStatus from '../components/mobile/layout/CombatOperationStatus';
import Header from '../components/mobile/layout/Header';
import MissionBriefing from '../components/mobile/layout/MissionBriefing';
import NavBar from '../components/mobile/layout/NavBar';
import FullscreenModal from '../components/mobile/modal/FullscreenModal';
import ActionButtons from '../components/mobile/buttons/ActionButtons';
import { useFullscreenContext } from '../contexts/FullscreenContext';

export default function Home() {
    const [username, setUsername] = useState('');
    const [animateIn, setAnimateIn] = useState(false);
    const [showFullscreenModal, setShowFullscreenModal] = useState(false);
    const [viewportHeight, setViewportHeight] = useState(window.innerHeight);
    const navigate = useNavigate();

    const rootRef = useRef(null);
    const { isFullscreen, enterFullscreen } = useFullscreenContext();

    // Handle viewport height changes and set initial animation
    useEffect(() => {
        setAnimateIn(true);

        const handleResize = () => {
            setViewportHeight(window.innerHeight);
        };

        window.addEventListener('resize', handleResize);
        handleResize(); // Set initial height

        if (!isFullscreen) {
            setShowFullscreenModal(true);
        }

        return () => window.removeEventListener('resize', handleResize);
    }, [isFullscreen]);

    // Determine layout size based on viewport height
    const getLayoutSize = () => {
        if (viewportHeight < 568) return 'xs'; // iPhone SE and smaller
        if (viewportHeight < 667) return 'sm'; // iPhone 8
        if (viewportHeight < 812) return 'md'; // iPhone 11, XR
        return 'lg'; // iPhone 12+ and larger screens
    };

    const layoutSize = getLayoutSize();

    const handleSubmit = (e) => {
        if (e) e.preventDefault();
        if (username.trim()) {
            sessionStorage.setItem('username', username.trim());
            navigate('/tanki.io/tank-selection');
        }
    };

    const enableFullscreen = () => {
        enterFullscreen(document.documentElement);
        setShowFullscreenModal(false);
        sessionStorage.setItem('preferFullscreen', 'true');
    };

    const dismissFullscreenModal = () => {
        localStorage.setItem('fullscreenDismissed', 'true');
        setShowFullscreenModal(false);
    };

    const themeColor = "#3498db";

    // Define spacing classes based on layout size
    const getSpacingClasses = () => {
        switch (layoutSize) {
            case 'xs':
                return {
                    header: 'pt-2 pb-1',
                    form: 'space-y-2',
                    stats: 'mt-2',
                    briefing: 'my-auto py-2', // Centered with auto margin
                    actionButtons: 'p-2'
                };
            case 'sm':
                return {
                    header: 'pt-4 pb-1',
                    form: 'space-y-3',
                    stats: 'mt-3',
                    briefing: 'my-auto py-3', // Centered with auto margin
                    actionButtons: 'p-3'
                };
            case 'md':
                return {
                    header: 'pt-6 pb-2',
                    form: 'space-y-4',
                    stats: 'mt-4',
                    briefing: 'my-auto py-4', // Centered with auto margin
                    actionButtons: 'p-4'
                };
            case 'lg':
            default:
                return {
                    header: 'pt-8 pb-2',
                    form: 'space-y-5',
                    stats: 'mt-6',
                    briefing: 'my-auto py-5', // Centered with auto margin
                    actionButtons: 'p-6'
                };
        }
    };

    const spacing = getSpacingClasses();

    return (
        <div ref={rootRef} className="flex flex-col h-screen bg-gray-900 text-white overflow-hidden">
            <NavBar themeColor={themeColor} title="TANKI.IO" version="SYSTEM v2.5" />

            {/* Main content - takes remaining height */}
            <div className="flex-grow flex flex-col h-full">
                <Header
                    spacing={spacing.header}
                    animateIn={animateIn}
                    layoutSize={layoutSize}
                />

                {layoutSize !== 'xs' && (
                    <div className="absolute inset-0 pointer-events-none">
                        <div className="absolute top-20 left-4 w-10 h-10 border-t-2 border-l-2 border-gray-700 opacity-70"></div>
                        <div className="absolute top-20 right-4 w-10 h-10 border-t-2 border-r-2 border-gray-700 opacity-70"></div>
                    </div>
                )}

                {/* Main content area - using flex with 3 sections */}
                <div className="flex flex-col flex-grow px-6">
                    {/* Top section */}
                    <div>
                        {/* Login form with adaptive spacing */}
                        <div className={`transition-all duration-700 delay-300 transform ${animateIn ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
                            <RegistrationForm
                                username={username}
                                setUsername={setUsername}
                                handleSubmit={handleSubmit}
                                spacing={spacing}
                                layoutSize={layoutSize}
                                themeColor={themeColor}
                            />
                        </div>

                        {/* Unit statistics preview - adaptive heights */}
                        <CombatOperationStatus
                            spacing={spacing}
                            animateIn={animateIn}
                            themeColor={themeColor}
                            layoutSize={layoutSize}
                        />

                        <MissionBriefing
                            spacing={spacing}
                            animateIn={animateIn}
                            layoutSize={layoutSize}
                        />
                    </div>
                </div>

                <ActionButtons
                    spacing={spacing.actionButtons}
                    layoutSize={layoutSize}
                    themeColor={themeColor}
                    username={username}
                    handleSubmit={handleSubmit}
                    navigate={navigate}
                />
            </div>

            {/* Fullscreen Modal Component */}
            {showFullscreenModal && (
                <FullscreenModal
                    onEnable={enableFullscreen}
                    onDismiss={dismissFullscreenModal}
                    themeColor={themeColor}
                />
            )}
        </div>
    );
}