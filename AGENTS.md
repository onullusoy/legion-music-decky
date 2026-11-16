# Legion Music Decky

Decky music controls focused on Legion Go running Bazzite.

- `main.py`: non-root MPRIS backend using the desktop user's D-Bus session.
- `legion_music_library.py`: validated Spotify shortcuts, public oEmbed metadata and atomic local persistence.
- `src/`: frontend using `@decky/api` and `@decky/ui`.
- `scripts/`: release packaging and backup-preserving local installation.
- `TODO.md`: device verification still required; read when updating validation evidence.

Keep the runtime folder `MusicControl` for replacement compatibility. Preserve the GPL license and upstream attribution. Capability probes must not alter playback. The shelf is account-free; do not add login or private library access implicitly.

Checks: `pnpm check`. Package: `pnpm package` after building.
