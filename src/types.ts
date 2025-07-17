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
    type: 'all' | 'folder' | 'feed';
    id: string | null;
};
