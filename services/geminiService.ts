
import { GoogleGenAI, Type } from "@google/genai";
import { MappingResult } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const generateRoomMapping = async (room: string): Promise<MappingResult> => {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Act as a senior DevOps engineer and an expert home manager. Map the household chores and activities associated with a "${room}" to equivalent IT engineering tasks (Type B) in a corporate tech environment. Provide creative, witty, and logically sound analogies.`,
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
                householdTask: { type: Type.STRING, description: "The specific chore or activity in the home room." },
                itTask: { type: Type.STRING, description: "The corresponding IT engineering or DevOps task." },
                category: { 
                  type: Type.STRING, 
                  enum: ['Security', 'Maintenance', 'Infrastructure', 'Development', 'Operations'],
                  description: "The professional domain of the IT task." 
                },
                rationale: { type: Type.STRING, description: "Why these two tasks are equivalent." },
                priority: { 
                  type: Type.STRING, 
                  enum: ['Low', 'Medium', 'High', 'Critical'],
                  description: "The business priority level." 
                }
              },
              required: ["householdTask", "itTask", "category", "rationale", "priority"]
            }
          }
        },
        required: ["roomName", "mappings"]
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
