import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { FullscreenProvider } from './contexts/FullscreenContext';

import Home from './pages/Home';
import Game from './pages/Game';
import Controller from './pages/Controller';
import TankClassSelection from './pages/TankSelection';

function App() {
  return (
    <FullscreenProvider>
      <Router>
        <Routes>
          <Route path='/tanki.io/' element={<Home />} />
          <Route path='/tanki.io/game' element={<Game />} />
          <Route path='/tanki.io/controller' element={<Controller />} />
          <Route path='/tanki.io/tank-selection' element={<TankClassSelection />} />
        </Routes>
      </Router>
    </FullscreenProvider>
  );
}

export default App;
