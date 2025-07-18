import type { SidebarProps, SelectedItem } from "../types";

import AddFeedForm from "./AddFeedForm";
import AddFolderForm from "./AddFolderForm";
import { ChevronRightIcon, RssIcon, FolderIcon, XIcon } from "./Icons";

export const Sidebar: React.FC<SidebarProps> = ({
  folders,
  feeds,
  selectedItem,
  onSelectItem,
  onAddFeed,
  onAddFolder,
  isOpen,
  onClose,
}) => {
  const getIsSelected = (type: SelectedItem["type"], id: string | null) => {
    return selectedItem.type === type && selectedItem.id === id;
  };

  const feedsWithoutFolder = feeds.filter((f) => f.folderId === null);

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-20 md:hidden"
          onClick={onClose}
          aria-hidden="true"
        ></div>
      )}
      <aside
        className={`w-72 bg-zinc-800 text-gray-300 flex flex-col p-4 border-r border-zinc-700/50 fixed inset-y-0 left-0 z-30 transform transition-transform duration-300 ease-in-out md:relative md:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between gap-3 mb-6 px-2">
          <div className="flex items-center gap-3">
            <img
              src="https://picsum.photos/id/42/40/40"
              alt="User avatar"
              className="w-8 h-8 rounded-full"
            />
            <span className="font-bold text-white">FeedSpark</span>
          </div>
          <button
            onClick={onClose}
            className="md:hidden p-1 -mr-1 text-gray-400 hover:text-white"
            aria-label="Close menu"
          >
            <XIcon className="w-6 h-6" />
          </button>
        </div>

        <AddFeedForm folders={folders} onAddFeed={onAddFeed} />
        <div className="my-4 border-t border-zinc-700/50"></div>
        <AddFolderForm onAddFolder={onAddFolder} />

        <nav className="mt-6 flex-1 overflow-y-auto">
          <h3 className="text-xs font-bold text-gray-500 uppercase px-2 mb-2">
            Feeds
          </h3>
          <ul>
            <li
              onClick={() => onSelectItem({ type: "all", id: null })}
              className={`flex items-center gap-3 px-2 py-2 rounded-md cursor-pointer text-sm font-medium ${
                getIsSelected("all", null)
                  ? "bg-zinc-700 text-white"
                  : "hover:bg-zinc-700/50"
              }`}
            >
              <RssIcon className="w-5 h-5" />
              <span>All</span>
            </li>
            {feedsWithoutFolder.map((feed) => (
              <li
                key={feed.id}
                onClick={() => onSelectItem({ type: "feed", id: feed.id })}
                className={`flex items-center gap-3 px-2 py-2 rounded-md cursor-pointer text-sm ${
                  getIsSelected("feed", feed.id)
                    ? "bg-zinc-700 text-white"
                    : "hover:bg-zinc-700/50"
                }`}
              >
                <span className="w-5"></span>
                <span className="truncate flex-1">{feed.title}</span>
              </li>
            ))}
            {folders.map((folder) => (
              <li key={folder.id}>
                <div
                  onClick={() =>
                    onSelectItem({
                      type: "folder",
                      id: folder.id,
                    })
                  }
                  className={`flex items-center justify-between gap-3 px-2 py-2 rounded-md cursor-pointer text-sm font-medium ${
                    getIsSelected("folder", folder.id)
                      ? "bg-zinc-700 text-white"
                      : "hover:bg-zinc-700/50"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <ChevronRightIcon className="w-3 h-3" />
                    <FolderIcon className="w-5 h-5" />
                    <span className="truncate">{folder.name}</span>
                  </div>
                </div>
                <ul className="pl-7">
                  {feeds
                    .filter((f) => f.folderId === folder.id)
                    .map((feed) => (
                      <li
                        key={feed.id}
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectItem({
                            type: "feed",
                            id: feed.id,
                          });
                        }}
                        className={`flex items-center gap-3 py-1.5 rounded-md cursor-pointer text-sm ${
                          getIsSelected("feed", feed.id)
                            ? "bg-zinc-600 text-white"
                            : "hover:bg-zinc-700/50"
                        }`}
                      >
                        <span className="truncate flex-1">{feed.title}</span>
                      </li>
                    ))}
                </ul>
              </li>
            ))}
          </ul>
        </nav>
      </aside>
    </>
  );
};
