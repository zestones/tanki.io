import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

import Home from './pages/Home'
import Game from './pages/Game'
import Controller from './pages/Controller'

function App() {

  return (
    <Router>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/game' element={<Game />} />
        <Route path='/controller' element={<Controller />} />
      </Routes>
    </Router>
  )
}

export default App
