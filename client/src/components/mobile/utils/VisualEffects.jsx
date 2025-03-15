import React from 'react';

export function BackgroundEffects() {
  return (
    <>
      {/* Background hexagon grid */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="rhodes-hexagon-pattern"></div>
      </div>

      {/* Vignette effect */}
      <div className="absolute inset-0 bg-gradient-radial from-transparent to-black opacity-70 pointer-events-none"></div>

      {/* Scanline effect */}
      <div className="scanline pointer-events-none"></div>

      {/* Blue pulse effect */}
      <div className="absolute inset-0 blue-pulse-effect pointer-events-none"></div>

      <style jsx="true">{`
        .scanline {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: linear-gradient(to bottom, transparent, rgba(30, 64, 175, 0.02), transparent);
          pointer-events: none;
          animation: scanline 8s linear infinite;
          z-index: 40;
          opacity: 0.5;
        }
        
        .blue-pulse-effect {
          background: radial-gradient(circle, rgba(37, 99, 235, 0) 0%, rgba(37, 99, 235, 0) 70%, rgba(37, 99, 235, 0.1) 100%);
          animation: pulse 4s ease-in-out infinite;
        }
        
        .rhodes-hexagon-pattern {
          background-image: url("data:image/svg+xml,%3Csvg width='60' height='60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 5L55 20L55 40L30 55L5 40L5 20L30 5Z' stroke='%230369a1' fill='none' stroke-opacity='0.2'/%3E%3C/svg%3E");
          background-size: 60px 60px;
          width: 100%;
          height: 100%;
        }
        
        @keyframes scanline {
          0% {
            transform: translateY(-100%);
          }
          100% {
            transform: translateY(100%);
          }
        }
        
        @keyframes pulse {
          0% {
            opacity: 0.3;
            transform: scale(0.98);
          }
          50% {
            opacity: 0.4;
            transform: scale(1);
          }
          100% {
            opacity: 0.3;
            transform: scale(0.98);
          }
        }
      `}</style>
    </>
  );
}

export function CornerDecorations() {
  return (
    <>
      <div className="absolute top-0 left-0 w-24 h-24 pointer-events-none">
        <svg viewBox="0 0 100 100" className="w-full h-full text-blue-500/60">
          <path d="M0,20 L20,20 L20,0" fill="none" stroke="currentColor" strokeWidth="2" />
          <path d="M0,40 L40,40 L40,0" fill="none" stroke="currentColor" strokeWidth="1" />
        </svg>
      </div>
      <div className="absolute top-0 right-0 w-24 h-24 pointer-events-none">
        <svg viewBox="0 0 100 100" className="w-full h-full text-blue-500/60">
          <path d="M100,20 L80,20 L80,0" fill="none" stroke="currentColor" strokeWidth="2" />
          <path d="M100,40 L60,40 L60,0" fill="none" stroke="currentColor" strokeWidth="1" />
        </svg>
      </div>
      <div className="absolute bottom-0 left-0 w-24 h-24 pointer-events-none">
        <svg viewBox="0 0 100 100" className="w-full h-full text-blue-500/60">
          <path d="M0,80 L20,80 L20,100" fill="none" stroke="currentColor" strokeWidth="2" />
          <path d="M0,60 L40,60 L40,100" fill="none" stroke="currentColor" strokeWidth="1" />
        </svg>
      </div>
      <div className="absolute bottom-0 right-0 w-24 h-24 pointer-events-none">
        <svg viewBox="0 0 100 100" className="w-full h-full text-blue-500/60">
          <path d="M100,80 L80,80 L80,100" fill="none" stroke="currentColor" strokeWidth="2" />
          <path d="M100,60 L60,60 L60,100" fill="none" stroke="currentColor" strokeWidth="1" />
        </svg>
      </div>
    </>
  );
}

export function SidePanels() {
  return (
    <>
      {/* Side decorative panel - left */}
      <div className="fixed left-4 top-1/4 bottom-1/4 w-1 flex flex-col justify-between pointer-events-none">
        <div className="h-1/3 w-full bg-gradient-to-b from-transparent to-blue-500/30"></div>
        <div className="h-8 w-8 border border-blue-500/50 -ml-4 flex items-center justify-center">
          <div className="h-1 w-1 bg-blue-400 animate-pulse"></div>
        </div>
        <div className="h-1/3 w-full bg-gradient-to-b from-blue-500/30 to-transparent"></div>
      </div>

      {/* Side decorative panel - right */}
      <div className="fixed right-4 top-1/4 bottom-1/4 w-1 flex flex-col justify-between pointer-events-none">
        <div className="h-1/3 w-full bg-gradient-to-b from-transparent to-blue-500/30"></div>
        <div className="h-8 w-8 border border-blue-500/50 -mr-4 flex items-center justify-center">
          <div className="h-1 w-1 bg-blue-400 animate-pulse"></div>
        </div>
        <div className="h-1/3 w-full bg-gradient-to-b from-blue-500/30 to-transparent"></div>
      </div>
    </>
  );
}
