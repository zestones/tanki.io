import React, { useEffect, useState } from 'react';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import FullscreenModal from './components/mobile/modal/FullscreenModal';
import { FullscreenProvider, useFullscreenContext } from './contexts/FullscreenContext';

import Controller from './pages/Controller';
import Game from './pages/Game';
import Home from './pages/Home';
import TankClassSelection from './pages/TankSelection';


function App() {
  return (
    <FullscreenProvider>
      <AppContent />
    </FullscreenProvider>
  );
}

function AppContent() {
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
          <div className={`absolute inset-0 z-10 transition-opacity duration-1000`}>
            <Router>
              <Routes>
                <Route path='/tanki.io/' element={<Home themeColor={themeColor} />} />
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
