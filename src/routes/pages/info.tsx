// Original About screen for Legion Music Decky, 2026-11-16.
import { FaHeadphones } from "react-icons/fa";
const version = "1.1.13";
export const InfoPage = () => <div className="room-grid">
  <section className="card side-card"><span className="brand-mark"><FaHeadphones /></span><div className="eyebrow" style={{ marginTop: 20 }}>MADE FOR THE HANDHELD MOMENT</div>
    <h2 className="section-title">A music corner for your Legion.</h2><p className="body-copy">Legion Music Decky brings your soundtrack into your game. A focused player, clear controls and your music close at hand.</p>
    <span className="tag">LEGION GO</span><span className="tag">BAZZITE</span><span className="tag">DECKY</span><span className="tag">v{version}</span>
  </section>
  <section className="card side-card"><div className="eyebrow">GOOD TO KNOW</div><h2 className="section-title">Your music, on your terms.</h2>
    <p className="body-copy">Keep your music app running in the background and control playback here while you play.</p>
    <p className="body-copy">Spotify and other compatible media players provide the artwork and playback information. Available controls depend on your player.</p>
    <div className="credits">Made for the Legion Go community.<br />Built on MusicControl by MartinPL and mirobouma, with thanks to Decky and the handheld Linux community.<br />GPL-3.0 · Independent community project.<br />github.com/onullusoy/legion-music-decky</div>
  </section>
</div>;
