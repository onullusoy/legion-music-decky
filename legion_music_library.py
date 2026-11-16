"""Local Spotify collection bookmarks, created 2026-11-16 for Legion Music Decky."""
import json
import os
import re
import tempfile
from pathlib import Path
from urllib.parse import urlparse, urlencode
from urllib.request import Request, urlopen


def spotify_collection(value):
    """Accept only Spotify playlist/album IDs, never arbitrary launch targets."""
    value = value.strip()
    match = re.fullmatch(r"spotify:(playlist|album):([A-Za-z0-9]{22})", value)
    if not match:
        parsed = urlparse(value)
        if parsed.scheme != "https" or parsed.netloc != "open.spotify.com":
            raise ValueError("Paste an open.spotify.com playlist or album link.")
        match = re.fullmatch(r"/(?:intl-[a-z]{2}/)?(playlist|album)/([A-Za-z0-9]{22})/?", parsed.path)
    if not match:
        raise ValueError("Use a full Spotify playlist or album link, not a short link.")
    kind, ident = match.groups()
    return {"uri": f"spotify:{kind}:{ident}", "url": f"https://open.spotify.com/{kind}/{ident}", "kind": kind}


def public_metadata(url):
    """Fetch public title/art only. No cookies, account tokens or embed HTML."""
    request = Request("https://open.spotify.com/oembed?" + urlencode({"url": url}),
                      headers={"User-Agent": "LegionMusicDecky/1.1.9"})
    try:
        with urlopen(request, timeout=6) as response:
            info = json.loads(response.read(262145))
        if not isinstance(info, dict):
            return {"title": "", "image": ""}
        title = str(info.get("title", ""))[:120]
        image = str(info.get("thumbnail_url", ""))
        parsed = urlparse(image)
        host = parsed.hostname or ""
        if parsed.scheme != "https" or not any(host == h or host.endswith("." + h) for h in ("scdn.co", "spotifycdn.com")):
            image = ""
        return {"title": title, "image": image}
    except (OSError, ValueError, TypeError):
        return {"title": "", "image": ""}


class LibraryStore:
    def __init__(self, directory):
        self.path = Path(directory) / "spotify-collections.json"

    def list(self):
        if not self.path.exists():
            return []
        try:
            items = json.loads(self.path.read_text())
            if not isinstance(items, list) or len(items) > 48:
                raise ValueError()
            for item in items:
                if not isinstance(item, dict) or not isinstance(item.get("uri"), str) or spotify_collection(item["uri"])["uri"] != item["uri"]:
                    raise ValueError()
            return items
        except (OSError, ValueError, KeyError, TypeError):
            raise ValueError("Saved collections could not be read. Your file has not been changed.") from None

    def _write(self, items):
        self.path.parent.mkdir(parents=True, exist_ok=True)
        descriptor, temporary = tempfile.mkstemp(prefix=".collections-", dir=self.path.parent)
        try:
            with os.fdopen(descriptor, "w") as output:
                json.dump(items, output, ensure_ascii=False, indent=2)
                output.flush()
                os.fsync(output.fileno())
            os.replace(temporary, self.path)
        finally:
            if os.path.exists(temporary):
                os.unlink(temporary)

    def add(self, value, name=""):
        collection = spotify_collection(value)
        items = self.list()
        if any(item["uri"] == collection["uri"] for item in items):
            return items
        if len(items) >= 48:
            raise ValueError("Your shelf is full. Remove a collection before adding another.")
        metadata = public_metadata(collection["url"])
        collection.update(title=name.strip()[:120] or metadata["title"] or f"Spotify {collection['kind']}", image=metadata["image"])
        self._write([*items, collection])
        return self.list()

    def remove(self, uri):
        uri = spotify_collection(uri)["uri"]
        items = [item for item in self.list() if item["uri"] != uri]
        self._write(items)
        return items
