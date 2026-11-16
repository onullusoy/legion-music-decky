// Modified 2026-11-16 for Legion Music Decky / Decky API v1.
import {
  DialogButton,
} from "@decky/ui";

import { FC } from "react";
import {
  AppActions,
  ProviderIdentity,
  useStateContext,
} from "../context/context";
import * as python from "./../python";

type MediaProviderProps = {
  currentProvider: string;
};

export const MediaProviderButton: FC<MediaProviderProps> = (
  props: MediaProviderProps
) => {
  const { state, dispatch } = useStateContext();

  const getDisplayNameForProvider = (provider: string) => {
    const providerIndex = state.providersToIdentity.findIndex(
      (mapping: ProviderIdentity) => mapping.provider == provider
    );

    if (providerIndex < 0)
      return provider.replace("org.mpris.MediaPlayer2.", "");

    return state.providersToIdentity[providerIndex].name;
  };

  const handleOnClick = () => {
    if (state.providers.length === 0) return;

    const currentIndex = state.providers.findIndex(p => p === props.currentProvider);
    const nextIndex = (currentIndex + 1) % state.providers.length;
    const nextProvider = state.providers[nextIndex];

    python.setMediaPlayer(nextProvider);
    dispatch({
      type: AppActions.SetCurrentServiceProvider,
      value: nextProvider,
    });
  };

  return (
    <DialogButton className="btn player-select" onClick={handleOnClick} disabled={state.providers.length <= 1}>
      {props.currentProvider == ""
        ? "No Media Player Found"
        : getDisplayNameForProvider(props.currentProvider)}
      {state.providers.length > 1 && <span style={{ fontSize: 10, opacity: .7 }}>Switch player</span>}
    </DialogButton>
  );
};
