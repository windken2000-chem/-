
import React, { useMemo, useEffect } from 'react';
import { Subject, LevelConfig } from '../../types';
import { SUBJECTS, STORY_CONFIG, ZONES } from '../../constants';
import { GameButton } from '../ui/GameButton';
import { ArrowLeft, Star, Lock } from 'lucide-react';

interface MapScreenProps {
  subject: Subject;
  levels: LevelConfig[];
  onSelectLevel: (levelId: number) => void;
  onBack: () => void;
}

export const MapScreen: React.FC<MapScreenProps> = ({ subject, levels, onSelectLevel, onBack }) => {
  const subjectConfig = useMemo(() => SUBJECTS.find(s => s.id === subject), [subject]);

  // Find the highest unlocked level to add visual focus
  const latestUnlockedId = useMemo(() => {
    const unlocked = levels.filter(l => !l.isLocked);
    return unlocked.length > 0 ? unlocked[unlocked.length - 1].id : 1;
  }, [levels]);

  // Scroll to latest unlocked level
  useEffect(() => {
    if (latestUnlockedId) {
      setTimeout(() => {
        const element = document.getElementById(`level-${latestUnlockedId}`);
        element?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 300);
    }
  }, [latestUnlockedId]);

  return (
    <div className={`min-h-screen flex flex-col bg-slate-100 relative overflow-hidden font-sans`}>
      
      {/* Header */}
      <div className="fixed top-0 left-0 w-full z-50 px-4 py-3 bg-white/90 backdrop-blur-md border-b-4 border-slate-200 shadow-sm flex items-center justify-between">
         <div className="flex items-center gap-2">
            <GameButton size="sm" onClick={onBack} colorClass="bg-slate-500" shadowClass="bg-slate-700">
            <ArrowLeft size={20} />
            </GameButton>
            <div className="flex flex-col ml-2">
               <h2 className={`text-xl md:text-2xl font-black ${subjectConfig?.textColor}`}>{subjectConfig?.name}王國</h2>
               <div className="flex gap-1">
                 <div className="w-3 h-3 rounded-full bg-red-400 animate-pulse"></div>
                 <div className="w-3 h-3 rounded-full bg-yellow-400 animate-pulse delay-75"></div>
                 <div className="w-3 h-3 rounded-full bg-green-400 animate-pulse delay-150"></div>
               </div>
            </div>
         </div>

         <div className="flex items-center gap-3 bg-yellow-100 px-4 py-2 rounded-2xl border-2 border-yellow-300">
           <span className="text-2xl animate-bounce">{STORY_CONFIG.mascotEmoji}</span>
           <span className="font-bold text-yellow-800 text-sm hidden md:inline">加油！勇者！</span>
         </div>
      </div>

      {/* Map Content */}
      <div className="flex-1 overflow-y-auto pt-20 pb-20">
        
        {/* Render Zones (Now 4 Zones * 5 Levels = 20 Total) */}
        {ZONES.map((zone, zoneIndex) => {
          // Filter levels for this zone (e.g., 1-5, 6-10)
          const zoneLevels = levels.slice(zoneIndex * 5, (zoneIndex + 1) * 5);
          
          return (
             <div key={zone.id} className={`relative py-20 ${zone.bgClass} border-b-8 border-white/20 overflow-hidden`}>
                {/* Zone Background Patterns (CSS Simulated) */}
                <div className="absolute inset-0 opacity-10 pointer-events-none" 
                     style={{ backgroundImage: `radial-gradient(${zoneIndex % 2 === 0 ? '#000' : '#fff'} 2px, transparent 2px)`, backgroundSize: '30px 30px' }}>
                </div>
                
                {/* Zone Title */}
                <div className="absolute top-6 left-6 bg-white/60 backdrop-blur-md px-6 py-2 rounded-full border-2 border-white/50 shadow-md z-20">
                    <span className="text-3xl mr-3">{zone.icon}</span>
                    <span className="font-black text-slate-700 text-xl tracking-widest">{zone.name}</span>
                    <div className="text-xs text-slate-500 font-bold mt-1">
                        {subjectConfig?.chapters[zoneIndex]} 篇章
                    </div>
                </div>

                {/* Decorative CSS Art based on zone */}
                {zone.id === 'forest' && (
                    <>
                      <div className="absolute bottom-0 left-[5%] text-8xl opacity-40 grayscale-[0.2]">🌲</div>
                      <div className="absolute bottom-10 left-[25%] text-6xl opacity-40 grayscale-[0.2]">🌳</div>
                      <div className="absolute top-20 right-[15%] text-5xl opacity-40">🍄</div>
                    </>
                )}
                {zone.id === 'ocean' && (
                    <>
                      <div className="absolute bottom-10 right-[5%] text-8xl opacity-40">🐳</div>
                      <div className="absolute top-32 left-[10%] text-6xl opacity-40">🐙</div>
                      <div className="absolute bottom-5 left-[30%] text-5xl opacity-40">🐚</div>
                    </>
                )}
                 {zone.id === 'sky' && (
                    <>
                      <div className="absolute top-10 right-[10%] text-8xl opacity-50">🌈</div>
                      <div className="absolute bottom-20 left-[5%] text-7xl opacity-40">🎈</div>
                      <div className="absolute top-40 left-[40%] text-6xl opacity-30">🦅</div>
                    </>
                )}
                 {zone.id === 'space' && (
                    <>
                      <div className="absolute top-10 right-[5%] text-8xl opacity-50">🪐</div>
                      <div className="absolute bottom-10 left-[15%] text-7xl opacity-40">🌍</div>
                      <div className="absolute top-1/2 right-[20%] text-6xl opacity-30">🛸</div>
                    </>
                )}


                <div className="max-w-md mx-auto relative mt-8">
                   {/* Dotted Path */}
                   <div className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-0 border-l-8 border-dashed border-black/10 z-0"></div>

                   {zoneLevels.map((level, i) => {
                      const isEven = i % 2 === 0;
                      const isLatest = level.id === latestUnlockedId;
                      
                      return (
                        <div key={level.id} id={`level-${level.id}`} className={`relative flex ${isEven ? 'justify-start' : 'justify-end'} mb-24 px-6`}>
                           
                           {/* Level Node */}
                           <div className={`relative z-10 flex flex-col items-center group ${isEven ? 'mr-auto' : 'ml-auto'}`}>
                              
                              {/* Pulse effect for latest unlocked level */}
                              {isLatest && !level.isLocked && (
                                <div className="absolute inset-0 bg-yellow-400 rounded-[2.5rem] blur-xl opacity-50 animate-pulse scale-110"></div>
                              )}

                              <button
                                onClick={() => !level.isLocked && onSelectLevel(level.id)}
                                disabled={level.isLocked}
                                className={`
                                  w-32 h-32 rounded-[2.5rem] border-b-[10px] border-r-[10px] flex flex-col items-center justify-center
                                  transition-all duration-200 transform hover:scale-105 active:scale-95 active:border-b-0 active:border-r-0
                                  shadow-xl relative overflow-hidden z-10
                                  ${level.isLocked 
                                    ? 'bg-slate-200 border-slate-300 cursor-not-allowed' 
                                    : isLatest 
                                        ? 'bg-yellow-50 border-yellow-300 ring-4 ring-yellow-200'
                                        : 'bg-white border-blue-200 hover:border-blue-400'}
                                `}
                              >
                                {level.isLocked ? (
                                  <Lock className="text-slate-400" size={40} />
                                ) : (
                                  <>
                                    <div className={`absolute inset-0 opacity-20 bg-gradient-to-br ${subjectConfig?.bgGradient}`}></div>
                                    <span className={`text-5xl font-black drop-shadow-sm z-10 ${isLatest ? 'text-yellow-600' : 'text-slate-700'}`}>{level.id}</span>
                                    
                                    {/* Stars display */}
                                    <div className="flex gap-1 mt-2 z-10">
                                      {[1, 2, 3].map(star => (
                                        <Star 
                                          key={star} 
                                          size={18} 
                                          fill={star <= level.stars ? "#facc15" : "none"}
                                          className={`${star <= level.stars ? 'text-yellow-400 drop-shadow-sm' : 'text-slate-300'}`} 
                                        />
                                      ))}
                                    </div>
                                    
                                    {isLatest && (
                                        <div className="absolute top-2 right-2 w-3 h-3 bg-red-500 rounded-full animate-ping"></div>
                                    )}
                                  </>
                                )}
                              </button>

                              {/* Label */}
                              <div className={`
                                absolute -bottom-10 whitespace-nowrap bg-white/95 backdrop-blur px-4 py-2 rounded-xl 
                                border-4 border-slate-100 shadow-md text-center min-w-[120px] transform transition-transform group-hover:scale-110 z-20
                                ${isLatest ? 'border-yellow-300 scale-110' : ''}
                              `}>
                                <span className={`font-bold text-lg ${isLatest ? 'text-yellow-700' : 'text-slate-700'}`}>
                                  {subjectConfig?.topics[level.id - 1] || level.title}
                                </span>
                              </div>
                           </div>
                        </div>
                      );
                   })}
                </div>
             </div>
          );
        })}

        <div className="text-center py-24 text-slate-400 font-bold bg-slate-200">
           <div className="text-4xl mb-2">🚧</div>
           未完待續... 更多冒險地圖敬請期待！
        </div>

      </div>
    </div>
  );
};
