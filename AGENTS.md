# Legion Music Decky

Decky music controls focused on Legion Go running Bazzite.

- `main.py`: non-root MPRIS backend using the desktop user's D-Bus session.
- `legion_lyrics.py`: optional LRCLIB lookup, bounded in-memory cache and saved toggle.
- `src/`: frontend using `@decky/api` and `@decky/ui`.
- `scripts/`: release packaging and backup-preserving local installation.
- `TODO.md`: device verification still required; read when updating validation evidence.

Keep the runtime folder `MusicControl` for replacement compatibility. Preserve the GPL license and upstream attribution. Capability probes must not alter playback. Do not add personal names or personal bylines to the UI or package metadata. The removed Spotify shelf feature must not be reintroduced without a user request.

Checks: `pnpm check`. Package: `pnpm package` after building.

Lyrics default on, but disabling them must stop new external lookups. Fetch off the Decky event loop and cache by track signature; never poll the lyrics service every second.
