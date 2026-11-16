// Modified 2026-11-16 for Legion Music Decky / Decky API v1.
import { useEffect, useRef, FC } from "react";
import { SliderField } from "@decky/ui";
import { useStateContext, AppActions } from "../context/context";
import * as python from "./../python";

export const SongProgressSlider: FC = () => {
  const { state, dispatch } = useStateContext();
  const seekTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const onSliderChanged = (value: number) => {
    const roundedProgress = Math.round(value * state.currentTrackLength);

    python.execute(
      python.triggerSetPosition(roundedProgress, state.currentTrackId)
    );

    dispatch({
      type: AppActions.SeekToPosition,
      value: roundedProgress,
    });

    if (seekTimeoutRef.current != null) {
      clearTimeout(seekTimeoutRef.current!);
    }

    seekTimeoutRef.current = setTimeout(() => {
      dispatch({
        type: AppActions.SetIsSeeking,
        value: false,
      });
    }, 1500);
  };

  const onDismount = () => {
    clearTimeout(seekTimeoutRef!.current!);
    seekTimeoutRef.current = null;
  };

  useEffect(() => {
    // Clear the interval when the component unmounts
    return () => {
      onDismount();
    };
  }, []);

  if (state.currentTrackLength <= 1) return <div></div>;
  return (
    <div className="progress">
      <SliderField
        value={Math.min(1, Math.max(0, state.currentTrackProgress / state.currentTrackLength))}
        min={0}
        max={1}
        step={0.05}
        disabled={!state.canSeek}
        onChange={onSliderChanged}
      ></SliderField>
      <div className="time"><span>{formatTime(state.currentTrackProgress)}</span><span>{formatTime(state.currentTrackLength)}</span></div>
    </div>
  );
};

function formatTime(microseconds: number) {
  const seconds = Math.max(0, Math.floor((Number(microseconds) || 0) / 1000000));
  return `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, "0")}`;
}
