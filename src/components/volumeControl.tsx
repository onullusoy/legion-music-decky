// Modified 2026-11-16 for Legion Music Decky / Decky API v1.
import { useEffect, useRef, FC } from "react";
import {
  PanelSectionRow,
  SliderField,
  staticClasses,
} from "@decky/ui";
import { useStateContext, AppActions } from "../context/context";
import * as python from "./../python";

export const VolumeControl: FC = () => {
  const { state, dispatch } = useStateContext();
  const volumeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const onSliderChanged = (value: number) => {
    const normalizedValue = (value /= 100.0);
    python.execute(python.triggerSetVolume(normalizedValue));

    dispatch({
      type: AppActions.AdjustVolumeByUser,
      value: normalizedValue,
    });

    if (volumeTimeoutRef.current != null) {
      clearTimeout(volumeTimeoutRef.current!);
    }

    volumeTimeoutRef.current = setTimeout(() => {
      dispatch({
        type: AppActions.SetIsAdjustingVolume,
        value: false,
      });
    }, 1500);
  };

  const onDismount = () => {
    clearTimeout(volumeTimeoutRef!.current!);
    volumeTimeoutRef.current = null;
  };

  useEffect(() => {
    // Clear the interval when the component unmounts
    return () => {
      onDismount();
    };
  }, []);

  if (!state.hasAvailableTrack || !state.canModifyVolume) return <div />;
  return (
    <div>
      <div
        style={{ marginTop: "5px" }}
        className={staticClasses.PanelSectionTitle}
      >
        Playback Volume
      </div>
      <PanelSectionRow>
        <SliderField
          value={Math.round(state.currentVolume * 100)}
          min={0}
          max={100}
          step={1}
          onChange={onSliderChanged}
        ></SliderField>
      </PanelSectionRow>
    </div>
  );
};
