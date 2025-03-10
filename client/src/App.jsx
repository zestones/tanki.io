import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'

import Home from './pages/home-page'
import Game from './pages/game-page'
import Controller from './pages/controller-page'

function App() {

  return (
    <Router>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/screen' element={<Game />} />
        <Route path='/controller' element={<Controller />} />
      </Routes>
    </Router>
  )
}

export default App
