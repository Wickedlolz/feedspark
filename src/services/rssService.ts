import type { Article } from "@/src/types";

const CORS_PROXY = "https://corsproxy.io/?";

const getText = (node: Element | Document, selector: string): string => {
  const element = node.querySelector(selector);
  return element?.textContent || "";
};

export const fetchAndParseRss = async (
  url: string
): Promise<{ feedTitle: string; articles: Article[] }> => {
  const proxiedUrl = `${CORS_PROXY}${url}`;

  try {
    const response = await fetch(proxiedUrl);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const xmlString = await response.text();
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlString, "application/xml");

    const errorNode = xmlDoc.querySelector("parsererror");
    if (errorNode) {
      throw new Error("Failed to parse XML");
    }

    const feedTitle =
      getText(xmlDoc, "channel > title") || getText(xmlDoc, "feed > title");

    const items = Array.from(xmlDoc.querySelectorAll("item, entry"));

    const articles: Article[] = items.map((item, index) => {
      const title = getText(item, "title");
      const link =
        item.querySelector("link")?.getAttribute("href") ||
        getText(item, "link");
      const pubDate =
        getText(item, "pubDate") ||
        getText(item, "published") ||
        getText(item, "updated");
      const creator =
        getText(item, "dc\\:creator") || getText(item, "author > name");
      const contentSnippet =
        getText(item, "description") || getText(item, "summary");
      const content = getText(item, "content\\:encoded") || contentSnippet; // Fallback to snippet
      const id = getText(item, "guid") || link || `${url}-${index}`;

      return {
        id,
        title,
        link,
        pubDate,
        creator,
        contentSnippet,
        content,
        feedTitle,
      };
    });

    return { feedTitle, articles };
  } catch (error) {
    console.error(`Failed to fetch or parse RSS feed from ${url}:`, error);
    throw error;
  }
};
