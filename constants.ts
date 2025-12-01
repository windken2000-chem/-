import { LevelConfig, Subject } from './types';
import { Book, Calculator, Languages, Leaf } from 'lucide-react';

export const STORY_CONFIG = {
  title: "智慧王國大冒險",
  intro: "很久很久以前，智慧王國被「迷霧魔王」籠罩了！所有的知識都變成了碎片... 勇敢的小小冒險家，請你幫助守護者「波波」，找回失落的知識寶石，讓王國重現光明吧！",
  mascotName: "波波",
  mascotEmoji: "🦉",
};

// 定義每個科目的四大篇章 (每個篇章將擴展為 5 個關卡)
const SUBJECT_CHAPTERS = {
  [Subject.CHINESE]: [
    '注音符號王國', // Levels 1-5 (Grade 1-2)
    '國字大會考',   // Levels 6-10 (Grade 3-4)
    '詞語接龍挑戰', // Levels 11-15 (Grade 5)
    '閱讀素養大師'  // Levels 16-20 (Grade 6)
  ],
  [Subject.MATH]: [
    '數與計算大師', // Levels 1-5
    '幾何圖形探險', // Levels 6-10
    '測量與統計王', // Levels 11-15
    '邏輯與應用神'  // Levels 16-20
  ],
  [Subject.ENGLISH]: [
    '字母與發音',   // Levels 1-5
    '單字大蒐集',   // Levels 6-10
    '生活對話通',   // Levels 11-15
    '環遊世界去'    // Levels 16-20
  ],
  [Subject.LIFE]: [
    '校園與家庭',   // Levels 1-5
    '自然觀察家',   // Levels 6-10
    '生活好習慣',   // Levels 11-15
    '科學小遊戲'    // Levels 16-20
  ]
};

// 輔助函式：產生顯示用的 Topic 標題
const generateTopics = (chapters: string[]) => {
  const topics: string[] = [];
  chapters.forEach(chapter => {
    // 每個章節產生 5 個階段的標題
    topics.push(`${chapter} - 初學篇`);
    topics.push(`${chapter} - 練習篇`);
    topics.push(`${chapter} - 應用篇`);
    topics.push(`${chapter} - 進階篇`);
    topics.push(`${chapter} - 挑戰篇`);
  });
  return topics;
};

export const SUBJECTS = [
  {
    id: Subject.CHINESE,
    name: '國語',
    icon: Book,
    color: 'bg-rose-400',
    borderColor: 'border-rose-600',
    textColor: 'text-rose-600',
    bgGradient: 'from-rose-100 to-rose-200',
    description: '文字的力量',
    chapters: SUBJECT_CHAPTERS[Subject.CHINESE],
    topics: generateTopics(SUBJECT_CHAPTERS[Subject.CHINESE])
  },
  {
    id: Subject.MATH,
    name: '數學',
    icon: Calculator,
    color: 'bg-sky-400',
    borderColor: 'border-sky-600',
    textColor: 'text-sky-600',
    bgGradient: 'from-sky-100 to-sky-200',
    description: '數字的奧秘',
    chapters: SUBJECT_CHAPTERS[Subject.MATH],
    topics: generateTopics(SUBJECT_CHAPTERS[Subject.MATH])
  },
  {
    id: Subject.ENGLISH,
    name: '英文',
    icon: Languages,
    color: 'bg-violet-400',
    borderColor: 'border-violet-600',
    textColor: 'text-violet-600',
    bgGradient: 'from-violet-100 to-violet-200',
    description: '世界的語言',
    chapters: SUBJECT_CHAPTERS[Subject.ENGLISH],
    topics: generateTopics(SUBJECT_CHAPTERS[Subject.ENGLISH])
  },
  {
    id: Subject.LIFE,
    name: '生活',
    icon: Leaf,
    color: 'bg-emerald-400',
    borderColor: 'border-emerald-600',
    textColor: 'text-emerald-600',
    bgGradient: 'from-emerald-100 to-emerald-200',
    description: '自然的探索',
    chapters: SUBJECT_CHAPTERS[Subject.LIFE],
    topics: generateTopics(SUBJECT_CHAPTERS[Subject.LIFE])
  }
];

// 定義區域風格
export interface ZoneConfig {
  id: string;
  name: string;
  bgClass: string;
  icon: string;
  decoration: string;
}

export const ZONES: ZoneConfig[] = [
  { id: 'forest', name: '新手森林', bgClass: 'bg-[#e8f5e9]', icon: '🌲', decoration: 'forest-pattern' }, // Levels 1-5
  { id: 'ocean', name: '知識海洋', bgClass: 'bg-[#e3f2fd]', icon: '🐳', decoration: 'ocean-pattern' }, // Levels 6-10
  { id: 'sky', name: '雲端神殿', bgClass: 'bg-[#f3e5f5]', icon: '☁️', decoration: 'sky-pattern' }, // Levels 11-15
  { id: 'space', name: '宇宙邊境', bgClass: 'bg-[#fff3e0]', icon: '🚀', decoration: 'space-pattern' }, // Levels 16-20
];

// 產生更豐富的關卡結構 (20關)
const createLevels = () => {
  const levels: LevelConfig[] = [];
  const totalLevels = 20; // 4 Zones * 5 Levels
  
  for (let i = 1; i <= totalLevels; i++) {
    let title = `第 ${i} 關`;
    // Determine Zone Name for title
    if (i <= 5) title = `森林試煉 ${i}`;
    else if (i <= 10) title = `海洋探險 ${i}`;
    else if (i <= 15) title = `天空挑戰 ${i}`;
    else title = `最終決戰 ${i}`;

    levels.push({
      id: i,
      title: title,
      topic: '', // Will be filled dynamically based on subject
      isLocked: i > 1, // Only level 1 unlocked initially
      stars: 0
    });
  }
  return levels;
};

export const INITIAL_LEVELS: LevelConfig[] = createLevels();