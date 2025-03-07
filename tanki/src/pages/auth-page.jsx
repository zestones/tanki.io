function AuthPage() {
  return (
    <div className='min-h-screen bg-[#1b1b1b] relative overflow-hidden'>
      {/* Animated Background Shapes */}
      <div className='absolute inset-0'>
        <div className='absolute w-32 h-32 bg-blue-500/10 rounded-lg rotate-45 top-20 left-20 animate-pulse'></div>
        <div className='absolute w-40 h-40 bg-red-500/10 rounded-full top-60 right-40 animate-bounce'></div>
        <div className='absolute w-24 h-24 bg-green-500/10 rotate-12 bottom-20 left-1/3 animate-ping'></div>
        <div className='absolute w-36 h-36 border-4 border-yellow-500/10 rounded-lg -rotate-12 bottom-40 right-1/4'></div>
        <div className='absolute w-28 h-28 bg-purple-500/10 rounded-full top-1/3 left-1/2 animate-pulse'></div>
      </div>

      <div className='flex min-h-screen items-center justify-center p-4'>
        <div className='w-full max-w-md bg-[#2d2d2d]/80 backdrop-blur-lg p-8 rounded-2xl border-2 border-blue-500/30 shadow-2xl relative z-10'>
          {/* Logo/Title Section */}
          <div className='text-center mb-8 relative'>
            <h1 className='text-5xl font-bold bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent mt-8'>
              DIEP CLONE
            </h1>
            <p className='text-gray-400 mt-2 text-lg'>Enter the Arena</p>
          </div>

          {/* Registration Form */}
          <form className='space-y-5'>
            <div className='group'>
              <input
                type='text'
                placeholder='Tank Commander Name'
                className='w-full px-5 py-4 bg-[#1b1b1b] rounded-lg border-2 border-gray-700 focus:border-blue-500 text-white placeholder-gray-500 transition-all duration-300 outline-none group-hover:border-blue-500/50'
              />
            </div>

            <div className='group'>
              <input
                type='email'
                placeholder='Command Center Email'
                className='w-full px-5 py-4 bg-[#1b1b1b] rounded-lg border-2 border-gray-700 focus:border-blue-500 text-white placeholder-gray-500 transition-all duration-300 outline-none group-hover:border-blue-500/50'
              />
            </div>

            <div className='group'>
              <input
                type='password'
                placeholder='Secret Code'
                className='w-full px-5 py-4 bg-[#1b1b1b] rounded-lg border-2 border-gray-700 focus:border-blue-500 text-white placeholder-gray-500 transition-all duration-300 outline-none group-hover:border-blue-500/50'
              />
            </div>

            <button className='w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white font-bold py-4 px-6 rounded-lg transition duration-300 transform hover:scale-105 hover:shadow-xl hover:from-blue-600 hover:to-purple-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-[#2d2d2d]'>
              DEPLOY TANK
            </button>
          </form>

          <div className='mt-6 text-center'>
            <p className='text-gray-400'>
              Already a Commander?{' '}
              <a href='/login' className='text-blue-500 hover:text-blue-400 font-semibold'>
                Login to Battle
              </a>
            </p>
          </div>

          {/* Decorative Elements */}
          <div className='absolute -bottom-6 left-1/2 transform -translate-x-1/2'>
            <div className='w-12 h-12 bg-blue-500 rounded-lg rotate-45 animate-bounce'></div>
          </div>
        </div>
      </div>

      {/* Floating Particles */}
      <div className='absolute top-0 left-0 w-full h-full pointer-events-none'>
        <div className='absolute w-2 h-2 bg-blue-500 rounded-full animate-float' style={{ top: '20%', left: '10%' }}></div>
        <div className='absolute w-2 h-2 bg-red-500 rounded-full animate-float' style={{ top: '60%', left: '80%' }}></div>
        <div className='absolute w-2 h-2 bg-green-500 rounded-full animate-float' style={{ top: '80%', left: '30%' }}></div>
        <div className='absolute w-2 h-2 bg-yellow-500 rounded-full animate-float' style={{ top: '40%', left: '60%' }}></div>
        <div className='absolute w-2 h-2 bg-purple-500 rounded-full animate-float' style={{ top: '30%', left: '40%' }}></div>
      </div>
    </div>
  )
}

export default AuthPage
