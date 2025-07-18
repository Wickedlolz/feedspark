import { GoogleGenAI, Type } from "@google/genai";
import type { Article } from "../types";

if (!process.env.API_KEY) {
  console.warn(
    "API_KEY environment variable not set. Gemini features will be disabled."
  );
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });

// Helper to strip HTML tags from content
const stripHtml = (html: string): string => {
  const tmp = document.createElement("DIV");
  tmp.innerHTML = html;
  return tmp.textContent || tmp.innerText || "";
};

export const summarizeText = async (
  articleContent: string
): Promise<string> => {
  if (!process.env.API_KEY) {
    return "Gemini API key is not configured. Please set the API_KEY environment variable.";
  }

  const cleanContent = stripHtml(articleContent);
  if (cleanContent.trim().length < 50) {
    return "Article content is too short to summarize.";
  }

  const prompt = `Please provide a concise, one-paragraph summary of the following news article. Focus on the key information and main takeaways. Here is the article content:\n\n---\n\n${cleanContent.substring(
    0,
    15000
  )}`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    return response.text as string;
  } catch (error) {
    console.error("Error summarizing text with Gemini:", error);
    if (error instanceof Error) {
      return `Error from Gemini: ${error.message}`;
    }
    return "An unknown error occurred while summarizing.";
  }
};

export const getTopStories = async (articles: Article[]): Promise<string[]> => {
  if (!process.env.API_KEY) {
    throw new Error("Gemini API key is not configured.");
  }
  if (articles.length === 0) {
    return [];
  }

  // Limit to the most recent 50 articles to avoid huge prompts
  const articlesForPrompt = articles.slice(0, 50).map((a) => ({
    id: a.id,
    title: a.title,
    snippet: a.contentSnippet.substring(0, 300), // Keep snippet short
  }));

  const prompt = `From the following list of articles, please identify the 5 most significant, newsworthy, or impactful stories. Return ONLY a JSON array of objects, where each object contains the 'id' of the selected article. The list of articles is:\n\n${JSON.stringify(
    articlesForPrompt,
    null,
    2
  )}`;

  const schema = {
    type: Type.ARRAY,
    items: {
      type: Type.OBJECT,
      properties: {
        id: {
          type: Type.STRING,
          description: "The unique identifier of the article.",
        },
      },
      required: ["id"],
    },
  };

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: schema,
      },
    });

    const jsonResponse = JSON.parse(response.text as string);

    if (Array.isArray(jsonResponse)) {
      return jsonResponse
        .map((item: any) => item.id)
        .filter((id) => typeof id === "string");
    } else {
      console.warn("Gemini response was not a JSON array:", jsonResponse);
      return [];
    }
  } catch (error) {
    console.error("Error getting top stories from Gemini:", error);
    if (error instanceof Error) {
      throw new Error(`Error from Gemini: ${error.message}`);
    }
    throw new Error("An unknown error occurred while generating top stories.");
  }
};
