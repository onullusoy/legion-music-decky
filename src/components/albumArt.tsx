// Updated 2026-11-16: artwork lifecycle and original player layout.
import { useEffect, useState } from "react";
import { defaultState } from "../context/defaultState";
import * as python from "../python";

export const AlbumArt = ({ albumArt, size = 88 }: { albumArt: string; size?: number }) => {
  const [url, setUrl] = useState(defaultState.currentArtUrl);
  useEffect(() => {
    let active = true;
    setUrl(defaultState.currentArtUrl);
    if (albumArt.startsWith("file:///")) {
      void python.cacheAlbumArt(albumArt).then(data => {
        if (active) setUrl(data.success && data.result ? data.result : defaultState.currentArtUrl);
      });
    } else setUrl(albumArt || defaultState.currentArtUrl);
    return () => { active = false; };
  }, [albumArt]);
  return <img className="art" width={size} height={size} style={{ width: size, height: size }} src={url} alt="Album artwork"
    onError={() => setUrl(defaultState.currentArtUrl)} />;
};
