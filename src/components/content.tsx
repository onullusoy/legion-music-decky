// Modified 2026-11-16 for Legion Music Decky / Decky API v1.
import { FC, useEffect, useRef } from "react";
import { MusicTheme } from "../styles/theme";
import { MusicRoom } from "./musicRoom";

import { InfoSection } from ".//../components/infoSection";
import { AlbumArt } from ".//../components/albumArt";
import { ArtistInfoPanel } from ".//../components/artistInfoPanel";
import { SongProgressSlider } from ".//../components/songProgressSlider";
import {
  AppActions,
  defaultState,
  ProviderIdentity,
  useStateContext,
} from ".//../context/context";
import * as python from ".//../python";
import { MediaProviderButton } from "./mediaProviderButton";
import { MusicControls } from "./musicControls";
import { VolumeControl } from "./volumeControl";

export const Content: FC<{ immersive?: boolean }> = ({ immersive = false }) => {
  const { state, dispatch } = useStateContext();
  const updateCallback = useRef<() => void>();

  const updateStatus = () => {
    python.resolve(python.getMediaPlayerList(), (mediaPlayers: string) => {
      if (
        mediaPlayers == "Unavailable" ||
        mediaPlayers == null ||
        typeof mediaPlayers != "string" ||
        mediaPlayers == ""
      ) {
        dispatch({ type: AppActions.SetDefaultState });
        return;
      }

      const providers = mediaPlayers.split(",");
      dispatch({ type: AppActions.SetProviders, value: providers });

      if (
        !providers.includes(state.currentServiceProvider) ||
        state.currentServiceProvider == ""
      ) {
        if (providers.length > 0) {
          dispatch({
            type: AppActions.SetCurrentServiceProvider,
            value: providers[0],
          });
          python.setMediaPlayer(providers[0]);
        } else {
          if (state.currentServiceProvider == "") return;
          dispatch({
            type: AppActions.SetCurrentServiceProvider,
            value: "",
          });
          python.setMediaPlayer("");
          return;
        }
      }

      providers.forEach((provider: string) => {
        const identityIndex = state.providersToIdentity.findIndex(
          (mapping: ProviderIdentity) => mapping.provider == provider
        );
        if (identityIndex >= 0) return;

        python.resolve(
          python.getProviderIdentity(provider),
          (providerName: string) => {
            dispatch({
              type: AppActions.AddProviderIdentity,
              value: { provider: provider, name: providerName },
            });
          }
        );
      });

      updateTrackData();
    });
  };

  const isValidMetaData = (metaData: string) => {
    return (
      metaData != "Unavailable" &&
      metaData != null &&
      typeof metaData == "string" &&
      metaData != "" &&
      metaData.length > 0
    );
  };

  const updateTrackData = () => {
    python.resolve(python.getMetaData(), (metaData: string) => {
      if (!isValidMetaData(metaData)) {
        dispatch({ type: AppActions.SetDefaultMeta });
        return;
      }

      const variables = metaData.split("\n");
      const metaObject: Record<string, string> = {};

      variables.forEach((value: string) => {
        const keyValue = value.split("|");
        metaObject[keyValue[0]] = keyValue[1];
      });

      dispatch({ type: AppActions.SetMetaData, value: metaObject });

      // In some rare cases for the first time the metaData can be correct but it won't have any actual info yet
      if (
        (state.currentTrackId == "" ||
          state.currentTrackId == defaultState.currentTrackId) &&
        "trackid" in metaObject &&
        metaObject["trackid"] != ""
      ) {
        dispatch({ type: AppActions.SetHasChangedProvider, value: true });
      }

      if (!state.isSeeking) {
        python.resolve(python.getTrackProgress(), (progress: number) => {
          dispatch({ type: AppActions.SetTrackProgress, value: progress });
        });
      }

      python.resolve(python.triggerTrackStatus(), (status: string) => {
        dispatch({ type: AppActions.SetPlayingState, value: status });
      });

      if (state.canModifyVolume)
        python.resolve(python.getTrackVolume(), (volume: number) => {
          dispatch({
            type: AppActions.SetVolume,
            value: volume,
          });
        });

      if (state.hasChangedProvider) {
        console.debug("Changed MusicControl provider, testing for featureset.");
        python.resolve(python.testVolumeControl(), (result: string) => {
          dispatch({
            type: AppActions.SetCanModifyVolume,
            value: result == "true",
          });

          if (result == "true")
            python.resolve(python.getTrackVolume(), (volume: number) => {
              dispatch({
                type: AppActions.AdjustVolumeByUser,
                value: volume,
              });
              dispatch({
                type: AppActions.SetIsAdjustingVolume,
                value: false,
              });
            });
        });

        python.resolve(python.getCanSeek(), (result: string) => {
          dispatch({
            type: AppActions.SetCanSeek,
            value: result == "true",
          });
        });

        dispatch({
          type: AppActions.SetHasChangedProvider,
          value: false,
        });
      }
    });
  };

  useEffect(() => {
    updateCallback.current = updateStatus;
  });

  useEffect(() => {
    console.debug("Setting up periodic hooks for MusicControl.");
    function tick() {
      updateCallback!.current!();
    }
    const id = setInterval(tick, 1000);
    updateStatus();

    return () => clearInterval(id);
  }, []);

  const player = state.providersToIdentity.find(p => p.provider === state.currentServiceProvider)?.name
    || (state.currentServiceProvider.includes("spotify") ? "Spotify" : "Your player");
  const card = <div className="card player-card">
    <div className="now-head"><span className="eyebrow">{state.hasAvailableTrack ? "NOW PLAYING" : "YOUR SOUNDTRACK"}</span>
      <span className="status">{state.hasAvailableTrack ? (state.currentTrackStatus === "Playing" ? "Playing" : "Paused") : "Ready"}</span></div>
    <div className={`track ${immersive ? "hero-track" : ""}`}>
      <AlbumArt albumArt={state.currentArtUrl} />
      <ArtistInfoPanel title={state.hasAvailableTrack ? state.currentSong : "Ready when you are."}
        artist={state.hasAvailableTrack ? state.currentArtist : "Start a media player and pick something good."} />
    </div>
    <MusicControls /><SongProgressSlider />
    {!immersive && state.currentServiceProvider && <div className="hint">Listening with {player}</div>}
    <VolumeControl />
    <MediaProviderButton currentProvider={state.currentServiceProvider} />
  </div>;
  return <><MusicTheme />{immersive ? <MusicRoom>{card}</MusicRoom> : <div className="lmd">{card}<InfoSection /></div>}</>;
};
