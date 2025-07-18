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
    <article className="py-6 border-b border-zinc-700/50">
      <header className="flex items-center text-xs text-gray-400 mb-2 flex-wrap">
        <cite className="not-italic">{article.feedTitle}</cite>
        {formattedDate && (
          <span className="mx-2" aria-hidden="true">
            &#8226;
          </span>
        )}
        <time dateTime={article.pubDate}>{formattedDate}</time>
        {article.creator && (
          <span className="mx-2" aria-hidden="true">
            &#8226;
          </span>
        )}
        <address className="truncate not-italic inline">
          {article.creator}
        </address>
      </header>

      <h2 className="text-lg md:text-xl font-semibold text-gray-100">
        <a
          href={article.link}
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-white transition-colors"
          aria-label={`Read full article: ${article.title}`}
        >
          {article.title}
        </a>
      </h2>

      <div
        className="text-gray-400 mt-2 text-sm"
        dangerouslySetInnerHTML={{
          __html: article.contentSnippet.substring(0, 250) + "...",
        }}
        aria-label="Article preview"
      />

      <div className="mt-4" role="toolbar">
        <button
          onClick={handleSummarize}
          disabled={isSummarizing}
          className="flex items-center gap-2 px-3 py-1.5 text-xs font-semibold text-white bg-indigo-600 rounded-md hover:bg-indigo-500 disabled:bg-indigo-400 disabled:cursor-not-allowed transition-all"
          aria-busy={isSummarizing}
        >
          {isSummarizing ? (
            <>
              <Spinner aria-hidden="true" />
              <span>Summarizing...</span>
            </>
          ) : (
            <>
              <SparklesIcon className="w-4 h-4" aria-hidden="true" />
              <span>Summarize with Gemini</span>
            </>
          )}
        </button>
      </div>

      {summary && (
        <section
          className="mt-4 p-4 bg-zinc-800/50 rounded-lg border border-zinc-700"
          aria-label="AI Generated Summary"
        >
          <h3 className="font-bold text-sm text-gray-200 mb-2 flex items-center gap-2">
            <SparklesIcon
              className="w-5 h-5 text-indigo-400"
              aria-hidden="true"
            />
            <span>AI Summary</span>
          </h3>
          <p className="text-gray-300 text-sm">{summary}</p>
        </section>
      )}

      {error && (
        <footer className="mt-4">
          <p className="text-red-400 text-sm" role="alert">
            {error}
          </p>
        </footer>
      )}
    </article>
  );
};
