import React, { useState, useEffect, useCallback } from "react";
import { Sidebar } from "./components/Sidebar";
import { MainContent } from "./components/MainContent";
import type { Article, Feed, Folder, SelectedItem } from "./types";
import { fetchAndParseRss } from "./services/rssService";

const App: React.FC = () => {
  const [folders, setFolders] = useState<Folder[]>([]);
  const [feeds, setFeeds] = useState<Feed[]>([]);
  const [articles, setArticles] = useState<Article[]>([]);
  const [selectedItem, setSelectedItem] = useState<SelectedItem>({
    type: "all",
    id: null,
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [currentTitle, setCurrentTitle] =
    useState<string>("All Personal Feeds");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Load state from localStorage on initial render
  useEffect(() => {
    try {
      const savedFoldersJSON = localStorage.getItem("rss_folders");
      if (savedFoldersJSON) {
        setFolders(JSON.parse(savedFoldersJSON));
      }

      const savedFeedsJSON = localStorage.getItem("rss_feeds");
      const parsedFeeds = savedFeedsJSON ? JSON.parse(savedFeedsJSON) : null;

      if (parsedFeeds && parsedFeeds.length > 0) {
        setFeeds(parsedFeeds);
      } else {
        // Add default feeds if none exist in localStorage or the array is empty
        setFeeds([
          {
            id: "https://www.theverge.com/rss/index.xml",
            url: "https://www.theverge.com/rss/index.xml",
            title: "The Verge",
            folderId: null,
          },
          {
            id: "https://techcrunch.com/feed/",
            url: "https://techcrunch.com/feed/",
            title: "TechCrunch",
            folderId: null,
          },
        ]);
      }
    } catch (e) {
      console.error("Failed to load state from localStorage", e);
    }
  }, []);

  // Save state to localStorage whenever folders or feeds change
  useEffect(() => {
    try {
      localStorage.setItem("rss_folders", JSON.stringify(folders));
    } catch (e) {
      console.error("Failed to save folders to localStorage", e);
    }
  }, [folders]);

  useEffect(() => {
    try {
      localStorage.setItem("rss_feeds", JSON.stringify(feeds));
    } catch (e) {
      console.error("Failed to save feeds to localStorage", e);
    }
  }, [feeds]);

  // Fetch articles when selectedItem changes
  useEffect(() => {
    const fetchArticles = async () => {
      setLoading(true);
      setError(null);
      setArticles([]);

      let urlsToFetch: string[] = [];
      switch (selectedItem.type) {
        case "all":
          setCurrentTitle("All Personal Feeds");
          urlsToFetch = feeds.map((f) => f.url);
          break;
        case "feed":
          const feed = feeds.find((f) => f.id === selectedItem.id);
          if (feed) {
            setCurrentTitle(feed.title);
            urlsToFetch = [feed.url];
          }
          break;
        case "folder":
          const folder = folders.find((f) => f.id === selectedItem.id);
          if (folder) {
            setCurrentTitle(folder.name);
            urlsToFetch = feeds
              .filter((f) => f.folderId === selectedItem.id)
              .map((f) => f.url);
          }
          break;
      }

      if (urlsToFetch.length === 0 && selectedItem.type !== "all") {
        setLoading(false);
        return;
      }
      if (urlsToFetch.length === 0) {
        setLoading(false);
        return;
      }

      const results = await Promise.allSettled(
        urlsToFetch.map((url) => fetchAndParseRss(url))
      );

      const fetchedArticles: Article[] = [];
      let fetchError = false;
      results.forEach((result) => {
        if (result.status === "fulfilled") {
          fetchedArticles.push(...result.value.articles);
        } else {
          console.error("Failed to fetch a feed:", result.reason);
          fetchError = true;
        }
      });

      if (fetchError && fetchedArticles.length === 0) {
        setError(
          "Failed to fetch some or all feeds. Check console for details. CORS proxy might be down."
        );
      }

      // Sort by date descending
      fetchedArticles.sort(
        (a, b) => new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime()
      );

      setArticles(fetchedArticles);
      setLoading(false);
    };

    fetchArticles();
  }, [selectedItem, feeds, folders]);

  const handleAddFeed = useCallback(
    async (url: string, folderId: string | null) => {
      if (feeds.some((f) => f.id === url)) {
        alert("Feed already exists.");
        return;
      }
      setLoading(true);
      try {
        const { feedTitle } = await fetchAndParseRss(url);
        const newFeed: Feed = {
          id: url,
          url,
          title: feedTitle || "Untitled Feed",
          folderId,
        };
        setFeeds((prev) => [...prev, newFeed]);
      } catch (error) {
        alert(
          "Could not fetch or parse this RSS feed. Please check the URL and if it supports CORS."
        );
      } finally {
        setLoading(false);
      }
    },
    [feeds]
  );

  const handleAddFolder = (name: string) => {
    if (folders.some((f) => f.name === name)) {
      alert("Folder with this name already exists.");
      return;
    }
    const newFolder: Folder = { id: `folder_${Date.now()}`, name };
    setFolders((prev) => [...prev, newFolder]);
  };

  const handleSelectItem = (item: SelectedItem) => {
    setSelectedItem(item);
    // Close sidebar on mobile after selection
    if (window.innerWidth < 768) {
      setIsSidebarOpen(false);
    }
  };

  return (
    <div className="relative h-screen w-full font-sans bg-zinc-900 text-white md:flex overflow-hidden">
      <Sidebar
        folders={folders}
        feeds={feeds}
        selectedItem={selectedItem}
        onSelectItem={handleSelectItem}
        onAddFeed={handleAddFeed}
        onAddFolder={handleAddFolder}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />
      <MainContent
        articles={articles}
        loading={loading}
        error={error}
        title={currentTitle}
        onMenuClick={() => setIsSidebarOpen(true)}
      />
    </div>
  );
};

export default App;
