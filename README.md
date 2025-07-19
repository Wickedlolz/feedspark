# FeedSpark ✨

FeedSpark is a modern, intelligent RSS feed reader designed to streamline your content consumption. It combines a clean, Feedly-inspired interface with the power of Google's Gemini AI to provide concise summaries of any article, helping you stay informed faster.

![FeedSpark Screenshot](https://storage.googleapis.com/project-screenshots/feedspark-screenshot.png)
_(Note: This is a representative screenshot)_

## Table of Contents

- [Purpose](#purpose)
- [Key Features](#key-features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [How It Works](#how-it-works)

## Purpose

In an age of information overload, staying updated with your favorite blogs, news sites, and publications can be overwhelming. FeedSpark aims to solve this by:

1.  **Aggregating:** Bringing all your desired content from various RSS feeds into one clean, organized dashboard.
2.  **Organizing:** Allowing you to group feeds into customizable folders for easy navigation and topic-based reading.
3.  **Summarizing:** Leveraging the Google Gemini API to generate AI-powered summaries, giving you the key takeaways from an article without needing to read it in its entirety.

## Key Features

- **Add & Manage Feeds:** Easily add new RSS feeds by URL.
- **Folder Organization:** Group related feeds into folders.
- **Unified "All" View:** See a chronological list of articles from all your subscribed feeds.
- **🔝 AI Summaries:** Generate a concise, one-paragraph summary for any article with a single click, powered by Gemini.
- **🔝 AI-Curated "Top Stories":** Automatically identify the 5 most significant and newsworthy articles from your selected feeds using Gemini's powerful JSON mode.
- **Clean UI:** A modern, responsive, and dark-mode interface inspired by popular readers like Feedly.
- **Client-Side Persistence:** Your feeds and folders are saved directly in your browser's `localStorage`, so your setup is remembered between sessions.
- **No Backend Needed:** The entire application runs in the browser, using a CORS proxy to fetch feeds and the Gemini API for intelligence.

## Tech Stack

- **Frontend:** React, TypeScript
- **Styling:** Tailwind CSS
- **AI:** Google Gemini API (`@google/genai`)
- **Modules:** Loaded directly in the browser via ESM over `esm.sh`
- **Parsing:** Native `DOMParser` for handling RSS/XML data.

## Getting Started

Follow these steps to run FeedSpark on your local machine.

### Prerequisites

- A modern web browser (Chrome, Firefox, Safari, Edge).
- A **Google Gemini API Key**. You can obtain one from [Google AI Studio](https://aistudio.google.com/app/apikey).

### Environment Configuration

This application requires the Gemini API key to be available as an environment variable named `API_KEY` in the execution environment. The application is designed to be run in an environment where this variable is pre-configured and accessible.

**For local development**, you would typically use a tool like Vite or `webpack` that can read `.env` files and make the variables available to the application. If you were to use such a tool, you would:

1.  Create a file named `.env` in the root of the project directory.
2.  Add your API key to this file:
    ```
    API_KEY=YOUR_GEMINI_API_KEY_HERE
    ```

### Running the Application

Since the project is set up with static files, you need a local web server to serve them.

1.  **Navigate** to the project directory in your terminal.
2.  **Start a local server.** Here are two common ways:

    - Using Python's built-in server:
      ```bash
      python3 -m http.server
      ```
    - Using the `serve` package from Node.js:
      ```bash
      npx serve .
      ```

3.  **Open the app:** Open your web browser and navigate to the local address provided by the server (e.g., `http://localhost:8000` or `http://localhost:3000`).

> **Note:** For the Gemini summarization feature to work, the environment serving the files must correctly provide the `API_KEY` as a process environment variable. The current static setup does not do this out-of-the-box. When you click "Summarize with Gemini," it will fail if the key is not present.

## Project Structure

The project is organized into components, services, and types for clarity and maintainability.

```
/
├── components/           # React components for the UI
│   ├── FeedItem.tsx      # Renders a single article
│   ├── Icons.tsx         # SVG icon components
│   ├── MainContent.tsx   # The main view for articles
│   └── Sidebar.tsx       # The left sidebar for navigation
├── services/             # Logic for external interactions
│   ├── geminiService.ts  # Handles all calls to the Gemini API
│   └── rssService.ts     # Fetches and parses RSS feeds
├── App.tsx               # Main application component, manages state
├── index.html            # The entry point of the application
├── index.tsx             # Renders the React application
├── metadata.json         # Application metadata
├── README.md             # This file
└── types.ts              # TypeScript type definitions
```

## How It Works

### RSS Fetching

The app uses the `api.allorigins.win` CORS proxy to get around browser restrictions that prevent fetching XML data from different domains. The `rssService.ts` module sends a request to this proxy with the target RSS feed URL. The service then parses the returned XML into a standardized `Article` object.

### State Management

The main `App.tsx` component acts as the primary state manager. It holds the lists of `folders`, `feeds`, and `articles` and persists `folders` and `feeds` to `localStorage`. All state modifications are handled through callbacks passed down to child components.

### AI Summarization

When you click the "Summarize with Gemini" button on an article, the `geminiService.ts` module is called. It sends the article's content to the `gemini-2.5-flash` model with a specific prompt asking for a concise summary. The returned text is then displayed in the UI.
