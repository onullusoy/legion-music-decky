// Original player volume layout, 2026-11-16.
import { useEffect, useRef } from "react";
import { SliderField } from "@decky/ui";
import { useStateContext, AppActions } from "../context/context";
import * as python from "../python";
export const VolumeControl = () => {
  const { state, dispatch } = useStateContext();
  const timer = useRef<ReturnType<typeof setTimeout>>();
  useEffect(() => () => clearTimeout(timer.current), []);
  const change = (value: number) => {
    python.execute(python.triggerSetVolume(value / 100));
    dispatch({ type: AppActions.AdjustVolumeByUser, value: value / 100 });
    clearTimeout(timer.current);
    timer.current = setTimeout(() => dispatch({ type: AppActions.SetIsAdjustingVolume, value: false }), 1500);
  };
  if (!state.hasAvailableTrack || !state.canModifyVolume) return null;
  return <div className="volume">
    <div className="volume-head"><span>PLAYER VOLUME</span><span>{Math.round(state.currentVolume * 100)}%</span></div>
    <SliderField value={Math.round(state.currentVolume * 100)} min={0} max={100} step={1} onChange={change} />
  </div>;
};
