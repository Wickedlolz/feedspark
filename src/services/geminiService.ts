import { GoogleGenAI } from '@google/genai';

if (!process.env.API_KEY) {
    console.warn(
        'API_KEY environment variable not set. Gemini features will be disabled.'
    );
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });

// Helper to strip HTML tags from content
const stripHtml = (html: string): string => {
    const tmp = document.createElement('DIV');
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || '';
};

export const summarizeText = async (
    articleContent: string
): Promise<string> => {
    if (!process.env.API_KEY) {
        return 'Gemini API key is not configured. Please set the API_KEY environment variable.';
    }

    const cleanContent = stripHtml(articleContent);
    if (cleanContent.trim().length < 50) {
        return 'Article content is too short to summarize.';
    }

    const prompt = `Please provide a concise, one-paragraph summary of the following news article. Focus on the key information and main takeaways. Here is the article content:\n\n---\n\n${cleanContent.substring(
        0,
        15000
    )}`;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
        });

        return response.text;
    } catch (error) {
        console.error('Error summarizing text with Gemini:', error);
        if (error instanceof Error) {
            return `Error from Gemini: ${error.message}`;
        }
        return 'An unknown error occurred while summarizing.';
    }
};
