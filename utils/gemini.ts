import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize Gemini AI
const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
if (!apiKey) {
  throw new Error("Missing Gemini API key. Please set NEXT_PUBLIC_GEMINI_API_KEY in your .env.local file");
}
const genAI = new GoogleGenerativeAI(apiKey);

interface EmotionAnalysis {
  Anger: number;
  Anxiety: number;
  Awe: number;
  Bored: number;
  Calm: number;
  Confusion: number;
  Disgust: number;
  Excitement: number;
  Fear: number;
  Horror: number;
  Joy: number;
  Nostalgia: number;
  Relief: number;
  Sad: number;
  Satisfaction: number;
  Surprise: number;
}

export async function analyzeEmotions(images: string[]): Promise<EmotionAnalysis> {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // Convert base64 images to parts
    const imageParts = await Promise.all(
      images.map(async (imageData) => {
        // Remove the data URL prefix
        const base64Data = imageData.replace(/^data:image\/\w+;base64,/, "");
        // Convert to Uint8Array
        const imageBytes = Uint8Array.from(atob(base64Data), (c) => c.charCodeAt(0));
        
        return {
          inlineData: {
            data: base64Data,
            mimeType: "image/jpeg"
          }
        };
      })
    );

    const prompt = `Analyze the facial expressions in these images and provide emotional analysis. 
    Return ONLY a JSON object with the following emotions and their percentage values (0 to 1):
    Anger, Anxiety, Awe, Bored, Calm, Confusion, Disgust, Excitement, Fear, Horror, Joy, Nostalgia, Relief, Sad, Satisfaction, Surprise.
    
    Example format:
    {
      "Anger": 0.2,
      "Joy": 0.8,
      ...
    }`;

    const result = await model.generateContent([prompt, ...imageParts]);
    const response = await result.response;
    const text = response.text();
    
    // Extract JSON from the response
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error("Invalid response format from Gemini");
    }
    
    const emotions = JSON.parse(jsonMatch[0]) as EmotionAnalysis;
    
    // Ensure all emotions are present and between 0 and 1
    const defaultEmotions: EmotionAnalysis = {
      Anger: 0, Anxiety: 0, Awe: 0, Bored: 0, Calm: 0,
      Confusion: 0, Disgust: 0, Excitement: 0, Fear: 0,
      Horror: 0, Joy: 0, Nostalgia: 0, Relief: 0, Sad: 0,
      Satisfaction: 0, Surprise: 0
    };

    return {
      ...defaultEmotions,
      ...Object.fromEntries(
        Object.entries(emotions).map(([key, value]) => [
          key,
          Math.max(0, Math.min(1, Number(value)))
        ])
      )
    };

  } catch (error) {
    console.error('Error analyzing emotions:', error);
    throw error;
  }
}
