import React from "react";
import type { Article } from "../types";
import { FeedItem } from "./FeedItem";
import { RssIcon, MenuIcon } from "./Icons";

interface MainContentProps {
  articles: Article[];
  loading: boolean;
  error: string | null;
  title: string;
  onMenuClick: () => void;
  currentView: "all" | "top-stories";
  onSetCurrentView: (view: "all" | "top-stories") => void;
}

const ArticleSkeleton = () => (
  <div className="py-6 border-b border-zinc-700/50 animate-pulse">
    <div className="h-3 bg-zinc-700 rounded w-1/4 mb-3"></div>
    <div className="h-6 bg-zinc-600 rounded w-3/4 mb-3"></div>
    <div className="h-4 bg-zinc-700 rounded w-full mb-1"></div>
    <div className="h-4 bg-zinc-700 rounded w-5/6"></div>
  </div>
);

export const MainContent: React.FC<MainContentProps> = ({
  articles,
  loading,
  error,
  title,
  onMenuClick,
  currentView,
  onSetCurrentView,
}) => {
  return (
    <main className="flex-1 p-4 md:p-8 overflow-y-auto">
      <div className="max-w-4xl mx-auto">
        <header className="pb-4 border-b border-zinc-700">
          <div className="flex items-center gap-4">
            <button
              onClick={onMenuClick}
              className="md:hidden p-1 -ml-1 text-gray-300 hover:text-white"
              aria-label="Open menu"
            >
              <MenuIcon className="w-6 h-6" />
            </button>
            <h1 className="text-3xl font-bold text-white">
              {currentView === "top-stories" ? `Top Stories` : title}
            </h1>
          </div>
          <div className="flex items-center mt-4 text-sm pl-8 md:pl-0">
            <button
              onClick={() => onSetCurrentView("all")}
              className={`pb-2 px-1 transition-colors ${
                currentView === "all"
                  ? "text-white font-semibold border-b-2 border-green-400"
                  : "text-gray-400 hover:text-white"
              }`}
              aria-current={currentView === "all"}
            >
              All
            </button>
            <button
              onClick={() => onSetCurrentView("top-stories")}
              className={`ml-6 pb-2 px-1 transition-colors ${
                currentView === "top-stories"
                  ? "text-white font-semibold border-b-2 border-green-400"
                  : "text-gray-400 hover:text-white"
              }`}
              aria-current={currentView === "top-stories"}
            >
              Top Stories
            </button>
          </div>
        </header>
        {/* <header className="pb-4 border-b border-zinc-700">
          <h1 className="text-3xl font-bold text-white">
            {currentView === "top-stories" ? `Top Stories` : title}
          </h1>
          <div className="flex items-center mt-4 text-sm">
            <button
              onClick={() => onSetCurrentView("all")}
              className={`pb-2 px-1 transition-colors ${
                currentView === "all"
                  ? "text-white font-semibold border-b-2 border-green-400"
                  : "text-gray-400 hover:text-white"
              }`}
              aria-current={currentView === "all"}
            >
              All
            </button>
            <button
              onClick={() => onSetCurrentView("top-stories")}
              className={`ml-6 pb-2 px-1 transition-colors ${
                currentView === "top-stories"
                  ? "text-white font-semibold border-b-2 border-green-400"
                  : "text-gray-400 hover:text-white"
              }`}
              aria-current={currentView === "top-stories"}
            >
              Top Stories
            </button>
          </div>
        </header> */}

        <div className="mt-6">
          {loading && (
            <>
              <ArticleSkeleton />
              <ArticleSkeleton />
              <ArticleSkeleton />
            </>
          )}

          {error && (
            <div className="text-center py-10">
              <p className="text-red-400">{error}</p>
            </div>
          )}

          {/* {!loading && !error && articles.length === 0 && (
            <div className="text-center py-20 text-gray-500">
              <RssIcon className="mx-auto w-12 h-12 mb-4" />
              <p className="text-lg">No articles to show.</p>
              <p>Add a feed or select one from the sidebar.</p>
            </div>
          )} */}
          {!loading && !error && articles.length === 0 && (
            <div className="text-center py-20 text-gray-500">
              <RssIcon className="mx-auto w-12 h-12 mb-4" />
              <p className="text-lg">
                {currentView === "top-stories"
                  ? "No Top Stories To Show"
                  : "No articles to show."}
              </p>
              <p>
                {currentView === "top-stories"
                  ? "Select a feed with articles to generate top stories."
                  : "Add a feed or select one from the sidebar."}
              </p>
            </div>
          )}

          {!loading &&
            !error &&
            articles.map((article) => (
              <FeedItem key={article.id} article={article} />
            ))}
        </div>
      </div>
    </main>
  );
};
