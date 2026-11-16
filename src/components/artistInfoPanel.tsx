// Modified 2026-11-16 for Legion Music Decky / Decky API v1.
import { FC } from "react";

import {
  musicControlFieldDividerStyle,
  musicControlFieldStyle,
} from "../styles/style";

export const ArtistInfoPanel: FC<{ title: string; artist: string }> = ({
  title,
  artist,
}) => {
  return (
    <div style={{ width: "100%", marginLeft: "10px" }}>
      <div style={musicControlFieldStyle}>{title}</div>
      <div style={musicControlFieldDividerStyle}></div>
      <div style={musicControlFieldStyle}>{artist}</div>
      <div style={musicControlFieldDividerStyle}></div>
    </div>
  );
};
