import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useResponsiveUtils from '../hooks/useResponsiveUtils';

import NavBar from '../components/mobile/layout/NavBar';
import FullscreenController from '../components/mobile/utils/FullscreenStateManager';

import { config } from '../config/config';
import { tankComponentMap } from '../utils/tankComponentMap';

import ErrorScreen from '../components/common/ErrorScreen';
import LoadingScreen from '../components/common/LoadingScreen';

// Import layout components
import PortraitLayout from '../components/mobile/tankSelection/layouts/PortraitLayout';
import LandscapeLayout from '../components/mobile/tankSelection/layouts/LandscapeLayout';

function TankSelection() {
    const rootRef = useRef(null);
    const { isPortrait } = useResponsiveUtils();
    const navigate = useNavigate();

    const [selectedIndex, setSelectedIndex] = useState(0);
    const [tankRotation, setTankRotation] = useState(0);
    const [animateIn, setAnimateIn] = useState(false);
    const [tanksData, setTanksData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch tank data from server
    useEffect(() => {
        const fetchTanksData = async () => {
            try {
                const response = await fetch(`${config.apiUrl}/tanks`);
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();

                // Convert object to array of tanks with codeName as key
                const tanksArray = Object.entries(data).map(([codeName, tankData]) => ({
                    codeName,
                    ...tankData,
                }));

                setTanksData(tanksArray);
                setLoading(false);
            } catch (err) {
                console.error("Failed to fetch tanks data:", err);
                setError(err.message);
                setLoading(false);
            }
        };

        fetchTanksData();
    }, []);

    // Animation effect for tank rotation
    useEffect(() => {
        const interval = setInterval(() => {
            setTankRotation((prev) => (prev + 0.5) % 360);
        }, 50);
        return () => clearInterval(interval);
    }, []);

    // Animation effect for component mount
    useEffect(() => { setAnimateIn(true); }, []);

    // Animation effect for tank change
    useEffect(() => {
        setAnimateIn(false);
        const timer = setTimeout(() => {
            setAnimateIn(true);
        }, 100);
        return () => clearTimeout(timer);
    }, [selectedIndex]);

    if (loading) {
        return <LoadingScreen title={'Initializing Tanks'} message={'Retrieving tank data from the tactical warfare network... Please wait.'} />;
    }

    if (error) {
        return <ErrorScreen error={error} />;
    }

    const selectedTank = tanksData[selectedIndex];
    const TankComponent = tankComponentMap[selectedTank.codeName];

    const goNext = () => setSelectedIndex((prev) => (prev + 1) % tanksData.length);
    const goPrev = () => setSelectedIndex((prev) => (prev - 1 + tanksData.length) % tanksData.length);

    const handleSelect = () => {
        sessionStorage.setItem('tank', JSON.stringify(selectedTank));
        navigate('/tanki.io/controller');
    };

    // Common props to pass to layout components
    const layoutProps = {
        selectedTank,
        tankRotation,
        animateIn,
        tanksData,
        selectedIndex,
        goNext,
        goPrev,
        handleSelect,
        TankComponent
    };

    return (
        <div ref={rootRef} className="flex flex-col h-screen bg-gray-900 text-white overflow-hidden">
            <FullscreenController />
            <NavBar
                themeColor={selectedTank.color}
                title="TANKI SELECTION"
                version="SYSTEM v2.5"
            />

            {isPortrait ? (
                <PortraitLayout {...layoutProps} />
            ) : (
                <LandscapeLayout {...layoutProps} />
            )}
        </div>
    );
}

export default TankSelection;