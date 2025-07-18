export interface Article {
  id: string;
  title: string;
  link: string;
  pubDate: string;
  creator: string;
  contentSnippet: string;
  content: string;
  feedTitle: string;
}

export interface Feed {
  id: string;
  url: string;
  title: string;
  folderId: string | null;
}

export interface Folder {
  id: string;
  name: string;
}

export type SelectedItem = {
  type: "all" | "folder" | "feed";
  id: string | null;
};

export interface SidebarProps {
  folders: Folder[];
  feeds: Feed[];
  selectedItem: SelectedItem;
  onSelectItem: (item: SelectedItem) => void;
  onAddFeed: (url: string, folderId: string | null) => void;
  onAddFolder: (name: string) => void;
  isOpen: boolean;
  onClose: () => void;
}

export interface MainContentProps {
  articles: Article[];
  loading: boolean;
  error: string | null;
  title: string;
  onMenuClick: () => void;
  currentView: "all" | "top-stories";
  onSetCurrentView: (view: "all" | "top-stories") => void;
}
