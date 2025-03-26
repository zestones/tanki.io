import { motion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import useLayoutSpacing from '../hooks/useLayoutSpacing';
import useViewportSize from '../hooks/useViewportSize';

import ActionButtons from '../components/mobile/buttons/ActionButtons';
import RegistrationForm from '../components/mobile/form/RegistrationForm';
import CombatOperationStatus from '../components/mobile/layout/CombatOperationStatus';
import Header from '../components/mobile/layout/Header';
import MissionBriefing from '../components/mobile/layout/MissionBriefing';
import NavBar from '../components/mobile/layout/NavBar';
import { BackgroundEffects, CornerDecorations, SidePanels } from '../components/mobile/utils/VisualEffects';

import PropTypes from 'prop-types';

function Home({ themeColor = "#3498db" }) {
    const [username, setUsername] = useState('');
    const [contentReady, setContentReady] = useState(false);

    const navigate = useNavigate();
    const rootRef = useRef(null);

    const { height } = useViewportSize(rootRef);
    const { layoutSize, spacing } = useLayoutSpacing(height);

    useEffect(() => {
        const timer = setTimeout(() => {
            setContentReady(true);
        }, 300);
        return () => clearTimeout(timer);
    }, []);

    const handleSubmit = (e) => {
        if (e) e.preventDefault();
        if (username.trim()) {
            sessionStorage.setItem('username', username.trim());
            navigate('/tanki.io/tank-selection');
        }
    };

    return (
        <div ref={rootRef} className="flex flex-col h-screen bg-gray-900 text-white overflow-hidden">
            {/* Use imported visual effect components */}
            <BackgroundEffects />
            <CornerDecorations />

            <NavBar
                themeColor={themeColor}
                title="TANKI.IO"
                version="SYSTEM v2.5"
            />

            <div className="flex-grow flex flex-col h-full relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: contentReady ? 1 : 0, y: contentReady ? 0 : 10 }}
                    transition={{ duration: 0.5 }}
                >
                    <Header
                        spacing={spacing.header}
                        animateIn={contentReady}
                        layoutSize={layoutSize}
                    />
                </motion.div>

                <div className="flex flex-col flex-grow px-6">
                    <div>
                        <motion.div
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: contentReady ? 1 : 0, y: contentReady ? 0 : 15 }}
                            transition={{ duration: 0.6, delay: 0.1 }}
                        >
                            <RegistrationForm
                                username={username}
                                setUsername={setUsername}
                                handleSubmit={handleSubmit}
                                spacing={spacing}
                                layoutSize={layoutSize}
                                themeColor={themeColor}
                            />
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: contentReady ? 1 : 0, y: contentReady ? 0 : 15 }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                        >
                            <CombatOperationStatus
                                spacing={spacing}
                                animateIn={contentReady}
                                themeColor={themeColor}
                                layoutSize={layoutSize}
                            />
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: contentReady ? 1 : 0, y: contentReady ? 0 : 15 }}
                            transition={{ duration: 0.6, delay: 0.3 }}
                        >
                            <MissionBriefing
                                spacing={spacing}
                                animateIn={contentReady}
                                layoutSize={layoutSize}
                            />
                        </motion.div>
                    </div>
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: contentReady ? 1 : 0, y: contentReady ? 0 : 15 }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                >
                    <ActionButtons
                        spacing={spacing.actionButtons}
                        layoutSize={layoutSize}
                        themeColor={themeColor}
                        username={username}
                        handleSubmit={handleSubmit}
                        navigate={navigate}
                    />
                </motion.div>
            </div>

            <SidePanels />
        </div>
    );
}

Home.propTypes = {
    themeColor: PropTypes.string
};

export default Home;