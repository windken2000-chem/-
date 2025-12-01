
import React, { useEffect, useState } from 'react';
import { GameButton } from '../ui/GameButton';
import { Star, RotateCcw, Map as MapIcon, PartyPopper } from 'lucide-react';
import confetti from 'canvas-confetti';

interface ResultScreenProps {
  score: number;
  total: number;
  onRestart: () => void;
  onBackToMap: () => void;
}

export const ResultScreen: React.FC<ResultScreenProps> = ({ score, total, onRestart, onBackToMap }) => {
  const [visibleStars, setVisibleStars] = useState(0);
  const percentage = (score / total) * 100;
  
  let targetStars = 0;
  let message = "";
  let messageColor = "";
  
  if (percentage === 100) {
    targetStars = 3;
    message = "太神啦！完美通關！🏆";
    messageColor = "text-yellow-600";
  } else if (percentage >= 60) {
    targetStars = 2;
    message = "做得很好！繼續冒險！✨";
    messageColor = "text-blue-600";
  } else {
    targetStars = 1;
    message = "加油！多試幾次就會了！🔥";
    messageColor = "text-rose-600";
  }

  useEffect(() => {
    // Trigger confetti if successful
    if (targetStars >= 2) {
        const duration = 3000;
        const animationEnd = Date.now() + duration;
        const random = (min: number, max: number) => Math.random() * (max - min) + min;

        const interval: any = setInterval(function() {
            const timeLeft = animationEnd - Date.now();
            if (timeLeft <= 0) {
                return clearInterval(interval);
            }
            const particleCount = 50 * (timeLeft / duration);
            confetti({
                particleCount,
                startVelocity: 30,
                spread: 360,
                origin: {
                    x: random(0.1, 0.3),
                    y: Math.random() - 0.2
                },
                colors: ['#FFD700', '#FFA500', '#FF4500']
            });
            confetti({
                particleCount,
                startVelocity: 30,
                spread: 360,
                origin: {
                    x: random(0.7, 0.9),
                    y: Math.random() - 0.2
                },
                colors: ['#00BFFF', '#1E90FF', '#4169E1']
            });
        }, 250);
    }

    // Staggered star animation
    let current = 0;
    const timer = setInterval(() => {
        if (current < targetStars) {
            current++;
            setVisibleStars(current);
        } else {
            clearInterval(timer);
        }
    }, 600); // Delay between stars

    return () => clearInterval(timer);
  }, [targetStars]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-yellow-50 p-6 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 left-10 w-32 h-32 bg-yellow-200 rounded-full blur-3xl opacity-50 animate-pulse"></div>
        <div className="absolute bottom-10 right-10 w-40 h-40 bg-pink-200 rounded-full blur-3xl opacity-50 animate-pulse delay-700"></div>
      </div>

      <div className="max-w-md w-full bg-white rounded-3xl p-8 md:p-12 shadow-[0_20px_50px_rgba(0,0,0,0.1)] text-center border-b-8 border-yellow-200 relative z-10 animate-in zoom-in duration-500">
        
        <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-yellow-400 text-yellow-900 px-6 py-2 rounded-full font-black text-xl shadow-lg flex items-center gap-2 whitespace-nowrap">
            <PartyPopper /> 關卡結算
        </div>

        <h1 className="text-4xl font-black text-slate-800 mb-2 mt-4">
            闖關完成！
        </h1>
        <p className={`font-bold mb-10 text-xl ${messageColor}`}>{message}</p>

        <div className="flex justify-center gap-4 mb-10 h-20 items-center">
          {[1, 2, 3].map((i) => (
             <div key={i} className="relative">
                 {/* Placeholder Star */}
                 <Star size={64} className="text-slate-100 absolute top-0 left-0" />
                 
                 {/* Animated Star */}
                 <div className={`transform transition-all duration-700 cubic-bezier(0.34, 1.56, 0.64, 1) ${i <= visibleStars ? 'scale-100 opacity-100 rotate-0' : 'scale-0 opacity-0 rotate-[-180deg]'}`}>
                    <Star 
                        size={64} 
                        fill="#facc15" 
                        className="text-yellow-500 drop-shadow-[0_4px_0_rgba(234,179,8,1)]"
                    />
                 </div>
                 
                 {/* Burst effect when star appears */}
                 {i === visibleStars && (
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full animate-[ping_0.5s_ease-out_forwards] rounded-full border-4 border-yellow-300 opacity-0"></div>
                 )}
             </div>
          ))}
        </div>

        <div className="bg-slate-50 rounded-2xl p-6 mb-8 border-2 border-slate-100">
          <p className="text-slate-400 font-bold uppercase tracking-wider text-xs mb-2">FINAL SCORE</p>
          <div className="flex items-baseline justify-center gap-2">
            <span className="text-6xl font-black text-slate-800 tracking-tighter">{score}</span>
            <span className="text-2xl text-slate-400 font-bold">/ {total}</span>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <GameButton onClick={onBackToMap} colorClass="bg-blue-500" shadowClass="bg-blue-700" size="lg" className="w-full">
            <span className="flex items-center justify-center gap-2"><MapIcon/> 回地圖</span>
          </GameButton>
          <button 
            onClick={onRestart}
            className="text-slate-400 font-bold py-3 hover:text-slate-600 flex items-center justify-center gap-2 transition-colors hover:scale-105 transform active:scale-95"
          >
            <RotateCcw size={18}/> 再玩一次
          </button>
        </div>
      </div>
    </div>
  );
};
