// Spotify collection shelf for Legion Music Decky, 2026-11-16.
import { useEffect, useState } from "react";
import { DialogButton, Focusable, TextField } from "@decky/ui";
import { FaPlus, FaSpotify, FaTrash, FaArrowRight, FaLayerGroup } from "react-icons/fa";
import { addCollection, listCollections, removeCollection, openCollection, Collection } from "../python";
import { AppActions, useStateContext } from "../context/context";
import fallbackArt from "../../assets/default_music.png";

export const Library = () => {
  const { dispatch } = useStateContext();
  const [items, setItems] = useState<Collection[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(false);
  const [managing, setManaging] = useState(false);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [url, setUrl] = useState("");
  const [name, setName] = useState("");
  useEffect(() => {
    let active = true;
    void listCollections().then(data => { if (active) setItems(data); })
      .catch(() => { if (active) setMessage("Your shelf could not be loaded. Try opening it again."); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, []);
  const save = async () => {
    setBusy(true); setMessage("");
    try { setItems(await addCollection(url, name)); setForm(false); setUrl(""); setName(""); }
    catch { setMessage("Could not save this collection. Use a full open.spotify.com playlist or album link."); }
    finally { setBusy(false); }
  };
  const activate = async (item: Collection) => {
    setBusy(true); setMessage("");
    try {
      if (managing) setItems(await removeCollection(item.uri));
      else {
        const result = await openCollection(item.uri);
        dispatch({ type: AppActions.SetCurrentServiceProvider, value: result.player });
        setMessage("Opened in Spotify. Playback is handled by your Spotify app.");
      }
    } catch { setMessage(managing ? "Could not remove this collection. Try again." : "Start Spotify on this device, then try opening the collection again."); }
    finally { setBusy(false); }
  };
  return <div>
    <div className="library-heading"><div><div className="eyebrow">YOUR SHORTLIST</div><h2 className="section-title">Pick the mood.</h2><p className="muted">Your favorite playlists and albums, one press away.</p></div>
      <DialogButton className="btn primary" onClick={() => { setForm(!form); setManaging(false); }}><FaPlus /> Add a link</DialogButton></div>
    {form && <Focusable className="card add-form"><h3 className="section-title">A new soundtrack</h3>
      <TextField label="Spotify playlist or album link" value={url} onChange={event => setUrl(event.target.value)} disabled={busy} />
      <TextField label="Name (optional)" description="Leave blank to use Spotify's title." value={name} onChange={event => setName(event.target.value)} disabled={busy} />
      <Focusable className="form-actions" flow-children="horizontal"><DialogButton className="btn primary" disabled={busy || !url.trim()} onClick={() => void save()}>{busy ? "Getting your collection…" : "Save to shelf"}</DialogButton>
        <DialogButton className="btn" disabled={busy} onClick={() => setForm(false)}>Cancel</DialogButton></Focusable>
    </Focusable>}
    {message && <div className="feedback" role="status">{message}</div>}
    {loading ? <p className="muted">Loading your shelf…</p> : items.length === 0 ?
      <div className="empty"><div className="empty-icon"><FaLayerGroup /></div><h3 className="section-title">Make room for your favorites.</h3>
        <p className="muted">Copy a playlist or album link from Spotify.<br />Add it here to build your own music shelf.</p></div> :
      <Focusable className="collection-grid">
        {items.map(item => <DialogButton key={item.uri} className="collection" disabled={busy} onClick={() => void activate(item)}>
          <img src={item.image || fallbackArt} alt="" onError={event => { event.currentTarget.onerror = null; event.currentTarget.src = fallbackArt; }} />
          <span className="collection-title">{item.title}</span>
          <span className="collection-kind"><span><FaSpotify /> {item.kind === "album" ? "Album" : "Playlist"}</span>{managing ? <FaTrash /> : <FaArrowRight />}</span>
          <span className="collection-kind">{managing ? "Remove from shelf" : "Open in Spotify"}</span>
        </DialogButton>)}
      </Focusable>}
    {!!items.length && <DialogButton className="btn quiet" style={{ marginTop: 16 }} disabled={busy} onClick={() => setManaging(!managing)}>{managing ? "Done editing" : "Edit your shelf"}</DialogButton>}
    {managing && <p className="notice">Select a card to remove its shortcut. Your Spotify library stays unchanged.</p>}
    <p className="notice">Titles and artwork come from Spotify where available. Your shelf is saved on this device. It does not automatically sync your Spotify account.</p>
  </div>;
};
