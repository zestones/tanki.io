import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'

import AuthPage from './pages/auth-page'
import GameScreen from './pages/game-screen'

function App() {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<AuthPage />} />
        <Route path='/screen' element={<GameScreen />} />
      </Routes>
    </Router>
  );
}

export default App
