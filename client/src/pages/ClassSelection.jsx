import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ChevronRight, ChevronLeft, Info, ArrowRight, Clock, Shield, Zap, AlertTriangle, Star, Target, Hexagon } from 'lucide-react';
import ShredderTank from '../components/game/tanks/ShredderTank';
import GuardianTank from '../components/game/tanks/GuardianTank.jsx';
import JuggernautTank from '../components/game/tanks/JuggernautTank';
import ThunderboltTank from '../components/game/tanks/ThunderboltTank';
import SentinelTank from '../components/game/tanks/SentinelTank.jsx';

import { Stage, Layer } from 'react-konva';

function ClassSelection() {
    const navigate = useNavigate();
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [tankRotation, setTankRotation] = useState(0);
    const [animateIn, setAnimateIn] = useState(false);

    // Animation effect for tank rotation
    useEffect(() => {
        const interval = setInterval(() => {
            setTankRotation((prev) => (prev + 0.5) % 360);
        }, 50);
        return () => clearInterval(interval);
    }, []);

    // Animation effect for component mount
    useEffect(() => {
        setAnimateIn(true);
    }, []);

    // Animation effect for tank change
    useEffect(() => {
        setAnimateIn(false);
        const timer = setTimeout(() => {
            setAnimateIn(true);
        }, 100);
        return () => clearTimeout(timer);
    }, [selectedIndex]);

    // Tank data
    const tanks = [
        {
            name: "SENTINEL",
            codeName: "ST-N01",
            component: SentinelTank,
            description: "Standard tank with balanced stats and versatile combat capabilities.",
            stats: {
                health: 3,
                damage: 3,
                speed: 3,
                specialty: "Adaptive"
            },
            abilities: ["Armor Plating", "Adaptive Systems"],
            color: "#2ecc71",
            classification: "BALANCED",
            range: "Medium"
        },
        {
            name: "GUARDIAN",
            codeName: "GD-N02",
            component: GuardianTank,
            description: "Defensive specialist with reinforced plating and energy shield technology.",
            stats: {
                health: 5,
                damage: 2,
                speed: 3,
                specialty: "Shield Projection"
            },
            abilities: ["Energy Shield", "Reactive Armor"],
            color: "#3498db",
            classification: "DEFENDER",
            range: "Short"
        },
        {
            name: "SHREDDER",
            codeName: "SH-N03",
            component: ShredderTank,
            description: "Assault-class tank with rapid-fire capabilities and high maneuverability.",
            stats: {
                health: 3,
                damage: 5,
                speed: 4,
                specialty: "Area Damage"
            },
            abilities: ["Rapid Fire", "Afterburner"],
            color: "#e74c3c",
            classification: "ASSAULT",
            range: "Medium"
        },
        {
            name: "JUGGERNAUT",
            codeName: "JG-N04",
            component: JuggernautTank,
            description: "Heavy assault vehicle with superior armor and devastating firepower.",
            stats: {
                health: 4,
                damage: 5,
                speed: 2,
                specialty: "Breakthrough"
            },
            abilities: ["Ramming Speed", "Heavy Artillery"],
            color: "#f1c40f",
            classification: "HEAVY",
            range: "Long"
        },
        {
            name: "THUNDERBOLT",
            codeName: "TB-N05",
            component: ThunderboltTank,
            description: "Tactical strike vehicle specialized in hit-and-run operations.",
            stats: {
                health: 3,
                damage: 4,
                speed: 5,
                specialty: "EMP Strike"
            },
            abilities: ["Lightning Dash", "Static Field"],
            color: "#9b59b6",
            classification: "SCOUT",
            range: "Variable"
        },
    ];

    const selectedTank = tanks[selectedIndex];
    const TankComponent = selectedTank.component;

    const goNext = () => {
        setSelectedIndex((prev) => (prev + 1) % tanks.length);
    };

    const goPrev = () => {
        setSelectedIndex((prev) => (prev - 1 + tanks.length) % tanks.length);
    };

    const handleSelect = () => {
        navigate('/game', { state: { selectedTank: selectedTank.name } });
    };

    // Render hexagonal stat indicator
    const renderHexStat = (value, label, icon) => {
        const maxValue = 6;
        const percentage = Math.min((value / maxValue) * 100, 100);

        return (
            <div className="flex flex-col items-center">
                <div className="relative w-12 h-14 mb-1">
                    {/* Background hexagon */}
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-12 h-12 bg-gray-800 rounded-md transform rotate-45"></div>
                    </div>

                    {/* Foreground filled hexagon */}
                    <div className="absolute inset-0 flex items-center justify-center overflow-hidden"
                        style={{ clipPath: `polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)` }}>
                        <div
                            className="absolute bottom-0 w-12 transition-all duration-500 ease-out"
                            style={{
                                height: `${percentage}%`,
                                backgroundColor: selectedTank.color,
                                opacity: 0.7,
                                boxShadow: `0 0 10px ${selectedTank.color}`
                            }}
                        ></div>
                    </div>

                    {/* Icon */}
                    <div className="absolute inset-0 flex items-center justify-center text-white">
                        {icon}
                    </div>
                </div>
                <span className="text-xs text-gray-400">{label}</span>
                <span className="text-xs font-bold text-white">{value}</span>
            </div>
        );
    };

    // Render stat bars
    const renderStatBar = (value, maxValue = 6) => {
        return (
            <div className="w-full bg-gray-800 rounded-sm h-2 mt-1 overflow-hidden">
                <div
                    className="h-full transition-all duration-300"
                    style={{
                        width: `${(value / maxValue) * 100}%`,
                        backgroundColor: selectedTank.color,
                        boxShadow: `0 0 10px ${selectedTank.color}`
                    }}
                ></div>
            </div>
        );
    };

    return (
        <div className="flex flex-col min-h-screen bg-gray-900 text-white overflow-hidden">
            {/* Top navigation bar */}
            <div className="bg-black bg-opacity-70 py-2 px-4 flex justify-between items-center border-b border-gray-800">
                <div className="flex items-center">
                    <div className="w-1 h-5 mr-2" style={{ backgroundColor: selectedTank.color }}></div>
                    <h1 className="text-sm font-light tracking-widest">
                        TANK SELECTION
                    </h1>
                </div>
                <div className="text-xs text-gray-400 font-mono">
                    SYSTEM v2.5
                </div>
            </div>

            {/* Main content */}
            <div className="flex-grow flex flex-col">
                {/* Tank name and classification */}
                <div className={`px-4 pt-4 transition-opacity duration-300 ${animateIn ? 'opacity-100' : 'opacity-0'}`}>
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

                {/* Tank preview area */}
                <div className="relative flex-grow flex items-center justify-center my-2">
                    {/* Tank model */}
                    <div className={`transition-all duration-300 transform ${animateIn ? 'scale-100 opacity-100' : 'scale-90 opacity-0'}`}>
                        <Stage width={260} height={260}>
                            <Layer>
                                <TankComponent
                                    x={130}
                                    y={130}
                                    rotation={tankRotation}
                                    hp={selectedTank.stats.health}
                                    username={selectedTank.name}
                                    isDead={false}
                                />
                            </Layer>
                        </Stage>
                    </div>

                    {/* Navigation buttons */}
                    <button
                        onClick={goPrev}
                        className="absolute left-0 z-10 p-2 bg-black bg-opacity-20 text-white focus:outline-none"
                        style={{ borderRight: `2px solid ${selectedTank.color}` }}
                    >
                        <ChevronLeft size={20} />
                    </button>
                    <button
                        onClick={goNext}
                        className="absolute right-0 z-10 p-2 bg-black bg-opacity-20 text-white focus:outline-none"
                        style={{ borderLeft: `2px solid ${selectedTank.color}` }}
                    >
                        <ChevronRight size={20} />
                    </button>

                    {/* Hexagonal frame decoration */}
                    <div className="absolute inset-0 pointer-events-none">
                        <div className="absolute top-0 left-0 w-10 h-10 border-t-2 border-l-2 border-gray-700 opacity-70"></div>
                        <div className="absolute top-0 right-0 w-10 h-10 border-t-2 border-r-2 border-gray-700 opacity-70"></div>
                        <div className="absolute bottom-0 left-0 w-10 h-10 border-b-2 border-l-2 border-gray-700 opacity-70"></div>
                        <div className="absolute bottom-0 right-0 w-10 h-10 border-b-2 border-r-2 border-gray-700 opacity-70"></div>
                    </div>
                </div>

                {/* Selection indicator */}
                <div className="flex justify-center space-x-2 mb-2">
                    {tanks.map((tank, index) => (
                        <div
                            key={index}
                            className={`h-1 transition-all duration-300 ${selectedIndex === index ? 'w-8 bg-blue-400' : 'w-4 bg-gray-700'}`}
                            style={selectedIndex === index ? { backgroundColor: tank.color } : {}}
                        ></div>
                    ))}
                </div>

                {/* Stats hexagons */}
                <div className="flex justify-around px-8 py-4 bg-gray-900 bg-opacity-70">
                    {renderHexStat(selectedTank.stats.health, "HP", <Shield size={14} />)}
                    {renderHexStat(selectedTank.stats.damage, "DMG", <Target size={14} />)}
                    {renderHexStat(selectedTank.stats.speed, "SPD", <Zap size={14} />)}
                </div>

                {/* Details panel */}
                <div className="bg-black bg-opacity-70 flex-grow">
                    <div className="border-t border-gray-800" style={{ borderColor: selectedTank.color, opacity: 0.5 }}></div>

                    {/* Tabs-like header */}
                    <div className="flex border-b border-gray-800">
                        <div className="px-4 py-2 text-xs font-medium uppercase border-b-2"
                            style={{ borderColor: selectedTank.color }}>
                            Profile
                        </div>
                        <div className="px-4 py-2 text-xs text-gray-500">
                            Skills
                        </div>
                        <div className="px-4 py-2 text-xs text-gray-500">
                            Equipment
                        </div>
                    </div>

                    {/* Content area */}
                    <div className="p-4 space-y-4">
                        {/* Description */}
                        <div className={`transition-opacity duration-300 ${animateIn ? 'opacity-100' : 'opacity-0'}`}>
                            <div className="flex items-center mb-2">
                                <Info size={12} className="mr-2" style={{ color: selectedTank.color }} />
                                <h3 className="text-xs uppercase tracking-wider text-gray-400">Description</h3>
                            </div>
                            <p className="text-sm text-gray-300">{selectedTank.description}</p>
                        </div>

                        {/* Combat attributes */}
                        <div className={`transition-opacity duration-300 delay-100 ${animateIn ? 'opacity-100' : 'opacity-0'}`}>
                            <div className="flex items-center mb-2">
                                <Target size={12} className="mr-2" style={{ color: selectedTank.color }} />
                                <h3 className="text-xs uppercase tracking-wider text-gray-400">Combat Attributes</h3>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <div className="flex justify-between text-xs">
                                        <span className="text-gray-500">RANGE</span>
                                        <span className="text-white">{selectedTank.range}</span>
                                    </div>
                                    <div className="flex justify-between text-xs mt-2">
                                        <span className="text-gray-500">SPECIALTY</span>
                                        <span className="text-white">{selectedTank.stats.specialty}</span>
                                    </div>
                                </div>

                                <div>
                                    <div className="text-xs text-gray-500 mb-1">ABILITIES</div>
                                    <ul className="text-xs text-white">
                                        {selectedTank.abilities.map((ability, index) => (
                                            <li key={index} className="flex items-center">
                                                <span className="inline-block w-1 h-1 mr-1"
                                                    style={{ backgroundColor: selectedTank.color }}></span>
                                                {ability}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Deploy button */}
            <div className="p-4 bg-black bg-opacity-80 border-t border-gray-800">
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

export default ClassSelection;