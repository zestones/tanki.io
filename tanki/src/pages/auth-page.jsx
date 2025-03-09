import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { WEBSOCKET_CONFIG } from '../config/websocket.config';
import { useGameService } from '../hooks/useGameService';

function AuthPage() {
  const [tanks, setTanks] = useState([]);
  const [username, setUsername] = useState('');
  const navigate = useNavigate();

  const {
    isLoading,
    error,
    serverStats,
    fetchServerStats,
    registerPlayer,
  } = useGameService(WEBSOCKET_CONFIG.SERVER_URL);

  const updateTankPositions = (prevTanks) => {
    return prevTanks.map((tank) => ({
      ...tank,
      x: (tank.x + Math.cos(tank.direction * (Math.PI / 180)) * tank.speed + 100) % 100,
      y: (tank.y + Math.sin(tank.direction * (Math.PI / 180)) * tank.speed + 100) % 100,
    }));
  };

  // Generate random tanks for background
  useEffect(() => {
    const newTanks = [];
    for (let i = 0; i < 8; i++) {
      newTanks.push({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: 20 + Math.random() * 30,
        color: ['blue', 'red', 'green', 'purple', 'orange'][Math.floor(Math.random() * 5)],
        speed: 0.1 + Math.random() * 1.0,
        direction: Math.random() * 360,
      });
    }
    setTanks(newTanks);

    const interval = setInterval(() => {
      setTanks(updateTankPositions);
    }, 50);

    // Fetch server stats on load
    fetchServerStats();

    return () => clearInterval(interval);
  }, [fetchServerStats]);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!username.trim()) {
      return;
    }

    const result = await registerPlayer(username);

    if (result.success) {
      navigate('/screen');
    }
  };

  return (
    <div className='min-h-screen bg-gradient-to-b from-gray-900 to-black relative overflow-hidden'>
      {/* Animated grid background */}
      <div
        className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAwIDEwIEwgNDAgMTAgTSAxMCAwIEwgMTAgNDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSg4MSwgODEsIDgxLCAwLjIpIiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-30"
      ></div>

      {/* Moving tanks in the background */}
      {tanks.map((tank) => (
        <div
          key={tank.id}
          className='absolute opacity-20 transform -translate-x-1/2 -translate-y-1/2'
          style={{
            left: `${tank.x}%`,
            top: `${tank.y}%`,
            transform: `translate(-50%, -50%) rotate(${tank.direction}deg)`,
          }}
        >
          <div className={`bg-${tank.color}-500 rounded-md`} style={{ width: `${tank.size}px`, height: `${tank.size * 0.8}px` }}></div>
          <div
            className={`bg-${tank.color}-500 h-3 rounded-full absolute top-1/2 left-full transform -translate-y-1/2`}
            style={{ width: `${tank.size * 0.7}px` }}
          ></div>
        </div>
      ))}

      {/* Floating particles and other UI elements omitted for brevity */}
      <div className='flex min-h-screen items-center justify-center p-6'>
        <div className='w-full max-w-sm bg-black/40 backdrop-blur-lg p-6 rounded-3xl border border-gray-700 shadow-2xl relative z-10'>
          {/* Logo with tank icon */}
          <div className='text-center mb-8 relative'>
            <div className='absolute w-16 h-16 mx-auto bg-blue-500/30 rounded-full left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 filter blur-xl animate-pulse'></div>
            <div className='relative mb-2 flex justify-center'>
              <div className='w-14 h-10 bg-blue-500 rounded-md relative'>
                <div className='absolute h-3 w-8 bg-blue-500 top-1/2 left-full transform -translate-y-1/2 rounded-full'></div>
              </div>
            </div>
            <h1 className='text-4xl font-bold text-white mb-1'>
              <span className='bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600'>TANKI.IO</span>
            </h1>
            <p className='text-blue-300/80 text-sm uppercase tracking-widest font-medium'>Battle Arena</p>
          </div>

          {/* Username Form with WebSocket connectivity */}
          <form className='space-y-5' onSubmit={handleSubmit}>
            <div className='group relative'>
              <input
                type='text'
                placeholder='Enter Username'
                className='w-full px-5 py-4 bg-gray-900/60 rounded-xl border border-gray-700 focus:border-blue-500 text-white placeholder-gray-500 transition-all duration-300 outline-none group-hover:border-blue-400/50 text-center'
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                disabled={isLoading}
              />
              <div className='absolute inset-0 rounded-xl border border-blue-500/30 opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity'></div>
            </div>

            {error && <div className='text-red-500 text-sm text-center'>{error}</div>}

            <button
              type='submit'
              disabled={isLoading}
              className='w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold py-4 px-6 rounded-xl transition duration-300 transform hover:scale-105 focus:outline-none shadow-lg shadow-blue-900/20 relative overflow-hidden group disabled:opacity-70'
            >
              <span className='absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-400 opacity-0 group-hover:opacity-30 transition-opacity'></span>
              <span className='relative flex items-center justify-center'>
                {isLoading ? (
                  <>
                    <svg
                      className='animate-spin -ml-1 mr-3 h-5 w-5 text-white'
                      xmlns='http://www.w3.org/2000/svg'
                      fill='none'
                      viewBox='0 0 24 24'
                    >
                      <circle className='opacity-25' cx='12' cy='12' r='10' stroke='currentColor' strokeWidth='4'></circle>
                      <path
                        className='opacity-75'
                        fill='currentColor'
                        d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
                      ></path>
                    </svg>
                    CONNECTING...
                  </>
                ) : (
                  'READY TO BATTLE'
                )}
              </span>
            </button>
          </form>

          {/* Stats with glow effect */}
          <div className='mt-8 bg-gray-900/40 rounded-xl p-4 border border-gray-800'>
            <div className='text-center text-xs text-gray-500 uppercase tracking-wide mb-2 font-medium'>Server Stats</div>
            <div className='flex justify-around'>
              <div className='text-center'>
                <div className='text-blue-400 text-lg font-bold'>{serverStats.players}</div>
                <div className='text-gray-500 text-xs'>Players</div>
              </div>
              <div className='text-center'>
                <div className='text-purple-400 text-lg font-bold'>{serverStats.uptime}</div>
                <div className='text-gray-500 text-xs'>Up Time</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AuthPage;