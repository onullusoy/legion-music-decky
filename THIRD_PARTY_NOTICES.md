# Credits and source lineage

Legion Music Decky is derived from [MusicControl](https://github.com/martinpl/MusicControl) by MartinPL, based on mirobouma's original plugin (through version 1.1.6).

Starting source: MusicControl 1.1.7, upstream commit `8b6713e1437e5fd6afebc3d6fd728006ed91e6cc`. The GNU GPL version 3 license in LICENSE is retained. No upstream copyright notices have been removed.

Changes dated 2026-11-16: remove unused getpass/linecache imports that prevent loading in the observed Bazzite/Decky Python environment; migrate the frontend and backend to Decky API v1; rename the UI; preserve spaces in player names; use a read-only volume capability probe; add tests, packaging and installation documentation.

This is an independent community project, not an official Lenovo, Bazzite, Decky or MusicControl release.
