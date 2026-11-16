// Original full-screen music room for Legion Music Decky, 2026-11-16.
import { PropsWithChildren, useState } from "react";
import { DialogButton, Focusable, Navigation } from "@decky/ui";
import { FaArrowLeft, FaHeadphones, FaMusic, FaInfoCircle } from "react-icons/fa";
import { InfoPage } from "../routes/pages/info";

export const MusicRoom = ({ children }: PropsWithChildren) => {
  const [tab, setTab] = useState("listen");
  return <Focusable className="lmd lmd-room" onCancelButton={() => Navigation.NavigateBack()}>
    <header className="room-header"><div className="wordmark"><span className="brand-mark"><FaHeadphones /></span><div><div className="brand-name">LEGION MUSIC</div><div className="brand-sub">YOUR GAME. YOUR SOUND.</div></div></div>
      <DialogButton className="btn quiet" onClick={() => Navigation.NavigateBack()}><FaArrowLeft /> Back to game</DialogButton></header>
    <div className="eyebrow">A LITTLE SPACE FOR YOUR SOUNDTRACK</div><h1 className="room-heading">Set the mood. Stay in the game.</h1>
    <Focusable className="tabs" flow-children="horizontal">
      <DialogButton className={`btn tab ${tab === "listen" ? "active" : ""}`} onClick={() => setTab("listen")}><FaMusic /> Listen</DialogButton>
      <DialogButton className={`btn tab ${tab === "about" ? "active" : ""}`} onClick={() => setTab("about")}><FaInfoCircle /> About</DialogButton>
    </Focusable>
    {tab === "listen" && <div className="room-grid"><div>{children}</div><aside className="card side-card"><div className="eyebrow">PRESS PLAY, KEEP PLAYING</div><h2 className="section-title">Your next session has a soundtrack.</h2>
      <p className="body-copy">Keep Spotify running in the background. Your music stays close, even when the game gets loud.</p>
      <ol className="steps"><li>Start your music player from Steam.</li><li>Pick a track, then return to your game.</li><li>Change the mood here whenever you like.</li></ol></aside></div>}
    {tab === "about" && <InfoPage />}
  </Focusable>;
};
