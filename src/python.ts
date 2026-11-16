// Modified 2026-11-16 for Decky API v1.
import { call } from "@decky/api";

// Keep the existing UI response shape while using Decky's current IPC API.
async function request(method: string, args: Record<string, unknown>) {
  try {
    return { success: true, result: await call(method, ...Object.values(args)) };
  } catch (error) {
    console.warn(`Legion Music Decky: ${method} failed`, error);
    return { success: false, result: undefined };
  }
}

export function resolve(promise: Promise<any>, setter: any) {
  void promise.then(data => { if (data.success) setter(data.result); })
    .catch(error => console.warn("Legion Music Decky request failed", error));
}

export function execute(promise: Promise<any>) {
  void promise.catch(error => console.warn("Legion Music Decky action failed", error));
}

// Python functions
export function getMetaData(): Promise<any> {
  return request("get_meta_data", {});
}

export function cacheAlbumArt(artUrl: string): Promise<any> {
  return request("cache_album_art", { artUrl: artUrl });
}

export function triggerPlay(): Promise<any> {
  return request("sp_play", {});
}

export function triggerNext(): Promise<any> {
  return request("sp_next", {});
}

export function triggerPrevious(): Promise<any> {
  return request("sp_previous", {});
}

export function triggerSeek(amount: number): Promise<any> {
  return request("sp_seek", { amount });
}

export function triggerSetPosition(
  position: number,
  trackid: string
): Promise<any> {
  return request("sp_set_position", {
    position: position,
    trackid: trackid,
  });
}

export function triggerTrackStatus(): Promise<any> {
  return request("sp_track_status", {});
}

export function getProviderIdentity(orgPath: string): Promise<any> {
  return request("sp_identity", { orgPath });
}

export function getTrackProgress(): Promise<any> {
  return request("sp_track_progress", {});
}

export function getTrackVolume(): Promise<any> {
  return request("sp_get_volume", {});
}

export function getCanSeek(): Promise<any> {
  return request("sp_can_seek", {});
}

export function triggerSetVolume(volume: number): Promise<any> {
  return request("sp_set_volume", { volume });
}

export function getMediaPlayerList(): Promise<any> {
  return request("sp_list_media_players", {});
}

export function testVolumeControl(): Promise<any> {
  return request("sp_test_volume_control", {});
}

export function setMediaPlayer(player: string): Promise<any> {
  if (player == "")
    return request("sp_set_media_player", {
      player: "org.mpris.MediaPlayer2.spotify",
    });

  return request("sp_set_media_player", { player });
}

export type Collection = { uri: string; url: string; kind: "playlist" | "album"; title: string; image: string };
// Library calls propagate errors so the shelf can display useful feedback.
export const listCollections = () => call<[], Collection[]>("list_collections");
export const addCollection = (url: string, name: string) => call<[string, string], Collection[]>("add_collection", url, name);
export const removeCollection = (uri: string) => call<[string], Collection[]>("remove_collection", uri);
export const openCollection = (uri: string) => call<[string], {player: string}>("open_collection", uri);
