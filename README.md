<div align="center">
  <img src="https://raw.githubusercontent.com/udaysharmadev/Youtube-Downloader/main/public/og-image.png" alt="YouTube Downloader Banner" width="100%" style="border-radius: 12px; margin-bottom: 20px;" />

  <h1>📺 YouTube Downloader</h1>
  
  <p><strong>Fast, secure, and limitless media downloading. Built for the modern web.</strong></p>

  <p>
    <a href="https://github.com/udaysharmadev/Youtube-Downloader/stargazers"><img src="https://img.shields.io/github/stars/udaysharmadev/Youtube-Downloader?style=for-the-badge&color=000000" alt="Stars" /></a>
    <a href="https://github.com/udaysharmadev/Youtube-Downloader/issues"><img src="https://img.shields.io/github/issues/udaysharmadev/Youtube-Downloader?style=for-the-badge&color=000000" alt="Issues" /></a>
    <a href="https://github.com/udaysharmadev/Youtube-Downloader/network/members"><img src="https://img.shields.io/github/forks/udaysharmadev/Youtube-Downloader?style=for-the-badge&color=000000" alt="Forks" /></a>
    <a href="https://github.com/udaysharmadev/Youtube-Downloader/blob/main/LICENSE"><img src="https://img.shields.io/github/license/udaysharmadev/Youtube-Downloader?style=for-the-badge&color=000000" alt="License" /></a>
  </p>
  
  <p>
    <a href="#features">Features</a> •
    <a href="#architecture">Architecture</a> •
    <a href="#installation">Installation</a> •
    <a href="#contributing">Contributing</a>
  </p>
</div>

---

## ✨ Features

YouTube Downloader is engineered to provide a seamless, premium media extraction experience without the clutter of traditional downloading sites.

- 🚀 **Lightning Fast:** Processes and extracts metadata in milliseconds.
- 🎬 **True 4K/8K Support:** Downloads the absolute highest available native video quality and intelligently merges the best audio stream dynamically.
- 🎵 **Dedicated Audio Pipeline:** Need just the music? Extract crisp MP3s at 128kbps, 192kbps, or 320kbps instantly.
- 🛡️ **Privacy First:** 100% zero telemetry on your downloads. No tracking, no ads, no popups.
- 💎 **Premium Interface:** Built with Next.js 15, Tailwind CSS, and Framer Motion for a buttery-smooth, interactive user experience.
- 📚 **Smart History:** Keeps a local, searchable history of your recent downloads directly in your browser.

## 🏗️ Architecture

The application is split into a robust modern frontend and a powerful streaming backend:

- **Frontend:** `Next.js 15` App Router, `React`, `Tailwind CSS`, `Framer Motion`, `Shadcn UI`.
- **Backend:** Node.js streams natively executing `yt-dlp` in a spawned child process. 
- **Merging Engine:** Uses `FFmpeg` under the hood to combine high-res video streams (which lack native audio on YouTube) with the best available audio streams on-the-fly, ensuring perfect A/V sync without writing massive temporary files.

## 🚀 Installation

Running YouTube Downloader locally is straightforward.

### Prerequisites

You must have the following installed on your machine:
- [Node.js](https://nodejs.org/en/) (v18 or higher)
- [Python 3](https://www.python.org/downloads/) (Required for `yt-dlp`)
- [FFmpeg](https://ffmpeg.org/download.html) (Required for merging video/audio and format conversion)

### Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/udaysharmadev/Youtube-Downloader.git
   cd Youtube-Downloader
   ```

2. **Install Node dependencies:**
   ```bash
   npm install
   ```

3. **Install `yt-dlp` globally:**
   ```bash
   # On macOS (Homebrew)
   brew install yt-dlp
   
   # On Linux/Windows via pip
   python3 -m pip install -U yt-dlp
   ```

4. **Start the development server:**
   ```bash
   npm run dev
   ```

5. **Open the App:** Navigate to [http://localhost:3000](http://localhost:3000)

## 📖 Usage

1. **Paste a Link**: Copy any YouTube URL and paste it into the downloader form.
2. **Hit Enter**: The app instantly fetches all available native qualities.
3. **Select Format**: Choose between crisp video resolutions or high-fidelity audio streams.
4. **Download**: The backend seamlessly streams the optimized file directly to your local device.

## 🤝 Contributing

We love open source! Whether you're fixing bugs, improving the documentation, or proposing new features, your contributions are welcome.

Please read our [Contributing Guidelines](CONTRIBUTING.md) and our [Code of Conduct](CODE_OF_CONDUCT.md) before submitting a Pull Request.

**Looking for a place to start?**
Check out the [Issues tab](https://github.com/udaysharmadev/Youtube-Downloader/issues) for `good first issue` labels.

## ⭐ Show your support

If you found this project helpful, please give it a ⭐️! It helps the project grow and reach more developers.

---

<div align="center">
  Built with ❤️ by <a href="https://github.com/udaysharmadev">Uday Sharma</a> and the open-source community.
</div>
