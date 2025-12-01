import { GoogleGenAI, Type } from "@google/genai";
import { LevelContent, Subject } from "../types";
import { STORY_CONFIG, SUBJECTS } from "../constants";

// Helper to get client (assumes API_KEY is set in environment/build)
const getAiClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    console.error("API Key is missing!");
  }
  return new GoogleGenAI({ apiKey: apiKey || 'dummy-key-for-types' });
};

// Determine grade level based on level ID (1-20)
const getGradeContext = (levelId: number) => {
  if (levelId <= 5) return "國小一年級/二年級 (低年級)";
  if (levelId <= 10) return "國小三年級/四年級 (中年級)";
  if (levelId <= 15) return "國小五年級 (高年級)";
  return "國小六年級/國中銜接 (進階)";
};

export const generateLevelContent = async (subject: Subject, displayTopic: string, levelId: number): Promise<LevelContent> => {
  const ai = getAiClient();
  const gradeContext = getGradeContext(levelId);
  
  // Calculate Chapter and Stage
  // Level 1-5 -> Chapter 0, Stage 1-5
  // Level 6-10 -> Chapter 1, Stage 1-5
  const chapterIndex = Math.floor((levelId - 1) / 5);
  const stageInChapter = ((levelId - 1) % 5) + 1; // 1 to 5

  // Get the core chapter name from constants
  const subjectConfig = SUBJECTS.find(s => s.id === subject);
  const chapterName = subjectConfig?.chapters[chapterIndex] || displayTopic;

  // Define learning focus based on stage (1-5)
  const stageFocus = {
    1: "觀念建立：介紹核心定義，強調記憶與識別。",
    2: "基礎練習：直觀的計算或基本用法練習。",
    3: "生活應用：結合情境的故事題。",
    4: "進階思考：逆向思考、除錯題或是容易混淆的陷阱。",
    5: "魔王挑戰：綜合應用題，難度較高，需要多步驟思考。"
  }[stageInChapter] || "綜合練習";

  const prompt = `
    角色設定：你是一位名叫「${STORY_CONFIG.mascotName}」的貓頭鷹智者，也是台灣「南一版」國小教科書的遊戲化設計大師。
    
    任務目標：請為科目「${subject}」的篇章「${chapterName}」設計第 ${stageInChapter} 階段的冒險教學關卡。
    這是一個連續的學習旅程，目前是第 ${stageInChapter}/5 階段：【${stageFocus}】。
    
    【難度設定】：
    目前的關卡是第 ${levelId} 關，適合 ${gradeContext} 的學生。
    請確保用詞難度、數學數字大小、國語生字深度符合該年級程度。

    【極度重要的格式要求】：
    1. **所有中文字都必須加上注音**，格式嚴格規定為：「字(注音)」。
       範例：「大(ㄉㄚˋ)家(ㄐㄧㄚ)好(ㄏㄠˇ)」。
       英文和數字保持原樣，不要加注音。
       這非常重要，因為前端程式會依照這個格式來進行排版。
    2. 語氣：非常活潑、充滿冒險感、使用很多Emoji，像是在玩RPG遊戲的對話。

    【出題策略 - 必須生成 8 道題目】：
    請根據目前的階段【${stageFocus}】設計 8 道題目，難度循序漸進：
    - 前 2 題：暖身題 (簡單)
    - 中 4 題：核心題 (中等)
    - 後 2 題：挑戰題 (困難)

    請生成以下 JSON 格式內容：
    1. lessonTitle: 關卡標題 (要有RPG戰鬥感，例如：${chapterName} - ${stageInChapter}，每個中文字都要有注音)。
    2. lessonText: 教學內容。請用「對話框」的方式呈現。
       內容請針對「${chapterName}」這個主題，說明本階段重點【${stageFocus}】。
       例如："🦉 波(ㄅㄛ)波(ㄅㄛ)：勇(ㄩㄥˇ)者(ㄓㄜˇ)！這(ㄓㄜˋ)一(ㄧ)關(ㄍㄨㄢ)我(ㄨㄛˇ)們(˙ㄇㄣ)要(ㄧㄠˋ)學(ㄒㄩㄝˊ)..."
       (每個中文字都要有注音)。
    3. questions: 8 題選擇題。
       - question: 題目描述 (每個中文字都要有注音)。
       - options: 3-4 個選項 (每個中文字都要有注音)。
       - correctOptionId: 正確選項的ID。
       - explanation: 詳解 (波波的鼓勵或補充說明，解釋為什麼選這個，每個中文字都要有注音)。
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            lessonTitle: { type: Type.STRING },
            lessonText: { type: Type.STRING },
            questions: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  question: { type: Type.STRING },
                  options: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        id: { type: Type.STRING },
                        text: { type: Type.STRING },
                      }
                    }
                  },
                  correctOptionId: { type: Type.STRING },
                  explanation: { type: Type.STRING },
                }
              }
            }
          }
        }
      }
    });

    if (response.text) {
      return JSON.parse(response.text) as LevelContent;
    }
    throw new Error("No response text from Gemini");
  } catch (error) {
    console.error("Error generating content:", error);
    return {
      lessonTitle: "訊(ㄒㄩㄣˋ)號(ㄏㄠˋ)中(ㄓㄨㄥ)斷(ㄉㄨㄢˋ)",
      lessonText: "🦉 波(ㄅㄛ)波(ㄅㄛ)：連(ㄌㄧㄢˊ)線(ㄒㄧㄢˋ)失(ㄕ)敗(ㄅㄞˋ)了(˙ㄌㄜ)... 請(ㄑㄧㄥˇ)稍(ㄕㄠ)後(ㄏㄡˋ)再(ㄗㄞˋ)試(ㄕˋ)！",
      questions: []
    };
  }
};