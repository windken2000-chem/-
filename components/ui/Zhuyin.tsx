
import React from 'react';

interface ZhuyinProps {
  text: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export const Zhuyin: React.FC<ZhuyinProps> = ({ text, size = 'md', className = '' }) => {
  // Regex: Match "Char(Bopomofo)" or just regular text
  // Group 1: Chinese Char
  // Group 2: Bopomofo content inside parentheses
  const regex = /([\u4e00-\u9fa5])\(([\u3105-\u3129\u02CA\u02C7\u02CB\u02D9\s]+)\)|([^\u4e00-\u9fa5]+|[\u4e00-\u9fa5](?!\())/g;
  
  const parts = [];
  let match;
  while ((match = regex.exec(text)) !== null) {
    if (match[1] && match[2]) {
      // It's a Chinese char with Zhuyin: "國(ㄍㄨㄛˊ)"
      parts.push({ type: 'zhuyin', char: match[1], bopomofoRaw: match[2] });
    } else {
      // It's other text (English, punctuation, or Chinese without parens)
      parts.push({ type: 'text', content: match[0] });
    }
  }

  // Configuration for sizes
  const styles = {
    sm: { 
      char: 'text-lg', 
      colWidth: 'w-3', 
      symbolSize: 'text-[10px]', 
      toneSize: 'text-[10px]',
      toneOffsetRight: '-right-2',
      toneOffsetTop: '-top-1.5'
    },
    md: { 
      char: 'text-2xl', 
      colWidth: 'w-4', 
      symbolSize: 'text-xs', 
      toneSize: 'text-xs',
      toneOffsetRight: '-right-2.5',
      toneOffsetTop: '-top-2'
    },
    lg: { 
      char: 'text-4xl', 
      colWidth: 'w-5', 
      symbolSize: 'text-sm', 
      toneSize: 'text-sm',
      toneOffsetRight: '-right-3',
      toneOffsetTop: '-top-2.5'
    },
    xl: { 
      char: 'text-6xl', 
      colWidth: 'w-8', 
      symbolSize: 'text-xl', 
      toneSize: 'text-xl',
      toneOffsetRight: '-right-4',
      toneOffsetTop: '-top-3'
    },
  };

  const s = styles[size];

  return (
    <span className={`inline-flex flex-wrap items-center align-middle leading-normal ${className}`}>
      {parts.map((part, index) => {
        if (part.type === 'text') {
          // Render punctuation/English normally
          return <span key={index} className="mx-0.5">{part.content}</span>;
        }

        // Parse Tone and Symbols
        // Tones: ˊ (2nd), ˇ (3rd), ˋ (4th), ˙ (Neutral)
        const raw = part.bopomofoRaw || '';
        let tone = '';
        const toneChars = ['ˊ', 'ˇ', 'ˋ', '˙'];
        
        // Extract tone
        for (const t of toneChars) {
          if (raw.includes(t)) {
            tone = t;
            break;
          }
        }

        // Extract phonetic symbols (remove tone chars)
        const symbols = raw.replace(/[ˊˇˋ˙]/g, '').split('');

        return (
          <span key={index} className="inline-flex items-center mx-0.5 relative group">
            {/* Chinese Character */}
            <span className={`${s.char} font-medium font-sans`}>
              {part.char}
            </span>
            
            {/* Bopomofo Container */}
            <div className={`flex flex-col items-center justify-center ml-0.5 relative ${s.colWidth}`}>
              
              {/* Neutral Tone (˙) - Positioned at Top */}
              {tone === '˙' && (
                <span className={`absolute ${s.toneOffsetTop} left-1/2 -translate-x-1/2 ${s.toneSize} text-slate-500 font-sans`}>
                  ˙
                </span>
              )}

              {/* Phonetic Symbols Column */}
              <div className={`flex flex-col items-center leading-none ${s.symbolSize} text-slate-500 font-sans space-y-[-1px]`}>
                {symbols.map((sym, i) => (
                  <span key={i} className="block transform scale-y-90">{sym}</span>
                ))}
              </div>

              {/* Other Tones (ˊ, ˇ, ˋ) - Positioned at Right Middle */}
              {tone && tone !== '˙' && (
                <span className={`absolute ${s.toneOffsetRight} top-1/2 -translate-y-1/2 ${s.toneSize} text-slate-500 font-sans`}>
                  {tone}
                </span>
              )}
            </div>
          </span>
        );
      })}
    </span>
  );
};
