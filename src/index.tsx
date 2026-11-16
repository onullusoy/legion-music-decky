// Modified 2026-11-16 for Legion Music Decky / Decky API v1.
import { definePlugin, routerHook } from "@decky/api";
import { FaMusic } from "react-icons/fa";
import { Title } from "./components/title";
import { Content } from "./components/content";
import { AppContextProvider } from "./context/context";
import { InfoRoute } from "./routes";

export default definePlugin(() => {
  routerHook.addRoute("/decky/legion-music/room", InfoRoute);

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
      routerHook.removeRoute("/decky/legion-music/room");
    },
  };
});
