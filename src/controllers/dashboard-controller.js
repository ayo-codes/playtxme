import { db } from "../models/db.js";

export const dashboardController = {
  index: {
    handler: async function (request, h) {
      const playlists = await db.playlistStore.getAllPlaylists();
      const viewData = {
        title: "Playtime Dashboard",
        playlists: playlists, // second playlists refers to the variable playlists above
      };
      return h.view("dashboard-view" , viewData);
    },
  },

  addPlaylist:{
    handler: async function (request , h) {
      const newPlayList = {
        title: request.payload.title,
      };
      await db.playlistStore.addPlaylist(newPlayList);
      return h.redirect("/dashboard");
    },
  },
};