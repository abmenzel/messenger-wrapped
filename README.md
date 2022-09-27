# 💬 Messenger Wrapped

Explore your Facebook Messenger chat history, in a manner inspired by Spotify Wrapped.

Messenger Wrapped analyzes your uploaded messenger data and shows you interesting facts about a chosen group.
This includes:

- Total count of messages, photos, videos and audio minutes
- Most contributing members
- Linguistic level of chat members
- Chat history chart
- Most reacted images
- Most reacted videos

The application communicates directly with the file system through the [File System Access API](https://developer.mozilla.org/en-US/docs/Web/API/File_System_Access_API), meaning that no data needs to be uploaded remotely. Thereby the chat data is not shared or stored anywhere outside of the user's machine.

## 🚣 Demo

Try the [live demo](https://messenger-wrapped.vercel.app/).
The demo reflects the **main branch**.

## Technologies

- Next JS
- Tailwind CSS
- Typescript

## Getting Started

### ⏳ Installation

Install dependencies with

```bash
npm install
```

Start the application by running 

```bash
npm run dev
```

### 🖐 Requirements

**Node:**

- NodeJS >= 14
- NPM >= 6.x

## Contributing

See the [Contributing Guide](./CONTRIBUTING.md).

## License

See the [License](./LICENSE.md).