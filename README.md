# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

## WhatsApp Chatbot (Cloud API)

This project now includes a WhatsApp chatbot server in `whatsapp-bot/server.js`.

### 1) Configure environment variables

Copy `whatsapp-bot/.env.example` into `whatsapp-bot/.env` and set:

- `WA_VERIFY_TOKEN`: token used by Meta to verify your webhook
- `WA_ACCESS_TOKEN`: access token from Meta WhatsApp Cloud API
- `WA_PHONE_NUMBER_ID`: phone number id from Meta
- `PORT`: bot server port (default `3001`)

### 2) Run the bot

- Bot only: `npm run dev:bot`
- Frontend + bot: `npm run dev:all`

### 3) Expose webhook URL

For local testing, expose your local port with ngrok:

`ngrok http 3001`

Use this URL in Meta App Dashboard for webhook callback:

`https://your-ngrok-domain/webhook`

### 4) Meta webhook configuration

In Meta Developer dashboard (WhatsApp Cloud API):

- Set callback URL to `/webhook`
- Set verify token exactly equal to `WA_VERIFY_TOKEN`
- Subscribe to `messages`

### 5) Test

Send a WhatsApp message to your business number and the bot will auto-reply.

Supported keywords:

- prix
- livraison
- tailles
- promo
- humain
