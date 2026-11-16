// Modified 2026-11-16 for Legion Music Decky / Decky API v1.
import { SidebarNavigation } from "@decky/ui";
import { FC } from "react";
import { InfoPage } from "./pages/info";
import { TroubleshootingPage } from "./pages/troubleshooting";
import { UsagePage } from "./pages/usage";

export const InfoRoute: FC = () => {
  return (
    <SidebarNavigation
      title="Legion Music Decky"
      showTitle
      pages={[
        {
          title: "Info",
          content: <InfoPage />,
          route: "/decky/legion-music/info/info",
        },
        {
          title: "Usage",
          content: <UsagePage />,
          route: "/decky/legion-music/info/usage",
        },
        {
          title: "Troubleshooting",
          content: <TroubleshootingPage />,
          route: "/decky/legion-music/info/troubleshooting",
        },
      ]}
    />
  );
};
