import { useState, useCallback } from "react";
import type { Article } from "../types";
import { getTopStories } from "../services/geminiService";

interface UseTopStoriesReturn {
  topStories: Article[];
  loading: boolean;
  error: string | null;
  fetchTopStories: (articles: Article[]) => Promise<void>;
}

export const useTopStories = (): UseTopStoriesReturn => {
  const [topStories, setTopStories] = useState<Article[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTopStories = useCallback(async (articles: Article[]) => {
    if (articles.length === 0) {
      setTopStories([]);
      setError(
        "There are no articles to analyze. Please select a feed with articles first."
      );
      return;
    }

    setLoading(true);
    setError(null);
    setTopStories([]);

    try {
      const topStoryIds = await getTopStories(articles);
      const topArticles = articles.filter((article) =>
        topStoryIds.includes(article.id)
      );

      // Preserve the order from Gemini's response
      const orderedTopArticles = topStoryIds
        .map((id) => topArticles.find((a) => a.id === id))
        .filter((a): a is Article => a !== undefined);

      setTopStories(orderedTopArticles);
    } catch (e: unknown) {
      const error = e as Error;
      console.error("Failed to fetch top stories:", e);
      setError(
        error.message || "An error occurred while generating top stories."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    topStories,
    loading,
    error,
    fetchTopStories,
  };
};
