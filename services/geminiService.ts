
import { GoogleGenerativeAI, SchemaType } from "@google/generative-ai";

export const analyzeFoodImage = async (base64Image: string) => {
  const genAI = new GoogleGenerativeAI(import.meta.env.VITE_API_KEY || '');
  
  try {
    const model = genAI.getGenerativeModel({
      model: 'gemini-1.5-flash',
      generationConfig: {
        responseMimeType: "application/json",
        responseSchema: {
          type: SchemaType.OBJECT,
          properties: {
            name: { type: SchemaType.STRING },
            description: { type: SchemaType.STRING },
            ingredients: { type: SchemaType.ARRAY, items: { type: SchemaType.STRING } },
            nutritionalInfo: {
              type: SchemaType.OBJECT,
              properties: {
                calories: { type: SchemaType.INTEGER },
                protein: { type: SchemaType.STRING },
                carbs: { type: SchemaType.STRING },
                fat: { type: SchemaType.STRING }
              }
            },
            carbonSavedKg: { type: SchemaType.NUMBER },
            quantity: { type: SchemaType.INTEGER },
            tags: { type: SchemaType.ARRAY, items: { type: SchemaType.STRING } },
          },
          required: ["name", "description", "ingredients", "nutritionalInfo", "carbonSavedKg", "quantity", "tags"]
        },
      },
    });

    const result = await model.generateContent([
      {
        inlineData: {
          mimeType: 'image/jpeg',
          data: base64Image.split(',')[1] || base64Image,
        },
      },
      `Analyze this surplus cafeteria food. Provide:
      1. Name
      2. Detailed description
      3. List of key ingredients
      4. Nutritional estimates (Calories, Protein, Carbs, Fat)
      5. Carbon Footprint savings estimate (kg)
      6. Quantity available.
      Return ONLY JSON.`
    ]);

    const response = await result.response;
    return JSON.parse(response.text() || '{}');
  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    return null;
  }
};
