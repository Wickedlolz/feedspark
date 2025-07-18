import { useState } from "react";
import type { Folder } from "../types";

import { PlusIcon } from "./Icons";

const AddFeedForm: React.FC<{
  folders: Folder[];
  onAddFeed: (url: string, folderId: string | null) => void;
}> = ({ folders, onAddFeed }) => {
  const [url, setUrl] = useState<string>("");
  const [selectedFolderId, setSelectedFolderId] = useState<string>("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (url.trim()) {
      onAddFeed(url.trim(), selectedFolderId || null);
      setUrl("");
      setSelectedFolderId("");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="px-2 mt-4 space-y-3"
      aria-label="Add new RSS feed"
    >
      <fieldset className="space-y-3">
        <legend className="sr-only">RSS Feed Details</legend>

        <section aria-labelledby="feed-url-label">
          <label
            id="feed-url-label"
            htmlFor="feed-url"
            className="text-xs text-gray-400 font-semibold"
          >
            Follow New Source
          </label>
          <div
            className="relative mt-1"
            role="group"
            aria-labelledby="feed-url-label"
          >
            <input
              id="feed-url"
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="Enter RSS feed URL"
              required
              aria-required="true"
              className="w-full bg-zinc-700/50 border border-zinc-600 rounded-md px-2 py-1.5 text-sm text-gray-200 placeholder-gray-400 focus:ring-1 focus:ring-green-400 focus:outline-none"
            />
          </div>
        </section>

        <section aria-labelledby="folder-select-label">
          <label
            id="folder-select-label"
            htmlFor="folder-select"
            className="text-xs text-gray-400 font-semibold"
          >
            Add to Folder (Optional)
          </label>
          <div className="relative mt-1">
            <select
              id="folder-select"
              value={selectedFolderId}
              onChange={(e) => setSelectedFolderId(e.target.value)}
              aria-required="false"
              className="w-full mt-1 bg-zinc-700/50 border border-zinc-600 rounded-md px-2 py-1.5 text-sm text-gray-200 focus:ring-1 focus:ring-green-400 focus:outline-none"
            >
              <option value="">No Folder</option>
              {folders.map((folder) => (
                <option key={folder.id} value={folder.id}>
                  {folder.name}
                </option>
              ))}
            </select>
          </div>
        </section>

        <footer>
          <button
            type="submit"
            className="w-full flex items-center justify-center gap-2 p-1.5 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors text-sm font-semibold"
            aria-label="Follow RSS feed"
          >
            <PlusIcon className="w-5 h-5" aria-hidden="true" />
            <span>Follow</span>
          </button>
        </footer>
      </fieldset>
    </form>
  );
};

export default AddFeedForm;
