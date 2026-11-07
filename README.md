# NeoEE

A small desktop tool for Neo Empire Earth players. Manage your saved games, set up a match and let a roulette pick the settings. Available in English and Spanish.

[![Issues](https://img.shields.io/github/issues/JMF-Alex/NeoEE?style=flat-square)](https://github.com/JMF-Alex/NeoEE/issues)
![Rust](https://img.shields.io/badge/Rust-000000?style=flat-square&logo=rust&logoColor=white)
![Tauri](https://img.shields.io/badge/Tauri_2-24C8D8?style=flat-square&logo=tauri&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=flat-square&logo=react&logoColor=61DAFB)
![Platform](https://img.shields.io/badge/Platform-Windows-0078D4?style=flat-square)

## Table of Contents

1. [Features](#features)
2. [Getting Started](#getting-started)
   * [Prerequisites](#prerequisites)
   * [Installation](#installation)
3. [Usage](#usage)
4. [Configuration](#configuration)
5. [Building an Executable](#building-an-executable)
6. [Running the Tests](#running-the-tests)
7. [Project Structure](#project-structure)
8. [Contributing](#contributing)
9. [License](#license)

## Features

- **Saved games manager**: list, select, delete and open the game's `Saved Games` folder. Files are sorted by date, newest first.
- **Autosave cleanup**: remove every `AutoSave` file in one click.
- **Desktop transfer**: move saves to the desktop to share them, and bring `.ees` files from the desktop back into the game folder.
- **Match setup**: choose the map size, difficulty, map type and match type, randomize them, and copy the result to the clipboard.
- **Roulette**: spin a wheel over the built in option lists or over your own, one option per line.
- **English and Spanish**: starts in your system language, and the switch in the sidebar remembers your choice.
- **Safe file handling**: file names are validated so an action can never reach outside the saves or desktop folder.
- **Small and native**: built with Rust and Tauri, using the WebView2 runtime that ships with Windows.

## Getting Started

### Prerequisites

- Windows 10 or 11 with the [WebView2 runtime](https://developer.microsoft.com/microsoft-edge/webview2/).
- [Rust](https://rustup.rs/) (stable, MSVC toolchain).
- [Visual Studio Build Tools](https://visualstudio.microsoft.com/visual-cpp-build-tools/) with the **Desktop development with C++** workload.
- [Node.js 20+](https://nodejs.org/) and [pnpm](https://pnpm.io/installation).

### Installation

1. Clone the repository and enter it:

```bash
git clone https://github.com/JMF-Alex/NeoEE.git
cd NeoEE
```

2. Install the frontend dependencies:

```bash
pnpm install
```

3. Run the app in development mode (starts Vite and the app, with live reload):

```bash
pnpm tauri dev
```

## Usage

| Page        | What you can do                                                                                   |
| ----------- | ------------------------------------------------------------------------------------------------- |
| Saved games | Reload the list, open the folder, select files to delete or move to the desktop, import from it. |
| Match setup | Pick the four match options, randomize them, or copy them as JSON.                               |
| Roulette    | Choose a preset list or type your own options, then spin the wheel.                              |

Use the **ES / EN** switch at the bottom of the sidebar to change the language.

## Configuration

NeoEE looks for the saved games in `E:\Neo Empire Earth\Empire Earth\Data\Saved Games`, and falls back to `C:\Program Files (x86)\Neo Empire Earth\Empire Earth\Data\Saved Games`.

If your game lives somewhere else, open **Settings** in the sidebar and enter the folder. It is stored in `config.json` inside the app's config directory and checked to be an existing folder before it is saved.

## Building an Executable

```bash
pnpm tauri build --no-bundle   # a single target/release/NeoEE.exe
pnpm tauri build               # also builds .msi and setup .exe installers in target/release/bundle/
```

Always build through `pnpm tauri build`. A plain `cargo build --release` produces an exe that expects the development server and opens a blank window.

## Running the Tests

```bash
cargo test     # Rust: config, file handling, errors and models (tests/ mirrors src/)
pnpm build     # TypeScript type check and frontend build
```

## Project Structure

```text
NeoEE/
├── src/                         Rust backend
│   ├── main.rs                  Entry point: registers the commands and starts the app
│   ├── lib.rs                   Library root, so the tests in tests/ can use the code
│   ├── error.rs                 AppError, sent to the UI as a plain message
│   ├── models.rs                Types shared with the UI (Info, Entry)
│   ├── commands/                What the window can call
│   │   ├── settings.rs          App info and the saved games folder
│   │   └── saves.rs             List, delete, move and import saves
│   └── services/                Logic with no Tauri commands
│       ├── config.rs            Config file and default game folders
│       └── fs.rs                Safe paths, moving and listing files
├── tests/                       Rust tests, mirroring src/ (listed as [[test]] in Cargo.toml)
├── ui/                          React + Tailwind CSS 4 frontend
│   ├── main.tsx, App.tsx        Entry point and window layout
│   ├── index.css                Design tokens and text styles
│   ├── i18n/                    English and Spanish dictionaries and provider
│   ├── lib/                     Typed Tauri calls, option lists, class helpers
│   ├── hooks/                   useToast and useConfirm
│   ├── components/
│   │   ├── ui/                  Building blocks (Button, Panel, Select, Modal)
│   │   └── layout/              Sidebar, settings dialog and navigation
│   └── features/
│       ├── files/               Saved games page
│       ├── game/                Match setup page
│       └── roulette/            Roulette page and wheel
├── icons/                       Application icons
└── tauri.conf.json              Window and bundle settings
```

## Contributing

Contributions are welcome!

1. Fork the repository
2. Create a new branch (`git checkout -b feature/MyFeature`)
3. Commit your changes (`git commit -m "Add new feature"`)
4. Push to your branch (`git push origin feature/MyFeature`)
5. Open a Pull Request

New text goes in both `ui/i18n/en.ts` and `ui/i18n/es.ts`. The Spanish file is typed against the English one, so a missing translation fails the build.

## License

Distributed under the MIT license.
