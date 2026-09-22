# Crave House Web

Customer-facing Crave House ordering website. The frontend is intentionally separated from the backend API repository.

## Run

```bash
npm install
cp .env.example .env
npm run dev
```

Set `VITE_API_URL` to the deployed API URL in production.

## Product model

Menu items, categories, prices, availability and featured status are retrieved from the Crave House API, so admins can change menu pricing/content without changing frontend code.
