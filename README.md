# ChatGPT Clone

A ChatGPT clone built with Remix, Tailwind, Shadcn/ui, and the Vercel AI sdk. It does not replicate every single feature from chatGPT like account management and account plans as they are irrelevant to a protoype, but I did my best to build the core functionality of it. I love the chatGPT UI/UX and mostly just wanted the satisfaction of building it from scratch. I _may_ build some other features into it that are not currently in the web app like STT/TTS via the whisper api at some time in the future.

**Features:**

- Create and store chats
- Streamed responses
- Model selection
- Prompt suggestions
- Mobile first

**Tech Stack:**

- Remix (React)
- Tailwind CSS
- Vercel AI SDK
- Shadcn/UI
- Jotai
- Indexed DB

## Development

From your terminal:

```sh
npm run dev
```

This starts the app in development mode.

## Deployment

First, build your app for production:

```sh
npm run build
```

Then run the app in production mode:

```sh
npm start
```

Now you'll need to pick a host to deploy it to.

### DIY

If you're familiar with deploying node applications, the built-in Remix app server is production-ready.

Make sure to deploy the output of `remix build`

- `build/`
- `public/build/`
