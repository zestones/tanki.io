import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { FullscreenProvider, useFullscreenContext } from './contexts/FullscreenContext';
import IntroAnimation from './components/IntroAnimation';
import FullscreenModal from './components/mobile/modal/FullscreenModal';

import Home from './pages/Home';
import Game from './pages/Game';
import Controller from './pages/Controller';
import TankClassSelection from './pages/TankSelection';


function App() {
  return (
    <FullscreenProvider>
      <AppContent />
    </FullscreenProvider>
  );
}

function AppContent() {
  const [loadingPhase, setLoadingPhase] = useState('intro'); // 'intro', 'transitioning', 'complete'
  const [showFullscreenModal, setShowFullscreenModal] = useState(false);
  const [fullscreenHandled, setFullscreenHandled] = useState(false);
  const { isFullscreen, enterFullscreen } = useFullscreenContext();

  useEffect(() => {
    if (!isFullscreen) {
      setShowFullscreenModal(true);
    } else {
      setFullscreenHandled(true);
    }
  }, [isFullscreen]);

  const enableFullscreen = () => {
    enterFullscreen(document.documentElement);
    setShowFullscreenModal(false);
    sessionStorage.setItem('preferFullscreen', 'true');
    setFullscreenHandled(true);
  };

  const dismissFullscreenModal = () => {
    localStorage.setItem('fullscreenDismissed', 'true');
    setShowFullscreenModal(false);
    setFullscreenHandled(true);
  };

  const handleLoadingComplete = () => {
    setLoadingPhase('transitioning');
    setTimeout(() => {
      setLoadingPhase('complete');
    }, 500);
  };

  const themeColor = "#3498db";

  return (
    <>
      {showFullscreenModal && (
        <FullscreenModal
          onEnable={enableFullscreen}
          onDismiss={dismissFullscreenModal}
          themeColor={themeColor}
        />
      )}

      {fullscreenHandled && (
        <div className="relative w-full h-screen overflow-hidden">
          <div className={`absolute inset-0 z-20 transition-opacity duration-1000 ${loadingPhase !== 'intro' ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
            <IntroAnimation onLoadComplete={handleLoadingComplete} />
          </div>

          <div className={`absolute inset-0 z-10 transition-opacity duration-1000 ${loadingPhase === 'intro' ? 'opacity-0' : 'opacity-100'}`}>
            <Router>
              <Routes>
                <Route path='/tanki.io/' element={<Home animateIn={loadingPhase !== 'intro'} themeColor={themeColor} />} />
                <Route path='/tanki.io/game' element={<Game />} />
                <Route path='/tanki.io/controller' element={<Controller />} />
                <Route path='/tanki.io/tank-selection' element={<TankClassSelection />} />
              </Routes>
            </Router>
          </div>
        </div>
      )}
    </>
  );
}

export default App;
