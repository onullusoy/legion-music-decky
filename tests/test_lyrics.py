import json
from pathlib import Path
import tempfile
import unittest
from unittest.mock import MagicMock, patch
from urllib.error import HTTPError
import legion_lyrics as lyrics


class LyricsTests(unittest.TestCase):
    @patch.object(lyrics, "urlopen")
    def test_lyrics_are_cached_and_signature_is_encoded(self, opened):
        opened.return_value.__enter__.return_value.read.return_value = json.dumps({"plainLyrics": "A sample line\nAnother sample line"}).encode()
        client = lyrics.LyricsClient()
        first = client.get("A & B", "Example artist", 180)
        self.assertEqual(first["state"], "found")
        self.assertEqual(client.get("A & B", "Example artist", 180), first)
        self.assertEqual(opened.call_count, 1)
        self.assertIn("track_name=A+%26+B", opened.call_args.args[0].full_url)
        self.assertIn("duration=180", opened.call_args.args[0].full_url)
        self.assertEqual(opened.call_args.kwargs["timeout"], 6)

    @patch.object(lyrics, "urlopen")
    def test_synced_only_response_becomes_readable_text(self, opened):
        opened.return_value.__enter__.return_value.read.return_value = json.dumps({"syncedLyrics": "[ar:Example]\n[00:01.50]First sample\n[00:03.00]Second sample"}).encode()
        text = lyrics.LyricsClient().get("Example", "Artist")["text"]
        self.assertEqual(text, "First sample\nSecond sample")

    @patch.object(lyrics, "urlopen", side_effect=HTTPError("https://lrclib.net", 404, "missing", {}, None))
    def test_missing_result_is_cached(self, opened):
        client = lyrics.LyricsClient()
        self.assertEqual(client.get("Example", "Artist")["state"], "not_found")
        client.get("Example", "Artist")
        self.assertEqual(opened.call_count, 1)

    @patch.object(lyrics, "urlopen", side_effect=HTTPError("https://lrclib.net", 429, "limited", {"Retry-After": "300"}, None))
    def test_rate_limit_stops_new_track_requests(self, opened):
        client = lyrics.LyricsClient()
        self.assertEqual(client.get("One", "Artist")["state"], "unavailable")
        client.get("Two", "Artist")
        self.assertEqual(opened.call_count, 1)

    @patch.object(lyrics, "urlopen", side_effect=OSError("offline"))
    def test_network_failure_does_not_raise(self, _):
        self.assertEqual(lyrics.LyricsClient().get("Example", "Artist")["state"], "unavailable")

    @patch.object(lyrics, "urlopen")
    def test_no_track_makes_no_request(self, opened):
        self.assertEqual(lyrics.LyricsClient().get("Not Playing", "Unknown Artist")["state"], "idle")
        opened.assert_not_called()

    @patch.object(lyrics, "urlopen")
    def test_instrumental_has_its_own_state(self, opened):
        opened.return_value.__enter__.return_value.read.return_value = b'{"instrumental":true}'
        self.assertEqual(lyrics.LyricsClient().get("Example", "Artist")["state"], "instrumental")

    def test_preference_defaults_on_and_persists_off(self):
        with tempfile.TemporaryDirectory() as folder:
            pref = lyrics.LyricsPreferences(folder)
            self.assertTrue(pref.enabled())
            pref.set_enabled(False)
            self.assertFalse(lyrics.LyricsPreferences(folder).enabled())
            pref.set_enabled(True)
            self.assertTrue(lyrics.LyricsPreferences(folder).enabled())
