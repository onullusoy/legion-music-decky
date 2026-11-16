import asyncio
import importlib.util
import sys
import types
import unittest
from pathlib import Path
from unittest.mock import patch, Mock

sys.modules["decky"] = types.ModuleType("decky")
spec = importlib.util.spec_from_file_location("music_backend", Path(__file__).resolve().parents[1] / "main.py")
backend = importlib.util.module_from_spec(spec)
spec.loader.exec_module(backend)


class BackendTests(unittest.TestCase):
    def setUp(self):
        self.plugin = backend.Plugin()

    def test_import_does_not_require_getpass(self):
        import builtins
        original = builtins.__import__
        def guarded(name, *args, **kwargs):
            if name in ("getpass", "linecache"):
                raise AssertionError("unused host stdlib import")
            return original(name, *args, **kwargs)
        with patch("builtins.__import__", side_effect=guarded):
            exec(compile(Path(backend.__file__).read_text(), backend.__file__, "exec"), {})

    @patch.object(backend.subprocess, "Popen")
    def test_v1_instance_play_pause_uses_selected_player(self, popen):
        popen.return_value.communicate.return_value = ("method return", None)
        asyncio.run(self.plugin.sp_set_media_player("org.mpris.MediaPlayer2.test"))
        asyncio.run(self.plugin.sp_play())
        args, kwargs = popen.call_args
        self.assertIn("--dest=org.mpris.MediaPlayer2.test", args[0])
        self.assertIn("org.mpris.MediaPlayer2.Player.PlayPause", args[0])
        self.assertEqual(kwargs["env"]["DBUS_SESSION_BUS_ADDRESS"], f"unix:path=/run/user/{backend.os.getuid()}/bus")

    @patch.object(backend.subprocess, "Popen")
    def test_empty_bus_is_empty_player_list(self, popen):
        popen.return_value.communicate.return_value = ('method return\n array [\n string "org.freedesktop.DBus"\n ]', None)
        self.assertEqual(asyncio.run(self.plugin.sp_list_media_players()), "")

    @patch.object(backend.subprocess, "Popen")
    def test_identity_preserves_spaces(self, popen):
        popen.return_value.communicate.return_value = ('method return\n variant string "VLC media player"', None)
        self.assertEqual(asyncio.run(self.plugin.sp_identity("org.mpris.MediaPlayer2.vlc")), "VLC media player")

    @patch.object(backend.subprocess, "Popen")
    def test_volume_probe_does_not_write_volume(self, popen):
        popen.return_value.communicate.return_value = ('method return\n variant double 0.5', None)
        self.assertEqual(asyncio.run(self.plugin.sp_test_volume_control()), "true")
        self.assertEqual(popen.call_count, 1)
        self.assertIn("org.freedesktop.DBus.Properties.Get", popen.call_args.args[0])


if __name__ == "__main__":
    unittest.main()
