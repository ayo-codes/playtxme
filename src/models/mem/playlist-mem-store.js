import { v4 } from "uuid";
import { trackMemStore } from "./track-mem-store.js";

let playlists =[];

export const playlistMemStore = {
  async getAllPlaylists(){
    return playlists; /* returns the things in the playlist array */
  },

  async addPlaylist(playlist){
    playlist._id = v4();
    playlists.push(playlist);
    return playlist;
  },

  async getPlaylistById(id){ // note the difference btwn how this is written and the JsonStore version
    const list = playlists.find((playlist) => playlist._id === id);
    if (list) {
      list.tracks = await trackMemStore.getTracksByPlaylistId(list._id);
      return list;
    }
    return null;
    
    
  },

  async deletePlaylistById(id){
    const index = playlists.findIndex((playlist) => playlist._id === id);
   if (index !== -1) playlists.splice(index, 1);
  },

  async deleteAllPlaylists(){
    playlists = [];
  },

  async getUserPlaylists(userid){
    return playlists.filter((playlist) => playlist.userid === userid);
  }
};