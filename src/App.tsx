/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import SnakeGame from './components/SnakeGame';
import MusicPlayer from './components/MusicPlayer';

export default function App() {
  return (
    <div className="min-h-screen bg-black text-cyan-400 font-mono overflow-hidden relative flex flex-col items-center justify-center static-bg">
      {/* Glitch Overlay */}
      <div className="absolute inset-0 pointer-events-none bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0IiBoZWlnaHQ9IjQiPgo8cmVjdCB3aWR0aD0iNCIgaGVpZ2h0PSI0IiBmaWxsPSIjMDAwIi8+CjxyZWN0IHdpZHRoPSIxIiBoZWlnaHQ9IjEiIGZpbGw9IiMwZmYiLz4KPHJlY3QgeD0iMiIgeT0iMiIgd2lkdGg9IjEiIGhlaWdodD0iMSIgZmlsbD0iI2YwZiIvPgo8L3N2Zz4=')] opacity-20 mix-blend-screen" />
      
      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center w-full max-w-6xl px-4 py-8 gap-8 lg:flex-row lg:items-start lg:justify-center glitch-tear">
        
        {/* Left/Top Column: Title & Music Player */}
        <div className="flex flex-col items-center lg:items-start gap-8 w-full lg:w-1/3">
          <div className="text-center lg:text-left">
            <h1 className="text-6xl md:text-7xl font-black tracking-tighter mb-2 text-magenta-500 uppercase glitch-text" style={{ color: '#FF00FF', textShadow: '4px 4px 0 #00FFFF, -2px -2px 0 #00FFFF' }}>
              SYS.ERR
              <br />
              SNAKE
            </h1>
            <p className="text-cyan-400 font-mono text-2xl tracking-widest uppercase bg-black border-2 border-cyan-400 p-2 mt-4 inline-block">
              [AUDIO_SYNC_REQUIRED]
            </p>
          </div>

          <div className="w-full flex justify-center lg:justify-start">
            <MusicPlayer />
          </div>
        </div>

        {/* Right/Center Column: Game */}
        <div className="w-full lg:w-auto flex justify-center">
          <SnakeGame />
        </div>

      </div>
    </div>
  );
}
