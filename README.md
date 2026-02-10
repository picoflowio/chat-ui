# PicoFlow Chat - React Client

This is a React-based frontend for the PicoFlow Chat application, designed to mimic and enhance the original Streamlit UI.

## Features

- **Modern UI**: Dark theme, smooth animations, and responsive design.
- **Markdown Support**: Renders rich text messages.
- **Session Management**: Handles chat sessions and history clearing.
- **Flow Selection**: Switch between different workflows (DemoFlow, TutorialFlow, etc.).

## Prerequisites

- Node.js (v18+ recommended)
- Yarn package manager
- Backend API running on `http://localhost:8000`

## Setup

1.  Install dependencies:
    ```bash
    yarn install
    ```

2.  Start the development server:
    ```bash
    yarn dev
    ```

3.  Open [http://localhost:5173](http://localhost:5173) in your browser.

## Configuration

The application is configured to proxy API requests to `http://localhost:8000`. If your backend runs on a different port, update `vite.config.js`:

```javascript
server: {
  proxy: {
    '/ai': {
      target: 'http://localhost:8000', // Update this URL
      changeOrigin: true,
    }
  }
}
```

## Project Structure

- `src/components/`: UI components (Sidebar, ChatArea, Message, InputArea).
- `src/services/`: API integration.
- `src/App.jsx`: Main application logic and state management.
