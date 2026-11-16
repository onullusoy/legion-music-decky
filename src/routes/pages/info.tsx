// Original About screen for Legion Music Decky, 2026-11-16.
import { FaHeadphones } from "react-icons/fa";
const version = "1.1.9";
export const InfoPage = () => <div className="room-grid">
  <section className="card side-card"><span className="brand-mark"><FaHeadphones /></span><div className="eyebrow" style={{ marginTop: 20 }}>MADE FOR THE HANDHELD MOMENT</div>
    <h2 className="section-title">A music corner for your Legion.</h2><p className="body-copy">Legion Music Decky brings your soundtrack into your game. A focused player, familiar controls and a shelf of the music you want to come back to.</p>
    <span className="tag">LEGION GO</span><span className="tag">BAZZITE</span><span className="tag">DECKY</span><span className="tag">v{version}</span>
  </section>
  <section className="card side-card"><div className="eyebrow">GOOD TO KNOW</div><h2 className="section-title">Your music, on your terms.</h2>
    <p className="body-copy">The player connects to music apps already running on this device. Spotify links give your shelf a name and artwork when available. No Spotify account connection is needed.</p>
    <p className="body-copy">The shelf holds shortcuts you add yourself. It does not import your private library or edit your Spotify playlists. Playback features depend on your player.</p>
    <div className="credits">Created for the Legion Go community by Onur.<br />Built on MusicControl by MartinPL and mirobouma, with thanks to Decky and the handheld Linux community.<br />GPL-3.0 · Independent community project.<br />github.com/onullusoy/legion-music-decky</div>
  </section>
</div>;
