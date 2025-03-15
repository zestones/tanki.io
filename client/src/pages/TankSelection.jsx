import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

import FullscreenController from '../components/mobile/utils/FullscreenStateManager';
import NavBar from '../components/mobile/layout/NavBar';
import TankPreview from '../components/mobile/tankSelection/TankPreview';
import TankStats from '../components/mobile/tankSelection/TankStats';
import TankDetails from '../components/mobile/tankSelection/TankDetails';

// Import client-side tank components for rendering
import { tankComponentMap } from '../utils/tankComponentMap';

import useLayoutSpacing from '../hooks/useLayoutSpacing';
import useViewportSize from '../hooks/useViewportSize';
import { config } from '../config/config';

function TankSelection() {
    const rootRef = useRef(null);
    const { height } = useViewportSize(rootRef);
    const { layoutSize, spacing } = useLayoutSpacing(height);
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
                console.log(data);

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

                // Fallback to client-side data if server fetch fails
                setTanksData(tankComponents);
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

    // Return loading state if tanks not yet loaded
    if (loading) {
        return (
            <div className="flex flex-col h-screen bg-gray-900 text-white items-center justify-center">
                <div className="animate-spin w-12 h-12 border-4 border-t-blue-500 rounded-full"></div>
                <p className="mt-4">Loading tanks data...</p>
            </div>
        );
    }

    // Return error state if failed to load tanks
    if (error) {
        return (
            <div className="flex flex-col h-screen bg-gray-900 text-white items-center justify-center">
                <p className="text-red-500">Error loading tanks: {error}</p>
                <button
                    onClick={() => window.location.reload()}
                    className="mt-4 px-4 py-2 bg-blue-500 rounded"
                >
                    Retry
                </button>
            </div>
        );
    }

    const selectedTank = tanksData[selectedIndex];
    const TankComponent = tankComponentMap[selectedTank.codeName];

    const goNext = () => setSelectedIndex((prev) => (prev + 1) % tanksData.length);
    const goPrev = () => setSelectedIndex((prev) => (prev - 1 + tanksData.length) % tanksData.length);

    // Pass selected tank to game controller
    const handleSelect = () => {
        // Store selected tank type in session storage or context
        sessionStorage.setItem('tank-type', selectedTank.codeName);
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

            <div className="flex-grow flex flex-col">
                <div className={`px-4 ${spacing.header} transition-opacity duration-300 ${animateIn ? 'opacity-100' : 'opacity-0'}`}>
                    <div className="flex items-baseline">
                        <h2 className="text-2xl font-bold">{selectedTank.name}</h2>
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
                    layoutSize={layoutSize}
                    spacing={spacing}
                />

                <div className="flex justify-center space-x-2 mb-2">
                    {tanksData.map((tank, index) => (
                        <div
                            key={tank.codeName}
                            className={`h-1 transition-all duration-300 ${selectedIndex === index ? 'w-8 bg-blue-400' : 'w-4 bg-gray-700'}`}
                            style={selectedIndex === index ? { backgroundColor: tank.color } : {}}
                        ></div>
                    ))}
                </div>

                <TankStats
                    selectedTank={selectedTank}
                    spacing={spacing}
                />

                <TankDetails
                    selectedTank={selectedTank}
                    animateIn={animateIn}
                />
            </div>

            <div className={`${spacing.actionButtons} bg-black bg-opacity-80 border-t border-gray-800`}>
                <button
                    onClick={handleSelect}
                    className="w-full py-3 flex items-center justify-center transition-all duration-300 transform"
                    style={{
                        backgroundColor: selectedTank.color,
                        boxShadow: `0 0 20px ${selectedTank.color}80`
                    }}
                >
                    <span className="font-bold tracking-wider mr-2">DEPLOY</span>
                    <ArrowRight size={16} />
                </button>
            </div>
        </div>
    );
}

export default TankSelection;