import { GoogleGenAI, Type } from "@google/genai";

// Initialize the Gemini client
// Note: process.env.API_KEY is assumed to be available in the environment
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const estimateMealNutrition = async (mealDescription: string) => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Estimate the nutrition facts for: ${mealDescription}. Return reasonable estimates.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            name: { type: Type.STRING, description: "A short, concise name for the meal" },
            calories: { type: Type.NUMBER, description: "Estimated calories (kcal)" },
            protein: { type: Type.NUMBER, description: "Estimated protein (g)" },
            carbs: { type: Type.NUMBER, description: "Estimated carbohydrates (g)" },
            fats: { type: Type.NUMBER, description: "Estimated fats (g)" },
          },
          required: ["name", "calories", "protein", "carbs", "fats"],
        },
      },
    });

    const text = response.text;
    if (!text) return null;
    return JSON.parse(text);
  } catch (error) {
    console.error("Error estimating meal nutrition:", error);
    throw error;
  }
};

export const suggestWorkout = async (workoutType: string, duration: string) => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Suggest a ${workoutType} workout routine that lasts ${duration}.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING, description: "Catchy title for the workout" },
            estimatedCalories: { type: Type.NUMBER, description: "Estimated total calories burned" },
            exercises: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING },
                  sets: { type: Type.STRING, description: "e.g., '3 sets'" },
                  reps: { type: Type.STRING, description: "e.g., '12 reps' or '45 secs'" },
                },
              },
            },
          },
          required: ["title", "estimatedCalories", "exercises"],
        },
      },
    });

    const text = response.text;
    if (!text) return null;
    return JSON.parse(text);
  } catch (error) {
    console.error("Error suggesting workout:", error);
    throw error;
  }
};