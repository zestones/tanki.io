import { ArrowRight } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useResponsiveUtils from '../hooks/useResponsiveUtils';

import NavBar from '../components/mobile/layout/NavBar';
import TankDetails from '../components/mobile/tankSelection/TankDetails';
import TankPreview from '../components/mobile/tankSelection/TankPreview';
import TankStats from '../components/mobile/tankSelection/TankStats';
import FullscreenController from '../components/mobile/utils/FullscreenStateManager';

import { config } from '../config/config';
import { tankComponentMap } from '../utils/tankComponentMap';

import ErrorScreen from '../components/common/ErrorScreen';
import LoadingScreen from '../components/common/LoadingScreen';

function TankSelection() {
    const rootRef = useRef(null);

    // Use our custom responsive hooks
    const {
        isPortrait,
        isVerySmallScreen,
        isSmallScreen,
        layoutSpacing,
        utils
    } = useResponsiveUtils();

    const navigate = useNavigate();

    const [selectedIndex, setSelectedIndex] = useState(0);
    const [tankRotation, setTankRotation] = useState(0);
    const [animateIn, setAnimateIn] = useState(false);
    const [tanksData, setTanksData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Determine appropriate layout size based on screen size
    const getResponsiveLayoutSize = () => {
        if (isVerySmallScreen) return 'xs';
        if (isSmallScreen) return 'sm';
        return 'md';
    };

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

    return (
        <div ref={rootRef} className="flex flex-col h-screen bg-gray-900 text-white overflow-hidden">
            <FullscreenController />
            <NavBar
                themeColor={selectedTank.color}
                title="TANKI SELECTION"
                version="SYSTEM v2.5"
            />

            {isPortrait ? (
                // Portrait layout
                <div className="flex-grow flex flex-col">
                    <div className={`${utils.getPadding(isVerySmallScreen ? 'xs' : 'sm', 'x')} ${layoutSpacing.header} transition-opacity duration-300 ${animateIn ? 'opacity-100' : 'opacity-0'}`}>
                        <div className="flex items-baseline">
                            <h2 className={`${utils.getFontSize('xl')} font-bold`}>{selectedTank.name}</h2>
                            <span className="ml-2 text-xs font-mono text-gray-400">{selectedTank.codeName}</span>
                        </div>
                        <div className="flex items-center mt-1">
                            <div className="w-2 h-2 mr-2 rounded-sm" style={{ backgroundColor: selectedTank.color }}></div>
                            <span className="text-xs font-medium" style={{ color: selectedTank.color }}>
                                {selectedTank.classification}
                            </span>
                        </div>
                    </div>

                    <TankPreview
                        selectedTank={selectedTank}
                        tankRotation={tankRotation}
                        animateIn={animateIn}
                        onNext={goNext}
                        onPrev={goPrev}
                        TankComponent={TankComponent}
                        layoutSize={getResponsiveLayoutSize()}
                    />

                    <div className="flex justify-center space-x-1.5 mb-1.5">
                        {tanksData.map((tank, index) => (
                            <div
                                key={tank.codeName}
                                className={`h-1 transition-all duration-300 ${selectedIndex === index ? 'w-6' : 'w-3 bg-gray-700'}`}
                                style={selectedIndex === index ? { backgroundColor: tank.color } : {}}
                            ></div>
                        ))}
                    </div>

                    <TankStats
                        selectedTank={selectedTank}
                        spacing={layoutSpacing.section}
                    />

                    <TankDetails
                        selectedTank={selectedTank}
                        animateIn={animateIn}
                        isSmallScreen={isVerySmallScreen}
                    />
                </div>
            ) : (
                // Landscape layout - optimized for side-by-side content
                <div className="flex-grow flex flex-row overflow-hidden">
                    {/* Left section - Tank preview and stats */}
                    <div className={`${isVerySmallScreen ? 'w-[60%]' : 'w-[55%]'} flex flex-col`}>
                        <div className={`${utils.getPadding('xs')} transition-opacity duration-300 ${animateIn ? 'opacity-100' : 'opacity-0'}`}>
                            <div className="flex items-baseline">
                                <h2 className={`${utils.getFontSize('lg')} font-bold`}>{selectedTank.name}</h2>
                                <span className="ml-1.5 text-xs font-mono text-gray-400">{selectedTank.codeName}</span>
                            </div>
                            <div className="flex items-center mt-0.5">
                                <div className="w-1.5 h-1.5 mr-1.5 rounded-sm" style={{ backgroundColor: selectedTank.color }}></div>
                                <span className="text-xs font-medium" style={{ color: selectedTank.color }}>
                                    {selectedTank.classification}
                                </span>
                            </div>
                        </div>

                        <div className="flex-grow flex flex-col">
                            <TankPreview
                                selectedTank={selectedTank}
                                tankRotation={tankRotation}
                                animateIn={animateIn}
                                onNext={goNext}
                                onPrev={goPrev}
                                TankComponent={TankComponent}
                                layoutSize={isVerySmallScreen ? 'xs' : 'sm'}
                            />

                            <div className="flex justify-center space-x-1.5 my-1">
                                {tanksData.map((tank, index) => (
                                    <div
                                        key={tank.codeName}
                                        className={`h-1 transition-all duration-300 ${selectedIndex === index ? 'w-5' : 'w-2.5 bg-gray-700'}`}
                                        style={selectedIndex === index ? { backgroundColor: tank.color } : {}}
                                    ></div>
                                ))}
                            </div>

                            <TankStats
                                selectedTank={selectedTank}
                                spacing={utils.getPadding('xs')}
                            />
                        </div>
                    </div>

                    {/* Right section - Tank details */}
                    <div className={`${isVerySmallScreen ? 'w-[40%]' : 'w-[45%]'} border-l border-gray-800 overflow-hidden flex flex-col`}>
                        <TankDetails
                            selectedTank={selectedTank}
                            animateIn={animateIn}
                            isSmallScreen={true}
                            isLandscape={true}
                            isVerySmallScreen={isVerySmallScreen}
                        />

                        {/* Action button - positioned at the bottom in landscape */}
                        <div className="pb-2 px-3 border-t border-gray-800 bg-black bg-opacity-50 mt-auto">
                            <button
                                onClick={handleSelect}
                                className={`w-full ${utils.getButtonSize('sm')} flex items-center justify-center transition-all duration-300 transform`}
                                style={{
                                    backgroundColor: selectedTank.color,
                                    boxShadow: `0 0 15px ${selectedTank.color}80`
                                }}
                            >
                                <span className="font-bold tracking-wider mr-2 text-sm">DEPLOY</span>
                                <ArrowRight size={utils.getIconSize('xs')} />
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Action button for portrait mode */}
            {isPortrait && (
                <div className={`${layoutSpacing.section} bg-black bg-opacity-80 border-t border-gray-800`}>
                    <button
                        onClick={handleSelect}
                        className={`w-full ${utils.getButtonSize('md')} flex items-center justify-center transition-all duration-300 transform`}
                        style={{
                            backgroundColor: selectedTank.color,
                            boxShadow: `0 0 20px ${selectedTank.color}80`
                        }}
                    >
                        <span className="font-bold tracking-wider mr-2">DEPLOY</span>
                        <ArrowRight size={utils.getIconSize('sm')} />
                    </button>
                </div>
            )}
        </div>
    );
}

export default TankSelection;