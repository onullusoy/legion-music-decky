<div align="center">

# 🎵 Legion Music Decky

**Music controls for Legion Go on Bazzite**

![Decky](https://img.shields.io/badge/Decky-API%20v1-1a9fff)
![License](https://img.shields.io/badge/License-GPL--3.0-blue)
![Status](https://img.shields.io/badge/status-device%20testing-orange)

</div>

A compact player in Quick Access and a full-screen Music Room. Play/pause, skip tracks, seek, adjust player volume and switch between MPRIS-compatible players. Focused on the original Legion Go with Bazzite; other devices and distributions have not been validated.

Built on [MusicControl by MartinPL](https://github.com/martinpl/MusicControl), originally developed by **mirobouma**. Thank you to both projects and the Decky community. Original licenses and attribution are preserved.

## ✨ Your music room

- A compact, viewport-sized Music Room with horizontal artwork, elapsed time and clear transport controls. The lyrics scroll inside their panel; short screens can scroll the player card without scrolling the whole page.
- **Open music room** opens Listen and About pages with controller navigation.
- Lyrics from [LRCLIB](https://lrclib.net/docs) replace the promotional side card. Lyrics start enabled; **Lyrics on / Lyrics off** saves your preference.
- Turn lyrics off to make the player full width. Turning them off stops new lyric lookups.
- Lookups send the track title, artist and duration to LRCLIB, once per track, only while the lyrics panel is open. Responses are cached in memory; lyrics are not saved to disk. Missing lyrics, instrumental tracks and connection errors have separate states. There is no login or API key.
- Controls work with compatible music apps already running on the device.

## 🔧 Compatibility work

- Fix the observed startup crash in `getpass` (`frozendict` missing) by removing unused imports.
- Move to current `@decky/api` / `@decky/ui` and backend API v1.
- Keep player names containing spaces intact.
- Check volume support without temporarily changing the player's volume.

## 📦 Install

Requires Bazzite, Decky Loader and a music player supporting MPRIS, such as Spotify. This plugin is not in the official Decky store.

1. Open Decky settings → General and enable Developer mode.
2. Open Developer → Install plugin from URL.
3. Paste:

   ```text
   https://github.com/onullusoy/legion-music-decky/releases/download/v1.1.13/LegionMusicDecky-1.1.13.zip
   ```

4. Open **Decky → Legion Music Decky**.

The archive uses the existing `MusicControl` directory and replaces Music Control. Back up your existing plugin before using URL installation. Use the source installer below for an automatic backup. Do not install a second copy of Music Control alongside this version. A later store reinstall of the original plugin can overwrite these changes.

## ▶️ Use

In Desktop Mode, add your music player to Steam as a non-Steam game. Return to Gaming Mode, launch it and start playback. Keep the player running while opening a game, then open Legion Music Decky. Use the player button to cycle between detected applications. Seek and volume support depend on the player.

Decky's panel is designed for Gaming Mode / Steam Big Picture, not as a standalone desktop settings window.

### YouTube in a browser

The player selector accepts any app exposing MPRIS, including supported Firefox/Chromium browser sessions. Play a YouTube video in the browser on the same device, keep it running and use **Switch player** to select the browser. This controls the browser's current media session; there is no embedded YouTube browser, search or playlist API. Which controls and metadata appear depends on the browser and video. Live YouTube playback has not yet been verified on the Legion Go.

## 🛠️ Build from source

Requires Node.js, pnpm 8 and Python 3.

```sh
git clone https://github.com/onullusoy/legion-music-decky.git
cd legion-music-decky
pnpm install --frozen-lockfile
pnpm check
python3 scripts/install-local.py  # prompts for admin authentication
```

The installer backs up the existing plugin, preserves settings and restarts Decky. `pnpm package` creates the release ZIP in `artifacts/`. See [SOURCE.md](SOURCE.md) for corresponding source.

## 🧪 Validation

Sixteen backend checks cover compatibility, playback, lyric matching requests, caching and the saved toggle. TypeScript validation and the frontend build pass. The user confirmed basic playback works in 1.1.8; the 1.1.13 lyrics panel and controller navigation still require on-device verification. See [TODO.md](TODO.md).

## 💬 Device compatibility feedback

Trying this plugin on a **Legion Go 2** or another handheld? We'd appreciate your feedback on how well it integrates with your device, including what works and what doesn't. Please [open an issue](https://github.com/onullusoy/legion-music-decky/issues) with your device model, OS, Decky Loader and plugin versions, and the features you tested. Reports of successful use are welcome too! Please remove personal information and device serial numbers from any logs or screenshots you share.

Compatibility with these devices has not yet been verified.

## 💜 License

GPL-3.0; see [LICENSE](LICENSE) and [credits](THIRD_PARTY_NOTICES.md). This is an independent community project.
