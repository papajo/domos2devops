
import { GoogleGenAI, Type } from "@google/genai";
import { MappingResult } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const generateMapping = async (input: { room?: string; customIdea?: string; imageData?: { data: string; mimeType: string } }): Promise<MappingResult> => {
  const parts: any[] = [];
  
  let prompt = `Act as a senior DevOps engineer and an expert home manager. 
  Map the household chores and activities associated with the input provided to equivalent IT engineering tasks (Type B) in a corporate tech environment. 
  
  Additionally, generate a 'story' field which is a short (2-3 paragraph) humorous narrative that mashes up these household and IT tasks into a single 'day in the life' of a 'Full-Stack Homeowner'. Use tech jargon creatively.`;

  if (input.room) {
    prompt += `\nTarget Area: ${input.room}`;
  } else if (input.customIdea) {
    prompt += `\nCustom User Idea: ${input.customIdea}`;
  } else if (input.imageData) {
    prompt += `\nAnalyze the provided image. Identify the room or scene, its state (e.g., messy, under construction, organized), and map the visible maintenance needs to IT tasks.`;
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
          story: { type: Type.STRING, description: "A humorous narrative mashing household and IT tasks." }
        },
        required: ["roomName", "mappings", "story"]
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
