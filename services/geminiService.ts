
import { GoogleGenAI, Type } from "@google/genai";
import { MappingResult } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const generateMapping = async (input: { room?: string; customIdea?: string; imageData?: { data: string; mimeType: string } }): Promise<MappingResult> => {
  const parts: any[] = [];
  
  let prompt = `Act as a senior DevOps engineer and an expert home manager. 
  Map the household chores and activities associated with the input provided to equivalent IT engineering tasks (Type B) in a corporate tech environment. 
  
  Additionally, provide three narrative outputs:
  1. 'story': A short, humorous narrative mashing up these tasks into a single 'day in the life' of a 'Full-Stack Homeowner'.
  2. 'starResponse': A professional technical interview response using the STAR (Situation, Task, Action, Result) format. 
     Pick a major "incident" from this household area and describe how you solved it as if it were a critical production outage.
  3. 'linkedInPost': A high-engagement LinkedIn post that blends the 'story' and 'starResponse'. 
     It should start with a catchy hook about how home maintenance is just like DevOps, reflect on professional growth, use bullet points for the "mapping", and include relevant hashtags (e.g., #DevOps #HomeOps #LifeEngineering). Use an encouraging, "thought leader" tone.`;

  if (input.room) {
    prompt += `\nTarget Area: ${input.room}`;
  } else if (input.customIdea) {
    prompt += `\nCustom User Idea: ${input.customIdea}`;
  } else if (input.imageData) {
    prompt += `\nAnalyze the provided image. Identify the room/scene and map the visible maintenance needs to professional IT operations.`;
    parts.push({
      inlineData: input.imageData
    });
  }

  parts.push({ text: prompt });

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: { parts },
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          roomName: { type: Type.STRING },
          mappings: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                householdTask: { type: Type.STRING },
                itTask: { type: Type.STRING },
                category: { 
                  type: Type.STRING, 
                  enum: ['Security', 'Maintenance', 'Infrastructure', 'Development', 'Operations']
                },
                rationale: { type: Type.STRING },
                priority: { 
                  type: Type.STRING, 
                  enum: ['Low', 'Medium', 'High', 'Critical']
                }
              },
              required: ["householdTask", "itTask", "category", "rationale", "priority"]
            }
          },
          story: { type: Type.STRING },
          starResponse: {
            type: Type.OBJECT,
            properties: {
              situation: { type: Type.STRING },
              task: { type: Type.STRING },
              action: { type: Type.STRING },
              result: { type: Type.STRING }
            },
            required: ["situation", "task", "action", "result"]
          },
          linkedInPost: { type: Type.STRING, description: "A catchy, blended LinkedIn post." }
        },
        required: ["roomName", "mappings", "story", "starResponse", "linkedInPost"]
      }
    }
  });

  try {
    const jsonStr = response.text.trim();
    return JSON.parse(jsonStr) as MappingResult;
  } catch (error) {
    console.error("Failed to parse Gemini response:", error);
    throw new Error("Invalid response format from AI");
  }
};
