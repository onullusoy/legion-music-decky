// Modified 2026-11-16 for Legion Music Decky / Decky API v1.
import { ButtonItem, Navigation } from "@decky/ui";
import { FC } from "react";

export const InfoSection: FC = () => {
  const onClickInfo = () => {
    Navigation.CloseSideMenus();
    Navigation.Navigate("/decky/legion-music/info");
  };

  return (
    <ButtonItem layout="below" bottomSeparator='none' onClick={onClickInfo}>
      Info
    </ButtonItem>
  );
};
