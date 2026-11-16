<div align="center">

# 🎵 Legion Music Decky

**Music controls for Legion Go on Bazzite**

![Decky](https://img.shields.io/badge/Decky-API%20v1-1a9fff)
![License](https://img.shields.io/badge/License-GPL--3.0-blue)
![Status](https://img.shields.io/badge/status-device%20testing-orange)

</div>

A compact player in Quick Access, a full-screen Music Room and a personal shelf of Spotify playlist and album shortcuts. Play/pause, skip tracks, seek, adjust player volume and switch between MPRIS-compatible players. Focused on the original Legion Go with Bazzite; other devices and distributions have not been validated.

Built on [MusicControl by MartinPL](https://github.com/martinpl/MusicControl), originally developed by **mirobouma**. Thank you to both projects and the Decky community. Original licenses and attribution are preserved.

## ✨ Your music room

- An original dark player with large artwork, elapsed time and clear transport controls.
- **Open music room** opens Listen, Your shelf and About pages with controller navigation.
- Add a full Spotify playlist or album link in **Your shelf → Add a link**. Spotify's public oEmbed service supplies the title and cover when available. You can give a link your own name; offline or unavailable metadata falls back to a plain shortcut.
- Select a card to **Open in Spotify**. Spotify must already be running on the device. The command hands the collection to Spotify; playback depends on the Spotify client.
- **Edit your shelf** removes local shortcuts without changing your Spotify account. Up to 48 collections are stored in Decky's plugin settings directory and survive plugin replacement.

This shelf uses links you add. It does not import your account library, browse tracks inside a playlist, or provide Spotify Connect. There is no login, API key or embedded web player. Spotify is contacted for public metadata only when you add a new collection; this is not polled in the background.

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
   https://github.com/onullusoy/legion-music-decky/releases/download/v1.1.9/LegionMusicDecky-1.1.9.zip
   ```

4. Open **Decky → Legion Music Decky**.

The archive uses the existing `MusicControl` directory and replaces Music Control. Back up your existing plugin before using URL installation. Use the source installer below for an automatic backup. Do not install a second copy of Music Control alongside this version. A later store reinstall of the original plugin can overwrite these changes.

## ▶️ Use

In Desktop Mode, add your music player to Steam as a non-Steam game. Return to Gaming Mode, launch it and start playback. Keep the player running while opening a game, then open Legion Music Decky. Use the player button to cycle between detected applications. Seek and volume support depend on the player.

Decky's panel is designed for Gaming Mode / Steam Big Picture, not as a standalone desktop settings window.

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

Thirteen backend checks cover compatibility, collection validation, persistence and launching. TypeScript validation and the frontend build pass. The user confirmed basic playback works in 1.1.8; the redesigned 1.1.9 panel, shelf and controller navigation still require on-device verification. See [TODO.md](TODO.md).

## 💜 License

GPL-3.0; see [LICENSE](LICENSE) and [credits](THIRD_PARTY_NOTICES.md). This is an independent community project.
