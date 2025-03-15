import { useEffect, useRef, useState } from 'react';

import { useNavigate } from 'react-router-dom';
import { useFullscreenContext } from '../contexts/FullscreenContext';

import useLayoutSpacing from '../hooks/useLayoutSpacing';
import useViewportSize from '../hooks/useViewportSize';


import Header from '../components/mobile/layout/Header';
import NavBar from '../components/mobile/layout/NavBar';
import ActionButtons from '../components/mobile/buttons/ActionButtons';
import RegistrationForm from '../components/mobile/form/RegistrationForm';
import FullscreenModal from '../components/mobile/modal/FullscreenModal';
import MissionBriefing from '../components/mobile/layout/MissionBriefing';
import CombatOperationStatus from '../components/mobile/layout/CombatOperationStatus';

function Home() {
    const [username, setUsername] = useState('');
    const [animateIn, setAnimateIn] = useState(false);
    const [showFullscreenModal, setShowFullscreenModal] = useState(false);

    const navigate = useNavigate();
    const rootRef = useRef(null);

    const { isFullscreen, enterFullscreen } = useFullscreenContext();
    const { height } = useViewportSize(rootRef);
    const { layoutSize, spacing } = useLayoutSpacing(height);

    useEffect(() => {
        setAnimateIn(true);
        if (!isFullscreen) setShowFullscreenModal(true);
    }, [isFullscreen]);

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

    return (
        <div ref={rootRef} className="flex flex-col h-screen bg-gray-900 text-white overflow-hidden">
            <NavBar
                themeColor={themeColor}
                title="TANKI.IO"
                version="SYSTEM v2.5"
            />

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

                <div className="flex flex-col flex-grow px-6">
                    <div>
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

export default Home;