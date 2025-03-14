import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

import Home from './pages/Home'
import Game from './pages/Game'
import Controller from './pages/Controller'
import TankClassSelection from './pages/ClassSelection'

function App() {

  return (
    <Router>
      <Routes>
        <Route path='/tanki.io/' element={<Home />} />
        <Route path='/tanki.io/game' element={<Game />} />
        <Route path='/tanki.io/controller' element={<Controller />} />
        <Route path='/tanki.io/class-selection' element={<TankClassSelection />} />
      </Routes>
    </Router>
  )
}

export default App
