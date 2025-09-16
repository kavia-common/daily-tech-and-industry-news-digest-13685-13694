# Newsletter Admin Frontend

A lightweight React admin dashboard for a daily automated newsletter. It provides:
- Dashboard with key stats (sent, opens, clicks), latest run status, and vertical breakdown
- Run Logs with filtering by date and pagination
- Archive browsing with search and vertical filters
- Newsletter viewer rendering HTML/Markdown/JSON output
- Optional metadata editor to lay groundwork for future story review/editor features

No heavy UI frameworks; pure React and CSS for fast loads.

## Quick Start

1. Install dependencies
   - npm install

2. Configure API base URL
   - Create a .env file in newsletter_frontend root (sibling to package.json) and set:
     REACT_APP_API_BASE_URL=https://your-backend-host
   - This URL must expose:
     - GET /api/stats
     - GET /api/logs?page=&pageSize=&date=
     - GET /api/archive?page=&pageSize=&vertical=&q=
     - GET /api/newsletters/:id
     - POST /api/newsletters/:id/meta  (optional for metadata)

3. Run the app
   - npm start

Open http://localhost:3000

## Routes

- #/           Dashboard
- #/logs       Run logs list
- #/archive    Archive browser
- #/newsletter/:id  Newsletter viewer

Hash-based routing is used to avoid adding extra dependencies.

## Environment Variables

Create .env with the following:
- REACT_APP_API_BASE_URL=...  (required) Base URL for REST API

Do not commit secrets; use your deployment environment to provide values.

## Project Structure

- src/services/api.js         REST API client with typed methods
- src/pages/                  Pages (Dashboard, Logs, Archive, NewsletterView)
- src/components/Layout/      Layout and shared UI styles
- src/utils/                  Small helpers (formatting, debounce)
- src/App.js                  Entry point and simple hash router

## Extending to Story Review/Editor

- The NewsletterView includes a JSON metadata editor and save endpoint as a foundation.
- You can add dedicated components under src/pages/editor or src/components/editor and connect to new endpoints (e.g., /api/stories, /api/drafts).
- Prefer keeping business logic inside src/services and UI in pages/components.

## Testing

The default CRA test setup is included. Consider adding tests for components and API mocks as the app grows.
