"""Optional LRCLIB lookup and local display preference, 2026-11-16."""
from collections import OrderedDict
import json
import math
import os
from pathlib import Path
import re
import tempfile
import threading
import time
from urllib.error import HTTPError
from urllib.parse import urlencode
from urllib.request import Request, urlopen


class LyricsPreferences:
    def __init__(self, directory):
        self.path = Path(directory) / "lyrics-settings.json"

    def enabled(self):
        try:
            value = json.loads(self.path.read_text()).get("enabled", True)
            return value if isinstance(value, bool) else True
        except (OSError, ValueError, AttributeError):
            return True

    def set_enabled(self, enabled):
        if not isinstance(enabled, bool):
            raise ValueError("Lyrics preference must be a boolean")
        self.path.parent.mkdir(parents=True, exist_ok=True)
        descriptor, name = tempfile.mkstemp(prefix=".lyrics-", dir=self.path.parent)
        try:
            with os.fdopen(descriptor, "w") as output:
                json.dump({"enabled": enabled}, output)
            os.replace(name, self.path)
        finally:
            if os.path.exists(name):
                os.unlink(name)
        return enabled


class LyricsClient:
    def __init__(self):
        self.cache = OrderedDict()
        self.lock = threading.Lock()
        self.retry_after = 0

    def get(self, title, artist, duration=0):
        title, artist = str(title).strip()[:256], str(artist).strip()[:256]
        if not title or not artist or artist == "Unknown Artist" or title == "Not Playing":
            return {"state": "idle", "text": ""}
        try:
            duration = float(duration)
            duration = round(duration) if math.isfinite(duration) and duration > 0 else 0
        except (ValueError, TypeError):
            duration = 0
        key = (title.casefold(), artist.casefold(), duration)
        with self.lock:
            now = time.monotonic()
            if key in self.cache and self.cache[key][0] > now:
                self.cache.move_to_end(key)
                return self.cache[key][1]
            if now < self.retry_after:
                return {"state": "unavailable", "text": ""}
            query = {"track_name": title, "artist_name": artist}
            if duration:
                query["duration"] = duration
            request = Request("https://lrclib.net/api/get?" + urlencode(query), headers={
                "User-Agent": "LegionMusicDecky/1.1.11 (https://github.com/onullusoy/legion-music-decky)"
            })
            result, ttl = {"state": "unavailable", "text": ""}, 60
            try:
                with urlopen(request, timeout=6) as response:
                    raw = response.read(262145)
                if len(raw) > 262144:
                    raise ValueError("Response too large")
                data = json.loads(raw)
                if not isinstance(data, dict):
                    raise ValueError("Unexpected response")
                if data.get("instrumental") is True:
                    result = {"state": "instrumental", "text": ""}
                else:
                    text = data.get("plainLyrics") or data.get("syncedLyrics") or ""
                    if not isinstance(text, str):
                        raise ValueError("Unexpected lyrics")
                    if not data.get("plainLyrics"):
                        text = re.sub(r"\[\d+:\d+(?:[.:]\d+)?\]", "", text)
                        text = re.sub(r"(?m)^\[[A-Za-z]+:.*\]\s*$", "", text)
                    text = text.strip()[:100000]
                    result = {"state": "found" if text else "not_found", "text": text}
                ttl = 3600
            except HTTPError as error:
                if error.code == 404:
                    result, ttl = {"state": "not_found", "text": ""}, 600
                elif error.code == 429:
                    try:
                        wait = max(60, min(3600, int(error.headers.get("Retry-After", "60"))))
                    except (ValueError, TypeError):
                        wait = 60
                    self.retry_after = time.monotonic() + wait
            except (OSError, ValueError, TypeError):
                pass
            self.cache[key] = (time.monotonic() + ttl, result)
            self.cache.move_to_end(key)
            while len(self.cache) > 32:
                self.cache.popitem(last=False)
            return result
