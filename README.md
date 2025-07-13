# Youtube Transcription tool

Web app to transcribe and translate YouTube videos.

## How to run
1. config your env vars
```
YT_API_KEY=
XL8_API_KEY=
ANTHROPIC_API_KEY=
```
2. install dependencies
```
npm install
```
```
yarn install
```
```
pnpm install
```
```
bun install
```
3. run the app
```
npm run dev
```
```
yarn dev
```
```
pnpm dev
```
```
bun dev
```


## API Integration

- [Youtube](https://developers.google.com/youtube/v3)

For fetch video data:
```
https://content-youtube.googleapis.com/youtube/v3/videos
```

- [XL8](https://www.xl8.ai/documentations)

Request transcription:
```
https://api.xl8.ai/v1/autotemplate/request
```
Fetch transcription status:
```
https://api.xl8.ai/v1autotemplate/requests/${id}
```
Get the encoded transcription:
```
https://api.xl8.ai/v1/autotemplate/request/file/srt/${request_id}
```
Request translation:
```
https://api.xl8.ai/v1/autotemplate/request
```
Fetch translation status:
```
https://api.xl8.ai/v1/trans/requests/file/${request_id}
```
Get the encoded translation:
```
https://api.xl8.ai/v1/trans/requests/file/${request_id}
```

- [Vercel AI SDK](https://ai-sdk.dev/providers/ai-sdk-providers/anthropic)



## Features

- Fetch Video data: Fetch video data to display the title, thumbnail and duration.
- Transcription: Request and fetch transcription for the original video.
- Translation: Translate the transcription to a target language.
- IA parsing: Parsing the translation to enhance the transcription.
- Subtitles: Editing or download in srt or vtt format.

## Technlogiee
- Next.js for a fast building of a monolith and the neede.d of protecting the APIs keys within sever actions or APIs.
- Shadcn and tailwind for fast development and styling.
- Vercel AI SDK for fast development and integration with AI models.
- Axios for handling HTTP requests in a easier way.
