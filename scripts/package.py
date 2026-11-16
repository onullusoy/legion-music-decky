#!/usr/bin/env python3
"""Package a built plugin; invoke pnpm check first."""
from pathlib import Path
import hashlib
import json
import zipfile

root = Path(__file__).resolve().parents[1]
assert (root / "dist/index.js").is_file(), "Run pnpm check first"
version = json.loads((root / "package.json").read_text())["version"]
output = root / "artifacts" / f"LegionMusicDecky-{version}.zip"
output.parent.mkdir(exist_ok=True)
files = [root / p for p in ("main.py", "legion_music_library.py", "plugin.json", "package.json", "README.md", "LICENSE", "THIRD_PARTY_NOTICES.md", "SOURCE.md")]
for folder in ("dist", "assets"):
    files.extend(p for p in (root / folder).rglob("*") if p.is_file())
with zipfile.ZipFile(output, "w", zipfile.ZIP_DEFLATED) as archive:
    for path in sorted(files):
        archive.write(path, Path("MusicControl") / path.relative_to(root))
print(output)
print("SHA-256:", hashlib.sha256(output.read_bytes()).hexdigest())
