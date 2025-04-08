# Gemini 2 Live - Codebase Inventory & Architecture Map

## Overview

This document provides a structured inventory and component relationship map for the Gemini 2 Live Electron application. It focuses on the `client/`, `server/`, `.env`, and `package.json` files, excluding development and auxiliary directories.

---

## Environment & Dependencies

- **Platform:** Electron app (`electron` and `electron-builder`)
- **Entry Point:** `server/main.js`
- **APIs:** 
  - OpenAI (via `.env` key)
  - Google Generative Language API (via WebSocket)
- **Build Targets:** Windows, Mac, Linux

---

## Root Files

| File/Dir         | Purpose                                                      |
|------------------|--------------------------------------------------------------|
| `.env`           | Stores API keys (OpenAI)                                     |
| `package.json`   | Electron app config, build scripts, dependencies             |
| `yarn.lock`      | Dependency lockfile                                          |
| `README.md`      | Project documentation                                       |

---

## Server

| File                     | Purpose                                                                                     |
|--------------------------|---------------------------------------------------------------------------------------------|
| `server/main.js`         | Electron main process entry point. Creates windows, handles IPC, screen capture.            |
| `server/preload.js`      | Exposes secure APIs to renderer via `contextBridge`.                                        |

---

## Client

| File/Dir                        | Purpose                                                                                     |
|---------------------------------|---------------------------------------------------------------------------------------------|
| `client/index.html`             | Main HTML entry point for renderer process                                                  |
| `client/css/styles.css`         | UI styling                                                                                   |
| `client/assets/icons/*.svg`     | UI icons                                                                                    |
| `client/js/script.js`           | Initializes `GeminiAgent`, main client logic                                                |
| `client/js/main/agent.js`       | Likely defines `GeminiAgent`, orchestrates client modules                                   |
| `client/js/ws/client.js`        | WebSocket client for Google Generative Language API                                         |
| `client/js/audio/`              | Audio recording, streaming, visualization, audio worklets                                   |
| `client/js/camera/`             | Camera access and management                                                                |
| `client/js/chat/`               | Chat management                                                                             |
| `client/js/config/`             | Client configuration                                                                        |
| `client/js/dom/`                | DOM elements and event handling                                                             |
| `client/js/screen/`             | Screen sharing or capture                                                                   |
| `client/js/settings/`           | Settings management and templates                                                           |
| `client/js/tools/`              | Tool integrations (e.g., Google Search)                                                     |
| `client/js/transcribe/`         | Transcription integration (e.g., Deepgram)                                                  |
| `client/js/utils/`              | Utility functions, drag-resize                                                              |

---

## Component Relationship Map

```mermaid
flowchart TD
    subgraph Electron_Main_Process
        A[server/main.js] -->|Exposes APIs| B[server/preload.js]
    end

    subgraph Renderer_Process
        C[client/index.html]
        C --> D[client/js/script.js]
        D --> E[GeminiAgent (client/js/main/agent.js)]
        E --> F1[Audio Modules]
        E --> F2[Camera Module]
        E --> F3[Chat Module]
        E --> F4[Screen Module]
        E --> F5[Settings Module]
        E --> F6[Tools Module]
        E --> F7[Transcribe Module]
        E --> F8[Utils]
        E --> G[WebSocket Client (client/js/ws/client.js)]
    end

    G -->|Connects via wss| H[Google Generative Language API]
    E -->|Uses| B
    B -->|IPC| A
```

---

## Summary

- The **Electron main process** manages the app lifecycle, window creation, and native features.
- The **preload script** exposes secure APIs to the renderer.
- The **renderer process** initializes `GeminiAgent`, which orchestrates all client modules.
- The **WebSocket client** connects to Google's Generative Language API for real-time AI interactions.
- The OpenAI API key is likely used for REST calls or fallback.
- Client modules interact with the Electron main process via the exposed preload APIs.

This inventory and map will guide future bug audits and optimization efforts.