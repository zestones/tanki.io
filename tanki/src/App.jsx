import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'

import AuthPage from './pages/auth-page'
import GameScreen from './pages/game-screen-page'
import ControllerPage from './pages/controller-page'

function App() {

  return (
    <Router>
      <Routes>
        <Route path='/' element={<AuthPage />} />
        <Route path='/screen' element={<GameScreen />} />
        <Route path='/controller' element={<ControllerPage />} />
      </Routes>
    </Router>
  )
}

export default App
