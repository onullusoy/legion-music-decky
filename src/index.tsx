// Modified 2026-11-16 for Legion Music Decky / Decky API v1.
import { definePlugin, routerHook } from "@decky/api";
import { SteamSpinner } from "@decky/ui";
import { FaMusic } from "react-icons/fa";
import { Title } from "./components/title";
import { Content } from "./components/content";
import { AppContextProvider } from "./context/context";
import { InfoRoute } from "./routes";
import { Suspense } from "react";

export default definePlugin(() => {
  routerHook.addRoute("/decky/legion-music/info", InfoRoute, () => {
    return (
      <Suspense
        fallback={
          <div
            style={{
              marginTop: "40px",
              height: "calc( 100% - 40px )",
              overflowY: "scroll",
            }}
          >
            <SteamSpinner />
          </div>
        }
      >
        <InfoRoute />
      </Suspense>
    );
  });

  return {
    name: "Legion Music Decky",
    titleView: <Title />,
    content: (
      <AppContextProvider>
        <Content />
      </AppContextProvider>
    ),
    icon: <FaMusic />,
    onDismount() {
      routerHook.removeRoute("/decky/legion-music/info");
    },
  };
});
