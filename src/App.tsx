import React, { useEffect, useState } from "react";
import { useFeedState } from "./hooks/useFeedState";
import { useTopStories } from "./hooks/useTopStories";
import type { SelectedItem } from "./types";

import { Sidebar } from "./components/Sidebar";
import { MainContent } from "./components/MainContent";

type CurrentView = "all" | "top-stories";

const App: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [currentView, setCurrentView] = useState<CurrentView>("all");

  const {
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
  } = useFeedState();

  const {
    topStories,
    loading: topStoriesLoading,
    error: topStoriesError,
    fetchTopStories,
  } = useTopStories();

  useEffect(() => {
    if (currentView === "top-stories") {
      fetchTopStories(articles);
    }
  }, [currentView, articles, fetchTopStories]);

  const handleSelectItem = (item: SelectedItem) => {
    setSelectedItem(item);
    setCurrentView("all");
    // Close sidebar on mobile after selection
    if (window.innerWidth < 768) {
      setIsSidebarOpen(false);
    }
  };

  const handleAddFeed = async (url: string, folderId: string | null) => {
    try {
      await addFeed(url, folderId);
    } catch (error) {
      alert(error instanceof Error ? error.message : "An error occurred");
    }
  };

  const handleAddFolder = (name: string) => {
    try {
      addFolder(name);
    } catch (error) {
      alert(error instanceof Error ? error.message : "An error occurred");
    }
  };

  return (
    <div className="relative min-h-screen w-full font-sans bg-zinc-900 text-white md:flex">
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
        articles={currentView === "all" ? articles : topStories}
        loading={currentView === "all" ? loading : topStoriesLoading}
        error={currentView === "all" ? error : topStoriesError}
        title={currentTitle}
        currentView={currentView}
        onSetCurrentView={setCurrentView}
        onMenuClick={() => setIsSidebarOpen(true)}
      />
    </div>
  );
};

export default App;
