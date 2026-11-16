// Optional lyrics panel for Legion Music Decky, 2026-11-16.
import { useEffect, useState } from "react";
import { Focusable } from "@decky/ui";
import { useStateContext } from "../context/context";
import { getLyrics, LyricsResult } from "../python";

export const Lyrics = () => {
  const { state } = useStateContext();
  const duration = Math.round(Number(state.currentTrackLength) / 1000000);
  const [result, setResult] = useState<LyricsResult>({ state: "idle", text: "" });
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    let active = true;
    setResult({ state: "idle", text: "" });
    if (!state.hasAvailableTrack) { setLoading(false); return; }
    setLoading(true);
    void getLyrics(state.currentSong, state.currentArtist, duration)
      .then(data => { if (active) setResult(data); })
      .catch(() => { if (active) setResult({ state: "unavailable", text: "" }); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [state.currentSong, state.currentArtist, duration, state.hasAvailableTrack]);
  const messages = {
    idle: "Play a track to see its lyrics.",
    not_found: "No lyrics found for this version of the track.",
    instrumental: "This track is instrumental.",
    unavailable: "Lyrics are unavailable right now. Music controls still work.",
    disabled: "Lyrics are turned off.",
    found: "",
  };
  return <section className="card side-card lyrics-card">
    <div className="lyrics-heading"><h2 className="section-title">Lyrics</h2><span className="eyebrow">LRCLIB</span></div>
    {loading ? <p className="body-copy" role="status">Finding lyrics…</p> : result.state === "found" ?
      <Focusable key={`${state.currentSong}:${state.currentArtist}`} className="lyrics-body" tabIndex={0}>{result.text}</Focusable> :
      <p className="body-copy" role="status">{messages[result.state]}</p>}
    <p className="lyrics-source">Lyrics from LRCLIB · lrclib.net</p>
  </section>;
};
