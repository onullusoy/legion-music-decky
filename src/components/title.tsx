// Modified 2026-11-16 for Legion Music Decky / Decky API v1.
import { staticClasses, Focusable } from "@decky/ui";
import { CSSProperties, FC } from "react";

const titleStyles: CSSProperties = {
  display: "flex",
  paddingTop: "3px",
  paddingBottom: "14px",
  paddingRight: "16px",
  boxShadow: "unset",
};

export const Title: FC = () => {
  return (
    <Focusable style={titleStyles} className={staticClasses.Title}>
      <div style={{ marginRight: "auto", flex: 0.9 }}>Legion Music Decky</div>
    </Focusable>
  );
};
