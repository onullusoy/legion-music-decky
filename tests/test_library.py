import asyncio
import json
import tempfile
import unittest
from pathlib import Path
from unittest.mock import patch
import legion_music_library as library

PLAYLIST = "https://open.spotify.com/playlist/37i9dQZF1DXcBWIGoYBM5M?si=example"
ALBUM = "spotify:album:4aawyAB9vmqN3uQ7FjRGTy"


class LibraryTests(unittest.TestCase):
    def setUp(self):
        self.temp = tempfile.TemporaryDirectory()
        self.addCleanup(self.temp.cleanup)
        self.store = library.LibraryStore(self.temp.name)

    def test_share_links_are_normalized_without_tracking(self):
        item = library.spotify_collection(PLAYLIST)
        self.assertEqual(item["uri"], "spotify:playlist:37i9dQZF1DXcBWIGoYBM5M")
        self.assertNotIn("?", item["url"])
        self.assertEqual(library.spotify_collection("https://open.spotify.com/intl-de/album/4aawyAB9vmqN3uQ7FjRGTy")["uri"], ALBUM)

    def test_non_spotify_and_non_collection_links_are_rejected(self):
        for value in ("file:///etc/passwd", "https://open.spotify.com.evil.test/playlist/37i9dQZF1DXcBWIGoYBM5M", "https://open.spotify.com@evil.test/playlist/37i9dQZF1DXcBWIGoYBM5M", "spotify:track:37i9dQZF1DXcBWIGoYBM5M", "https://spoti.fi/short", "https://open.spotify.com/playlist/nope"):
            with self.subTest(value=value), self.assertRaises(ValueError):
                library.spotify_collection(value)

    @patch.object(library, "public_metadata", return_value={"title": "Real Spotify title", "image": "https://i.scdn.co/image/test"})
    def test_shelf_persists_and_deduplicates(self, metadata):
        first = self.store.add(PLAYLIST)
        second = library.LibraryStore(self.temp.name).add(first[0]["uri"])
        self.assertEqual(first, second)
        self.assertEqual(second[0]["title"], "Real Spotify title")
        self.assertEqual(metadata.call_count, 1)
        self.assertEqual(self.store.path.stat().st_mode & 0o777, 0o600)

    @patch.object(library, "public_metadata", return_value={"title": "", "image": ""})
    def test_offline_save_and_remove_leave_other_cards_intact(self, _):
        self.store.add(PLAYLIST, "My gaming playlist")
        self.store.add(ALBUM)
        result = self.store.remove(ALBUM)
        self.assertEqual(len(result), 1)
        self.assertEqual(result[0]["title"], "My gaming playlist")

    def test_corrupt_shelf_is_not_overwritten(self):
        self.store.path.write_text("broken json")
        with self.assertRaises(ValueError):
            self.store.add(PLAYLIST)
        self.assertEqual(self.store.path.read_text(), "broken json")

    @patch.object(library, "urlopen", side_effect=OSError("offline"))
    def test_metadata_failure_has_an_offline_fallback(self, _):
        self.assertEqual(library.public_metadata(PLAYLIST), {"title": "", "image": ""})
