import { DialogButton, Navigation } from "@decky/ui";
import { FaArrowRight } from "react-icons/fa";
export const InfoSection = () => <DialogButton className="btn room-link" onClick={() => {
  Navigation.CloseSideMenus(); Navigation.Navigate("/decky/legion-music/room");
}}>Open music room <FaArrowRight /></DialogButton>;
