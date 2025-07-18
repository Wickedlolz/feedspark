import React, { useState, useCallback } from "react";
import type { Article } from "../types";
import { SparklesIcon, Spinner } from "./Icons";
import { summarizeText } from "../services/geminiService";

interface FeedItemProps {
  article: Article;
}

export const FeedItem: React.FC<FeedItemProps> = ({ article }) => {
  const [summary, setSummary] = useState<string | null>(null);
  const [isSummarizing, setIsSummarizing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSummarize = useCallback(async () => {
    setIsSummarizing(true);
    setError(null);
    setSummary(null);
    try {
      const result = await summarizeText(
        article.content || article.contentSnippet
      );
      setSummary(result);
    } catch (e: unknown) {
      const error = e as { message: string };
      setError(error.message || "Failed to generate summary.");
    } finally {
      setIsSummarizing(false);
    }
  }, [article.content, article.contentSnippet]);

  const formattedDate = article.pubDate
    ? new Date(article.pubDate).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      })
    : "";

  return (
    <div className="py-6 border-b border-zinc-700/50">
      <div className="flex items-center text-xs text-gray-400 mb-2 flex-wrap">
        <span>{article.feedTitle}</span>
        {formattedDate && <span className="mx-2">&#8226;</span>}
        <span>{formattedDate}</span>
        {article.creator && <span className="mx-2">&#8226;</span>}
        <span className="truncate">{article.creator}</span>
      </div>
      <a href={article.link} target="_blank" rel="noopener noreferrer">
        <h2 className="text-lg md:text-xl font-semibold text-gray-100 hover:text-white transition-colors">
          {article.title}
        </h2>
      </a>
      <p
        className="text-gray-400 mt-2 text-sm"
        dangerouslySetInnerHTML={{
          __html: article.contentSnippet.substring(0, 250) + "...",
        }}
      />

      <div className="mt-4">
        <button
          onClick={handleSummarize}
          disabled={isSummarizing}
          className="flex items-center gap-2 px-3 py-1.5 text-xs font-semibold text-white bg-indigo-600 rounded-md hover:bg-indigo-500 disabled:bg-indigo-400 disabled:cursor-not-allowed transition-all"
        >
          {isSummarizing ? <Spinner /> : <SparklesIcon className="w-4 h-4" />}
          {isSummarizing ? "Summarizing..." : "Summarize with Gemini"}
        </button>
      </div>

      {summary && (
        <div className="mt-4 p-4 bg-zinc-800/50 rounded-lg border border-zinc-700">
          <h3 className="font-bold text-sm text-gray-200 mb-2 flex items-center gap-2">
            <SparklesIcon className="w-5 h-5 text-indigo-400" />
            AI Summary
          </h3>
          <p className="text-gray-300 text-sm">{summary}</p>
        </div>
      )}
      {error && <p className="text-red-400 mt-4 text-sm">{error}</p>}
    </div>
  );
};
