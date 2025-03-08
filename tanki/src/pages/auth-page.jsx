import React, { useEffect, useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'

// WebSocket service for game connection
const WEBSOCKET_URL = 'ws://localhost:8080'

function AuthPage() {
  const [tanks, setTanks] = useState([])
  const [username, setUsername] = useState('')
  const [isConnecting, setIsConnecting] = useState(false)
  const [connectionError, setConnectionError] = useState('')
  const [serverStats, setServerStats] = useState({
    players: 0,
    uptime: 0,
  })

  const navigate = useNavigate()

  // Generate random tanks for background
  useEffect(() => {
    const newTanks = []
    for (let i = 0; i < 8; i++) {
      newTanks.push({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: 20 + Math.random() * 30,
        color: ['blue', 'red', 'green', 'purple', 'orange'][Math.floor(Math.random() * 5)],
        speed: 0.1 + Math.random() * 1.0,
        direction: Math.random() * 360,
      })
    }
    setTanks(newTanks)

    const interval = setInterval(() => {
      setTanks((prevTanks) =>
        prevTanks.map((tank) => ({
          ...tank,
          x: (tank.x + Math.cos(tank.direction * (Math.PI / 180)) * tank.speed + 100) % 100,
          y: (tank.y + Math.sin(tank.direction * (Math.PI / 180)) * tank.speed + 100) % 100,
        })),
      )
    }, 50)

    // Fetch server stats on load
    fetchServerStats()

    return () => clearInterval(interval)
  }, [])

  // Fetch server stats (simulated here, will be replaced with actual WebSocket data)
  const fetchServerStats = useCallback(() => {
    try {
      const socket = new WebSocket(WEBSOCKET_URL)

      socket.onopen = () => {
        console.log('Connected to server for stats')
        // Just ping for stats
        socket.send(JSON.stringify({ type: 'stats-request' }))
      }

      socket.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data)
          if (data.type === 'server-stats-response') {
            console.log('Received server stats:', data)
            setServerStats({
              players: data.data.players || 0,
              uptime: data.data.arenas || 0,
            })
          }
          socket.close()
        } catch (e) {
          console.error('Error parsing server stats:', e)
        }
      }

      socket.onerror = () => {
        socket.close()
      }
    } catch (error) {
      console.error('Could not connect to server for stats:', error)
    }
  }, [])

  // Handle form submission and WebSocket connection
  const handleSubmit = useCallback(
    (e) => {
      e.preventDefault()

      if (!username.trim()) {
        setConnectionError('Please enter a username')
        return
      }

      setIsConnecting(true)
      setConnectionError('')

      try {
        // Create a WebSocket connection
        const socket = new WebSocket(WEBSOCKET_URL)

        // Store socket in sessionStorage for access in game screen
        // Note: We're storing just a flag here. The actual socket will be recreated in GameScreen.

        socket.onopen = () => {
          console.log('Connected to game server')

          // Send join message with username
          socket.send(
            JSON.stringify({
              type: 'register-request',
              username: username,
            }),
          )

          // Store player info in sessionStorage
          sessionStorage.setItem('diep_username', username)

          // Close this connection - we'll create a new one in the game screen
          socket.close()

          // Navigate to game screen
          // navigate('/screen');
        }

        socket.onclose = () => {
          setIsConnecting(false)
        }

        socket.onerror = () => {
          setConnectionError('Failed to connect to game server')
          setIsConnecting(false)
          socket.close()
        }
      } catch (error) {
        console.error('WebSocket connection error:', error)
        setConnectionError('Failed to connect to game server')
        setIsConnecting(false)
      }
    },
    [username, navigate],
  )

  return (
    <div className='min-h-screen bg-gradient-to-b from-gray-900 to-black relative overflow-hidden'>
      {/* Animated grid background */}
      <div
        className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAwIDEwIEwgNDAgMTAgTSAxMCAwIEwgMTAgNDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSg4MSwgODEsIDgxLCAwLjIpIiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')]
                  opacity-30"
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

      {/* Floating particles */}
      <div className='absolute w-2 h-2 bg-blue-500 rounded-full top-1/4 left-1/4 animate-ping opacity-70'></div>
      <div
        className='absolute w-3 h-3 bg-green-500 rounded-full top-3/4 left-1/3 animate-ping opacity-70'
        style={{ animationDelay: '0.5s' }}
      ></div>
      <div
        className='absolute w-2 h-2 bg-red-500 rounded-full top-2/3 right-1/3 animate-ping opacity-70'
        style={{ animationDelay: '1s' }}
      ></div>
      <div
        className='absolute w-4 h-4 bg-purple-500 rounded-full bottom-1/4 right-1/4 animate-ping opacity-70'
        style={{ animationDelay: '1.5s' }}
      ></div>

      {/* Animated glowing orbs */}
      <div className='absolute top-20 left-10 w-24 h-24 bg-blue-500 rounded-full filter blur-3xl opacity-10 animate-pulse'></div>
      <div
        className='absolute bottom-20 right-10 w-32 h-32 bg-purple-500 rounded-full filter blur-3xl opacity-10 animate-pulse'
        style={{ animationDelay: '1s' }}
      ></div>

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
                disabled={isConnecting}
              />
              <div className='absolute inset-0 rounded-xl border border-blue-500/30 opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity'></div>
            </div>

            {connectionError && <div className='text-red-500 text-sm text-center'>{connectionError}</div>}

            <button
              type='submit'
              disabled={isConnecting}
              className='w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold py-4 px-6 rounded-xl transition duration-300 transform hover:scale-105 focus:outline-none shadow-lg shadow-blue-900/20 relative overflow-hidden group disabled:opacity-70'
            >
              <span className='absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-400 opacity-0 group-hover:opacity-30 transition-opacity'></span>
              <span className='relative flex items-center justify-center'>
                {isConnecting ? (
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

          {/* Connection status */}
          <div className='mt-4 flex items-center justify-center'>
            <div className={`w-2 h-2 rounded-full ${isConnecting ? 'bg-yellow-500' : 'bg-green-500'} mr-2`}></div>
            <span className='text-xs text-gray-400'>{isConnecting ? 'Connecting to server...' : 'Server online'}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AuthPage;