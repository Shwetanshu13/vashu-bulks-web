import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextResponse } from 'next/server';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export async function POST(request) {
    try {
        const { mealDescription } = await request.json();

        if (!mealDescription) {
            return NextResponse.json(
                { error: 'Meal description is required' },
                { status: 400 }
            );
        }
        // const models = await genAI.listModels();
        // console.log(models);

        const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash-lite' });

        const prompt = `Analyze the following meal description and provide nutritional estimates. 
Respond ONLY with a valid JSON object in exactly this format, with no additional text or markdown:
{"mealName": "descriptive name", "calories": number, "protein": number, "fats": number, "carbs": number}

All nutrient values should be numbers (not strings) representing grams, except calories which is in kcal.

Meal description: ${mealDescription}`;

        const result = await model.generateContent(prompt);
        const response = result.response;
        let text = response.text();

        // Clean up the response - remove markdown code blocks if present
        text = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();

        try {
            const nutrients = JSON.parse(text);

            // Validate the response structure
            if (!nutrients.mealName ||
                typeof nutrients.calories !== 'number' ||
                typeof nutrients.protein !== 'number' ||
                typeof nutrients.fats !== 'number' ||
                typeof nutrients.carbs !== 'number') {
                throw new Error('Invalid nutrient data structure');
            }

            return NextResponse.json(nutrients);
        } catch (parseError) {
            console.error('Failed to parse Gemini response:', text);
            return NextResponse.json(
                { error: 'Failed to parse AI response. Please try again.' },
                { status: 500 }
            );
        }
    } catch (error) {
        console.error('Gemini API error:', error);
        return NextResponse.json(
            { error: 'Failed to analyze meal. Please try again.' },
            { status: 500 }
        );
    }
}
