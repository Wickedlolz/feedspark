import { useState, useCallback, useEffect } from "react";
import type { Article, Feed, Folder, SelectedItem } from "../types";
import { fetchAndParseRss } from "../services/rssService";
import useLocalStorage from "./useLocalStorage";

export const useFeedState = () => {
  const [storedFolders, setStoredFolders] = useLocalStorage<Folder[]>(
    "rss_folders",
    []
  );
  const [storedFeeds, setStoredFeeds] = useLocalStorage<Feed[]>(
    "rss_feeds",
    []
  );

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

  const fetchArticles = useCallback(async () => {
    setLoading(true);
    setError(null);
    setArticles([]);

    let urlsToFetch: string[] = [];
    switch (selectedItem.type) {
      case "all": {
        setCurrentTitle("All Personal Feeds");
        urlsToFetch = feeds.map((f) => f.url);
        break;
      }
      case "feed": {
        const feed = feeds.find((f) => f.id === selectedItem.id);
        if (feed) {
          setCurrentTitle(feed.title);
          urlsToFetch = [feed.url];
        }
        break;
      }
      case "folder": {
        const folder = folders.find((f) => f.id === selectedItem.id);
        if (folder) {
          setCurrentTitle(folder.name);
          urlsToFetch = feeds
            .filter((f) => f.folderId === selectedItem.id)
            .map((f) => f.url);
        }
        break;
      }
    }
    if (urlsToFetch.length === 0) {
      setLoading(false);
      return;
    }

    try {
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
    } catch (err) {
      setError("An error occurred while fetching articles");
      console.error("Error fetching articles:", err);
    } finally {
      setLoading(false);
    }
  }, [selectedItem, feeds, folders]);

  const addFeed = useCallback(
    async (url: string, folderId: string | null) => {
      if (feeds.some((f) => f.id === url)) {
        throw new Error("Feed already exists.");
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
      } catch (err) {
        console.error("Error adding feed:", err);
        throw new Error(
          "Could not fetch or parse this RSS feed. Please check the URL and if it supports CORS."
        );
      } finally {
        setLoading(false);
      }
    },
    [feeds]
  );

  const addFolder = useCallback(
    (name: string) => {
      if (folders.some((f) => f.name === name)) {
        throw new Error("Folder with this name already exists.");
      }
      const newFolder: Folder = { id: `folder_${Date.now()}`, name };
      setFolders((prev) => [...prev, newFolder]);
    },
    [folders]
  );

  // Load initial state
  useEffect(() => {
    if (storedFeeds && storedFeeds.length > 0) {
      setFeeds(storedFeeds);
    } else {
      // Add default feeds if none exist
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
    if (storedFolders) {
      setFolders(storedFolders);
    }
  }, []);

  // Save state changes
  useEffect(() => {
    setStoredFolders(folders);
  }, [folders, setStoredFolders]);

  useEffect(() => {
    setStoredFeeds(feeds);
  }, [feeds, setStoredFeeds]);

  // Fetch articles when selection changes
  useEffect(() => {
    fetchArticles();
  }, [fetchArticles]);

  return {
    folders,
    feeds,
    articles,
    selectedItem,
    loading,
    error,
    currentTitle,
    setSelectedItem,
    addFeed,
    addFolder,
  };
};
