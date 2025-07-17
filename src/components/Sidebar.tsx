import React, { useState } from 'react';
import type { Folder, Feed, SelectedItem } from '../types';
import {
    PlusIcon,
    ChevronRightIcon,
    RssIcon,
    FolderIcon,
    XIcon,
} from './Icons';

interface SidebarProps {
    folders: Folder[];
    feeds: Feed[];
    selectedItem: SelectedItem;
    onSelectItem: (item: SelectedItem) => void;
    onAddFeed: (url: string, folderId: string | null) => void;
    onAddFolder: (name: string) => void;
    isOpen: boolean;
    onClose: () => void;
}

const AddFeedForm: React.FC<{ onAddFeed: (url: string) => void }> = ({
    onAddFeed,
}) => {
    const [url, setUrl] = useState('');
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (url.trim()) {
            onAddFeed(url.trim());
            setUrl('');
        }
    };

    return (
        <form onSubmit={handleSubmit} className="px-2 mt-4">
            <label
                htmlFor="feed-url"
                className="text-xs text-gray-400 font-semibold"
            >
                Follow New Source
            </label>
            <div className="flex items-center gap-2 mt-1">
                <input
                    id="feed-url"
                    type="url"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder="Enter RSS feed URL"
                    className="w-full bg-zinc-700/50 border border-zinc-600 rounded-md px-2 py-1.5 text-sm text-gray-200 placeholder-gray-400 focus:ring-1 focus:ring-green-400 focus:outline-none"
                />
                <button
                    type="submit"
                    className="p-1.5 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors"
                >
                    <PlusIcon className="w-5 h-5" />
                </button>
            </div>
        </form>
    );
};

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
    const getIsSelected = (type: SelectedItem['type'], id: string | null) => {
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
                    isOpen ? 'translate-x-0' : '-translate-x-full'
                }`}
            >
                <div className="flex items-center justify-between gap-3 mb-6 px-2">
                    <div className="flex items-center gap-3">
                        <img
                            src="https://picsum.photos/id/42/40/40"
                            alt="User avatar"
                            className="w-8 h-8 rounded-full"
                        />
                        <span className="font-bold text-white">My Feedly</span>
                    </div>
                    <button
                        onClick={onClose}
                        className="md:hidden p-1 -mr-1 text-gray-400 hover:text-white"
                        aria-label="Close menu"
                    >
                        <XIcon className="w-6 h-6" />
                    </button>
                </div>

                <AddFeedForm onAddFeed={(url) => onAddFeed(url, null)} />

                <nav className="mt-6 flex-1 overflow-y-auto">
                    <h3 className="text-xs font-bold text-gray-500 uppercase px-2 mb-2">
                        Feeds
                    </h3>
                    <ul>
                        <li
                            onClick={() =>
                                onSelectItem({ type: 'all', id: null })
                            }
                            className={`flex items-center gap-3 px-2 py-2 rounded-md cursor-pointer text-sm font-medium ${
                                getIsSelected('all', null)
                                    ? 'bg-zinc-700 text-white'
                                    : 'hover:bg-zinc-700/50'
                            }`}
                        >
                            <RssIcon className="w-5 h-5" />
                            <span>All</span>
                        </li>
                        {feedsWithoutFolder.map((feed) => (
                            <li
                                key={feed.id}
                                onClick={() =>
                                    onSelectItem({ type: 'feed', id: feed.id })
                                }
                                className={`flex items-center gap-3 px-2 py-2 rounded-md cursor-pointer text-sm ${
                                    getIsSelected('feed', feed.id)
                                        ? 'bg-zinc-700 text-white'
                                        : 'hover:bg-zinc-700/50'
                                }`}
                            >
                                <span className="w-5"></span>
                                <span className="truncate flex-1">
                                    {feed.title}
                                </span>
                            </li>
                        ))}
                        {folders.map((folder) => (
                            <li key={folder.id}>
                                <div
                                    onClick={() =>
                                        onSelectItem({
                                            type: 'folder',
                                            id: folder.id,
                                        })
                                    }
                                    className={`flex items-center justify-between gap-3 px-2 py-2 rounded-md cursor-pointer text-sm font-medium ${
                                        getIsSelected('folder', folder.id)
                                            ? 'bg-zinc-700 text-white'
                                            : 'hover:bg-zinc-700/50'
                                    }`}
                                >
                                    <div className="flex items-center gap-3">
                                        <ChevronRightIcon className="w-3 h-3" />
                                        <FolderIcon className="w-5 h-5" />
                                        <span className="truncate">
                                            {folder.name}
                                        </span>
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
                                                        type: 'feed',
                                                        id: feed.id,
                                                    });
                                                }}
                                                className={`flex items-center gap-3 py-1.5 rounded-md cursor-pointer text-sm ${
                                                    getIsSelected(
                                                        'feed',
                                                        feed.id
                                                    )
                                                        ? 'bg-zinc-600 text-white'
                                                        : 'hover:bg-zinc-700/50'
                                                }`}
                                            >
                                                <span className="truncate flex-1">
                                                    {feed.title}
                                                </span>
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
