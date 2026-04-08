import React from 'react';
import Aurora from './components/Aurora';
import Sidebar from './components/Sidebar';
import ChatArea from './components/ChatArea';
import BlurText from './components/BlurText';

function App() {
  return (
    <div className="relative w-full h-screen bg-[#050505] text-white selection:bg-indigo-500/30 overflow-hidden font-sans flex flex-col">
      <div className="fixed inset-0 z-0 pointer-events-none">
        <Aurora colorStops={['#3B82F6', '#8B5CF6', '#10B981']} amplitude={0.5} speed={0.5} blend={0.6} />
      </div>

      <header className="relative z-10 w-full pt-6 shrink-0 text-center flex flex-col items-center gap-2">
        <div className="inline-block px-4 py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-md text-[10px] sm:text-xs font-semibold uppercase tracking-widest text-indigo-300 shadow-lg shadow-indigo-500/10">
          Secure Offline Chat with your Files
        </div>
        <BlurText
          text="PrivateBrain."
          delay={80}
          animateBy="letters"
          className="text-4xl md:text-5xl font-black tracking-tighter text-white"
        />
      </header>

      <div className="relative z-10 flex w-full flex-1 p-4 lg:p-6 gap-4 lg:gap-6 min-h-0">
        <Sidebar />
        <ChatArea />
      </div>
    </div>
  );
}

export default App;
