// Original full-screen music room for Legion Music Decky, 2026-11-16.
import { PropsWithChildren, useEffect, useState } from "react";
import { DialogButton, Focusable, Navigation } from "@decky/ui";
import { FaArrowLeft, FaHeadphones, FaMusic, FaInfoCircle, FaAlignLeft } from "react-icons/fa";
import { Lyrics } from "./lyrics";
import { getLyricsEnabled, setLyricsEnabled } from "../python";
import { InfoPage } from "../routes/pages/info";

export const MusicRoom = ({ children }: PropsWithChildren) => {
  const [tab, setTab] = useState("listen");
  const [lyrics, setLyrics] = useState<boolean | null>(null);
  const [saving, setSaving] = useState(false);
  const [preferenceError, setPreferenceError] = useState(false);
  useEffect(() => {
    let active = true;
    void getLyricsEnabled().then(value => { if (active) setLyrics(value); })
      .catch(() => { if (active) { setLyrics(true); setPreferenceError(true); } });
    return () => { active = false; };
  }, []);
  const toggleLyrics = async () => {
    setSaving(true); setPreferenceError(false);
    try { setLyrics(await setLyricsEnabled(!lyrics)); }
    catch { setPreferenceError(true); }
    finally { setSaving(false); }
  };
  return <Focusable className="lmd lmd-room" onCancelButton={() => Navigation.NavigateBack()}>
    <header className="room-header"><div className="wordmark"><span className="brand-mark"><FaHeadphones /></span><div><div className="brand-name">LEGION MUSIC</div><div className="brand-sub">YOUR GAME. YOUR SOUND.</div></div></div>
      <DialogButton className="btn quiet" onClick={() => Navigation.NavigateBack()}><FaArrowLeft /> Back to game</DialogButton></header>
    <div className="eyebrow">A LITTLE SPACE FOR YOUR SOUNDTRACK</div><h1 className="room-heading">Set the mood. Stay in the game.</h1>
    <Focusable className="tabs" flow-children="horizontal">
      <DialogButton className={`btn tab ${tab === "listen" ? "active" : ""}`} onClick={() => setTab("listen")}><FaMusic /> Listen</DialogButton>
      <DialogButton className={`btn tab ${tab === "about" ? "active" : ""}`} onClick={() => setTab("about")}><FaInfoCircle /> About</DialogButton>
      {tab === "listen" && <DialogButton className={`btn ${lyrics ? "active" : ""}`} style={{ marginLeft: "auto" }} disabled={saving || lyrics === null} onClick={() => void toggleLyrics()}>
        <FaAlignLeft /> {lyrics ? "Lyrics on" : "Lyrics off"}
      </DialogButton>}
    </Focusable>
    {preferenceError && <p className="muted" role="status">Could not save the lyrics preference. Please try again.</p>}
    {tab === "listen" && <div className={`room-grid ${lyrics ? "" : "player-full"}`}><div>{children}</div>{lyrics && <Lyrics />}</div>}
    {tab === "about" && <InfoPage />}
  </Focusable>;
};
