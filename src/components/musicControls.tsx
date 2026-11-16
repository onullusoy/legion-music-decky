// Original transport controls for Legion Music Decky, 2026-11-16.
import { DialogButton, Focusable } from "@decky/ui";
import { FaPlay, FaPause, FaStepForward, FaStepBackward } from "react-icons/fa";
import { useStateContext } from "../context/context";
import * as python from "../python";

export const MusicControls = () => {
  const { state } = useStateContext();
  return <Focusable className="transport" flow-children="horizontal">
    <DialogButton className="control" disabled={!state.hasAvailableTrack} onClick={() => python.execute(python.triggerPrevious())}>
      <span aria-label="Previous track"><FaStepBackward /></span>
    </DialogButton>
    <DialogButton className="control primary" disabled={!state.hasAvailableTrack} onClick={() => python.execute(python.triggerPlay())}>
      <span aria-label={state.currentTrackStatus === "Playing" ? "Pause" : "Play"}>{state.currentTrackStatus === "Playing" ? <FaPause /> : <FaPlay />}</span>
    </DialogButton>
    <DialogButton className="control" disabled={!state.hasAvailableTrack} onClick={() => python.execute(python.triggerNext())}>
      <span aria-label="Next track"><FaStepForward /></span>
    </DialogButton>
  </Focusable>;
};
