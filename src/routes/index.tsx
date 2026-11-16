// Music room replaces the inherited information sidebar, 2026-11-16.
import { AppContextProvider } from "../context/context";
import { Content } from "../components/content";
export const InfoRoute = () => <AppContextProvider><Content immersive /></AppContextProvider>;
