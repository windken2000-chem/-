import React, { useEffect, useState, useRef } from 'react';
import { Subject, LevelConfig, LevelContent, QuizQuestion } from '../../types';
import { generateLevelContent } from '../../services/geminiService';
import { GameButton } from '../ui/GameButton';
import { Zhuyin } from '../ui/Zhuyin';
import { Heart, CheckCircle, XCircle, ArrowRight, Home, Loader2, Sword, Shield } from 'lucide-react';
import confetti from 'canvas-confetti';
import { STORY_CONFIG } from '../../constants';

interface GameScreenProps {
  subject: Subject;
  level: LevelConfig;
  topicName: string;
  onFinishLevel: (score: number, maxScore: number) => void;
  onExit: () => void;
}

type Phase = 'LOADING' | 'STORY' | 'QUIZ' | 'FEEDBACK';

export const GameScreen: React.FC<GameScreenProps> = ({ subject, level, topicName, onFinishLevel, onExit }) => {
  const [phase, setPhase] = useState<Phase>('LOADING');
  const [content, setContent] = useState<LevelContent | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [health, setHealth] = useState(3);
  const [score, setScore] = useState(0);
  
  const hasFetched = useRef(false);

  useEffect(() => {
    if (hasFetched.current) return;
    hasFetched.current = true;

    const fetchContent = async () => {
      try {
        // Pass level.id to determine grade/difficulty
        const data = await generateLevelContent(subject, topicName, level.id);
        setContent(data);
        setPhase('STORY');
      } catch (e) {
        console.error(e);
        onExit();
      }
    };
    fetchContent();
  }, [subject, topicName, level.id, onExit]);

  const handleStartQuiz = () => {
    setPhase('QUIZ');
  };

  const handleOptionSelect = (optionId: string) => {
    setSelectedOptionId(optionId);
  };

  const handleSubmitAnswer = () => {
    if (!content || !selectedOptionId) return;

    const currentQ = content.questions[currentQuestionIndex];
    const isCorrect = selectedOptionId === currentQ.correctOptionId;

    if (isCorrect) {
      setScore(s => s + 1);
      confetti({
        particleCount: 150,
        spread: 80,
        origin: { y: 0.7 },
        colors: ['#FFD700', '#FFA500', '#FF4500']
      });
    } else {
      setHealth(h => h - 1);
    }

    setPhase('FEEDBACK');
  };

  const handleNext = () => {
    if (!content) return;

    if (health <= 0) {
      onFinishLevel(score, content.questions.length);
      return;
    }

    if (currentQuestionIndex < content.questions.length - 1) {
      setCurrentQuestionIndex(i => i + 1);
      setSelectedOptionId(null);
      setPhase('QUIZ');
    } else {
      onFinishLevel(score, content.questions.length);
    }
  };

  if (phase === 'LOADING') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-indigo-50 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
        <div className="z-10 bg-white p-8 rounded-[2rem] shadow-2xl flex flex-col items-center border-b-[10px] border-r-[10px] border-indigo-200 transform rotate-1">
          <Loader2 className="animate-spin text-indigo-500 mb-6" size={64} />
          <h2 className="text-3xl font-black text-slate-700 mb-2">
            召喚知識中...
          </h2>
          <p className="text-slate-500 font-bold bg-slate-100 px-4 py-2 rounded-full">
            {STORY_CONFIG.mascotName} 正在翻閱魔法書 📖
          </p>
        </div>
      </div>
    );
  }

  if (!content) return null;

  // --- Story / Lesson Phase (RPG Dialogue Style) ---
  if (phase === 'STORY') {
    return (
      <div className="min-h-screen bg-slate-900 p-4 flex flex-col items-center justify-center relative overflow-hidden">
        {/* Cinematic Background */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-indigo-900 via-black to-black opacity-80 z-0"></div>
        <div className="absolute top-0 left-0 w-full h-full opacity-20 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] z-0 animate-pulse"></div>
        
        <div className="max-w-4xl w-full z-10 flex flex-col items-center mt-10">
           {/* Mascot Avatar - Floating */}
           <div className="relative group">
              <div className="w-36 h-36 md:w-48 md:h-48 bg-gradient-to-b from-indigo-500 to-indigo-700 rounded-full border-4 border-white shadow-[0_0_50px_rgba(79,70,229,0.6)] flex items-center justify-center text-7xl md:text-8xl mb-8 animate-[bounce_3s_infinite] z-20">
                {STORY_CONFIG.mascotEmoji}
              </div>
              <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-24 h-4 bg-black/50 blur-md rounded-full animate-[pulse_3s_infinite]"></div>
           </div>

           {/* Dialogue Box */}
           <div className="w-full bg-white/95 backdrop-blur-md rounded-[2rem] p-6 md:p-10 shadow-2xl border-4 border-indigo-400 relative animate-in slide-in-from-bottom-10 fade-in duration-700">
             
             {/* Name Tag */}
             <div className="absolute -top-7 left-8 bg-indigo-600 text-white px-8 py-2 rounded-2xl font-black text-xl border-4 border-white shadow-lg transform -rotate-2">
               {STORY_CONFIG.mascotName} 導師
             </div>

             <div className="mb-6 mt-4 border-b-4 border-indigo-100 pb-4 flex items-center gap-2">
               <span className="text-yellow-500 text-3xl">✨</span> 
               <Zhuyin text={content.lessonTitle} size="lg" className="text-indigo-900 font-black" />
             </div>
             
             <div className="mb-10 min-h-[120px]">
               <Zhuyin text={content.lessonText} size="md" className="text-slate-700 leading-loose" />
             </div>

             <div className="flex justify-end">
               <GameButton onClick={handleStartQuiz} colorClass="bg-yellow-400" shadowClass="bg-yellow-600" size="lg" className="animate-bounce-subtle">
                 <span className="flex items-center gap-2 text-yellow-900">
                    <Sword size={24} /> 接受挑戰！
                 </span>
               </GameButton>
             </div>
           </div>
        </div>
      </div>
    );
  }

  const currentQ: QuizQuestion = content.questions[currentQuestionIndex];
  const isCorrect = selectedOptionId === currentQ.correctOptionId;

  // --- Quiz Battle Phase ---
  return (
    <div className="min-h-screen bg-sky-50 flex flex-col font-sans">
      {/* HUD Bar */}
      <div className="bg-white p-3 md:p-4 shadow-md border-b-4 border-sky-100 flex justify-between items-center sticky top-0 z-50">
        <button onClick={onExit} className="p-2 bg-slate-100 rounded-xl hover:bg-red-100 transition-colors text-slate-500 hover:text-red-500">
           <Home size={24} />
        </button>

        {/* Health Bar */}
        <div className="flex items-center justify-center">
           <div className="flex items-center gap-2 bg-slate-800 px-6 py-2 rounded-full shadow-inner border-2 border-slate-600">
             <div className="flex gap-1">
               {[...Array(3)].map((_, i) => (
                 <Heart 
                   key={i} 
                   size={28} 
                   className={`transition-all duration-300 drop-shadow-sm ${i < health ? "fill-red-500 text-red-600 animate-[pulse_2s_infinite]" : "fill-slate-700 text-slate-600 scale-90"}`} 
                 />
               ))}
             </div>
           </div>
        </div>

        <div className="font-black text-sky-700 bg-sky-100 px-4 py-2 rounded-xl flex items-center gap-2">
           <Shield size={18}/>
           <span>第 {currentQuestionIndex + 1}/{content.questions.length} 關</span>
        </div>
      </div>

      {/* Battle Scene */}
      <div className="flex-1 flex flex-col items-center justify-start p-4 md:p-6 max-w-4xl mx-auto w-full relative">
        
        {/* Enemy / Question Area */}
        <div className="w-full relative mb-6 mt-2 group">
           {/* Monster Visual - Changes based on difficulty/question index */}
           <div className="absolute -top-14 left-1/2 -translate-x-1/2 flex flex-col items-center z-20">
              <div className={`
                w-24 h-24 bg-white rounded-full border-[6px] border-slate-200 flex items-center justify-center text-5xl shadow-lg animate-[bounce_3s_infinite]
                ${currentQuestionIndex === content.questions.length - 1 ? 'border-red-400 bg-red-50 scale-110' : ''}
              `}>
                 {/* Show Dragon for Boss (last question), Slime/Monster for others */}
                 {currentQuestionIndex === content.questions.length - 1 ? '🐲' : (['👾', '👹', '👻', '🤖', '💀'][currentQuestionIndex % 5])}
              </div>
              <div className="w-16 h-3 bg-black/20 rounded-[100%] blur-sm mt-[-10px]"></div>
           </div>
           
           <div className={`
             bg-white rounded-[2rem] p-8 pt-14 shadow-xl border-b-[8px] relative overflow-hidden text-center
             ${currentQuestionIndex === content.questions.length - 1 ? 'border-red-200 ring-4 ring-red-100' : 'border-slate-200'}
           `}>
             {/* Attack Effect Overlay */}
             {phase === 'FEEDBACK' && !isCorrect && (
                 <div className="absolute inset-0 bg-red-500/10 animate-pulse pointer-events-none"></div>
             )}
             
             {/* Boss Warning */}
             {currentQuestionIndex === content.questions.length - 1 && phase === 'QUIZ' && (
               <div className="absolute top-2 right-2 bg-red-500 text-white text-xs font-black px-2 py-1 rounded-lg animate-pulse">
                 BOSS 戰！
               </div>
             )}

             <div className="leading-loose py-2">
               <Zhuyin text={currentQ.question} size="lg" className="text-slate-800 font-bold" />
             </div>
           </div>
        </div>

        {/* Skill Cards / Options */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full mb-24">
          {currentQ.options.map((option) => {
            let statusClass = "bg-white border-slate-200 text-slate-600 hover:border-sky-300 hover:bg-sky-50 hover:-translate-y-1";
            let icon = <div className="w-8 h-8 rounded-full bg-slate-100 border-2 border-slate-300 flex items-center justify-center text-slate-400 font-bold">{option.id}</div>;

            if (phase === 'FEEDBACK') {
              if (option.id === currentQ.correctOptionId) {
                statusClass = "bg-green-100 border-green-500 text-green-900 ring-4 ring-green-200/50 scale-[1.02]";
                icon = <CheckCircle className="text-green-600 fill-green-100" size={32} />;
              } else if (option.id === selectedOptionId) {
                statusClass = "bg-red-100 border-red-500 text-red-900 opacity-80";
                icon = <XCircle className="text-red-600 fill-red-100" size={32} />;
              } else {
                statusClass = "opacity-40 border-slate-100 grayscale scale-95";
              }
            } else if (selectedOptionId === option.id) {
               statusClass = "bg-sky-100 border-sky-500 text-sky-900 ring-4 ring-sky-200 scale-[1.02] shadow-lg";
               icon = <div className="w-8 h-8 rounded-full bg-sky-500 text-white flex items-center justify-center font-bold">✓</div>;
            }

            return (
              <button
                key={option.id}
                onClick={() => phase === 'QUIZ' && handleOptionSelect(option.id)}
                disabled={phase === 'FEEDBACK'}
                className={`
                  relative w-full p-6 rounded-2xl border-4 text-left transition-all duration-200
                  flex items-center gap-4 shadow-sm active:scale-95
                  ${statusClass}
                `}
              >
                <div className="shrink-0">{icon}</div>
                <div className="flex-1">
                   <Zhuyin text={option.text} size="md" />
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Bottom Action Bar */}
      <div className="fixed bottom-0 left-0 w-full bg-white/90 backdrop-blur-md p-4 border-t-2 border-slate-100 shadow-[0_-10px_40px_rgba(0,0,0,0.1)] z-40">
        <div className="max-w-4xl mx-auto flex items-center justify-between gap-4">
          
          {phase === 'QUIZ' ? (
             <div className="w-full flex justify-end">
               <GameButton 
                 onClick={handleSubmitAnswer} 
                 disabled={!selectedOptionId} 
                 size="lg"
                 className="w-full md:w-auto min-w-[200px]"
                 colorClass="bg-sky-500" 
                 shadowClass="bg-sky-700"
               >
                 <span className="flex items-center justify-center gap-2">
                    <Sword className={selectedOptionId ? "animate-pulse" : ""} /> 
                    發動攻擊！
                 </span>
               </GameButton>
             </div>
          ) : (
             // Feedback View
             <div className="w-full flex flex-col md:flex-row items-center gap-4 animate-in slide-in-from-bottom-full">
               <div className="w-full flex items-start gap-4 bg-slate-50 p-4 rounded-2xl border-2 border-slate-200">
                   <div className="hidden md:flex w-14 h-14 bg-yellow-400 rounded-full items-center justify-center text-3xl border-4 border-yellow-600 shrink-0 shadow-md">
                      {STORY_CONFIG.mascotEmoji}
                   </div>
                   <div className="flex-1">
                      <p className={`font-black text-lg mb-1 ${isCorrect ? 'text-green-600' : 'text-red-500'}`}>
                        {isCorrect ? '太棒了！準確命中！🎉' : '哎呀！攻擊被彈開了... 🛡️'}
                      </p>
                      <div className="text-slate-600 font-bold text-base bg-white p-2 rounded-lg border border-slate-100">
                         <span className="text-xs text-slate-400 mr-2 bg-slate-100 px-1 rounded inline-block align-top">詳解</span>
                         <Zhuyin text={currentQ.explanation} size="sm" />
                      </div>
                   </div>
               </div>
               
               <GameButton onClick={handleNext} colorClass="bg-yellow-400" shadowClass="bg-yellow-600" className="whitespace-nowrap w-full md:w-auto shrink-0">
                 <span className="flex items-center justify-center gap-2 text-yellow-900">
                    {currentQuestionIndex < content.questions.length - 1 ? '下一關' : '查看戰果'} <ArrowRight size={20}/>
                 </span>
               </GameButton>
             </div>
          )}
        </div>
      </div>
    </div>
  );
};