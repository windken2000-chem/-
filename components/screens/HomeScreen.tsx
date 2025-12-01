import React, { useState } from 'react';
import { Subject } from '../../types';
import { SUBJECTS, STORY_CONFIG } from '../../constants';
import { GameButton } from '../ui/GameButton';
import { Play, Info } from 'lucide-react';

interface HomeScreenProps {
  onSelectSubject: (subject: Subject) => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({ onSelectSubject }) => {
  const [showIntro, setShowIntro] = useState(false);
  const [view, setView] = useState<'TITLE' | 'SELECT'>('TITLE');

  const handleStart = () => {
    setView('SELECT');
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-b from-sky-400 to-indigo-200 font-sans">
      {/* Visual Background Elements - Clouds & Floating Islands */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Clouds */}
        <div className="absolute top-[5%] left-[5%] opacity-90 animate-[float_6s_ease-in-out_infinite]">
            <div className="text-white text-9xl drop-shadow-lg opacity-80">☁️</div>
        </div>
        <div className="absolute top-[15%] right-[10%] opacity-70 animate-[float_8s_ease-in-out_infinite] delay-1000">
             <div className="text-white text-8xl drop-shadow-lg opacity-80">☁️</div>
        </div>
        <div className="absolute top-[50%] left-[10%] opacity-50 animate-[float_7s_ease-in-out_infinite] delay-500">
             <div className="text-white text-7xl drop-shadow-lg opacity-80">☁️</div>
        </div>

        {/* Floating Islands/Elements */}
        <div className="absolute bottom-0 left-0 w-full h-48 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-20"></div>
        <div className="absolute bottom-[-50px] left-[-50px] w-96 h-96 bg-green-400 rounded-full blur-3xl opacity-30 mix-blend-overlay"></div>
        <div className="absolute top-[-50px] right-[-50px] w-96 h-96 bg-yellow-300 rounded-full blur-3xl opacity-30 mix-blend-overlay"></div>
      </div>

      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center p-6">
        
        {view === 'TITLE' ? (
          <div className="text-center max-w-2xl animate-in fade-in zoom-in duration-700">
            <div className="mb-8 inline-block relative group cursor-default">
              {/* Mascot */}
              <div className="absolute -top-24 -right-12 text-[10rem] filter drop-shadow-2xl animate-[bounce_2s_infinite]">
                {STORY_CONFIG.mascotEmoji}
              </div>
              
              <h1 className="relative z-10 text-7xl md:text-9xl font-black text-white drop-shadow-[0_5px_15px_rgba(0,0,0,0.3)] tracking-tight leading-none rotate-[-2deg]"
                  style={{ textShadow: '4px 4px 0px #3b82f6, 8px 8px 0px #1e40af' }}>
                智慧<br/>王國
              </h1>
              <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-[140%] h-12 bg-black/20 rounded-[100%] blur-lg -z-10"></div>
            </div>
            
            <div className="bg-white/30 backdrop-blur-md px-10 py-3 rounded-full border-4 border-white/50 mb-14 inline-block shadow-xl transform rotate-1 hover:rotate-2 transition-transform">
              <p className="text-xl md:text-3xl text-indigo-900 font-black tracking-widest drop-shadow-sm">
                冒險與知識的起點
              </p>
            </div>

            <div className="flex flex-col gap-6 items-center">
              <GameButton 
                onClick={handleStart} 
                size="lg" 
                className="w-80 !text-4xl !py-8 animate-[pulse_3s_infinite]"
                colorClass="bg-yellow-400" 
                shadowClass="bg-yellow-600"
              >
                <div className="flex items-center justify-center gap-4 drop-shadow-md text-yellow-900">
                  <Play fill="currentColor" size={40} /> 出發冒險
                </div>
              </GameButton>
              
              <button 
                onClick={() => setShowIntro(!showIntro)}
                className="mt-2 text-white font-bold hover:text-yellow-200 flex items-center gap-2 bg-indigo-900/30 px-8 py-3 rounded-full hover:bg-indigo-900/50 transition-all border-2 border-white/30"
              >
                <Info size={24} /> <span className="text-xl">故事背景</span>
              </button>
            </div>

            {showIntro && (
              <div className="mt-8 bg-white/95 backdrop-blur-md p-8 rounded-[2.5rem] border-4 border-indigo-200 shadow-2xl max-w-xl mx-auto text-left animate-in slide-in-from-bottom-5 relative overflow-hidden">
                <div className="absolute -top-10 -right-10 w-40 h-40 bg-yellow-200 rounded-full blur-2xl opacity-50"></div>
                <h3 className="text-2xl font-black text-indigo-600 mb-4 flex items-center gap-2 relative z-10">
                  {STORY_CONFIG.mascotEmoji} 來自 {STORY_CONFIG.mascotName} 的信：
                </h3>
                <p className="text-slate-700 leading-loose font-bold text-lg relative z-10">
                  {STORY_CONFIG.intro}
                </p>
              </div>
            )}
          </div>
        ) : (
          // Subject Selection View
          <div className="w-full max-w-7xl animate-in slide-in-from-right duration-500">
            <div className="text-center mb-12">
                <h2 className="text-5xl md:text-6xl font-black text-white drop-shadow-[0_4px_10px_rgba(0,0,0,0.3)] mb-4" 
                    style={{ textShadow: '3px 3px 0px #0ea5e9' }}>
                    選擇冒險路線
                </h2>
                <div className="inline-block bg-white/80 backdrop-blur px-8 py-3 rounded-full shadow-lg">
                    <p className="text-slate-700 font-bold text-xl">每一條路線都藏著不同的知識寶石喔！</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 px-4">
              {SUBJECTS.map((sub) => (
                <div
                  key={sub.id}
                  onClick={() => onSelectSubject(sub.id)}
                  className={`
                    relative cursor-pointer bg-white rounded-[2.5rem] p-6 border-b-[16px] border-r-[16px]
                    ${sub.borderColor} shadow-2xl hover:-translate-y-4 hover:rotate-1 active:translate-y-0 active:border-b-0 active:border-r-0 active:scale-95
                    transition-all duration-300 group overflow-hidden h-[420px] flex flex-col
                  `}
                >
                   {/* Background Pattern */}
                   <div className={`absolute inset-0 bg-gradient-to-br ${sub.bgGradient} opacity-50 rounded-[2rem]`}></div>
                   <div className="absolute -right-10 -top-10 w-40 h-40 bg-white opacity-20 rounded-full blur-2xl transform group-hover:scale-150 transition-transform duration-700"></div>
                   
                   <div className="relative z-10 flex flex-col items-center text-center h-full pt-4">
                      <div className={`
                        w-36 h-36 rounded-full bg-white flex items-center justify-center
                        border-8 ${sub.borderColor} shadow-lg mb-8 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300
                      `}>
                        <sub.icon size={72} className={sub.textColor} strokeWidth={2.5} />
                      </div>
                      
                      <h3 className={`text-4xl font-black ${sub.textColor} mb-4`}>{sub.name}</h3>
                      <p className="text-slate-500 font-bold text-xl mb-auto px-4 leading-relaxed">{sub.description}</p>
                      
                      <div className="w-full mt-4">
                         <div className={`w-full py-4 rounded-xl ${sub.color} text-white font-black text-2xl shadow-md opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300`}>
                            GO! 出發
                         </div>
                      </div>
                   </div>
                </div>
              ))}
            </div>
            
            <div className="mt-16 text-center">
              <button 
                onClick={() => setView('TITLE')} 
                className="bg-white/50 hover:bg-white text-slate-700 font-black px-10 py-4 rounded-full transition-all flex items-center gap-3 mx-auto hover:scale-105 border-4 border-transparent hover:border-white"
              >
                ← 返回標題畫面
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};