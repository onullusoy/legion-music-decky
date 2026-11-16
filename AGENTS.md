# Legion Music Decky

Decky music controls focused on Legion Go running Bazzite.

- `main.py`: non-root MPRIS backend using the desktop user's D-Bus session.
- `src/`: frontend using `@decky/api` and `@decky/ui`.
- `scripts/`: release packaging and backup-preserving local installation.
- `TODO.md`: device verification still required; read when updating validation evidence.

Keep the runtime folder `MusicControl` for replacement compatibility. Preserve the GPL license and upstream attribution. Capability probes must not alter playback.

Checks: `pnpm check`. Package: `pnpm package` after building.
