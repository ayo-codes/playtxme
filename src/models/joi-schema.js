import Joi from "joi";
// schema significantly changes between versions of the app ,especially for API doc stuff with swaager
export const IdSpec = Joi.alternatives().try(Joi.string(), Joi.object()).description("a valid ID");

export const UserCredentialsSpec =Joi.object()
.keys({ // this is for the user sign in page , validation happens at accounts-controller.login
  email: Joi.string().email().example("homer@simpson.com").required(),
  password: Joi.string().example("secret").required(),
})
.label("UserCredentials");

export const UserSpec = UserCredentialsSpec.keys({ // this is to create the user , validation happens at 
  firstName: Joi.string().example("Homer").required(),
  lastName: Joi.string().example("Simpson").required(),
})
.label("UserDetails");

export const UserSpecPlus = UserSpec.keys({
  _id: IdSpec,
  __v:Joi.number(),
}).label("UserDetailsPlus")

export const UserArray = Joi.array().items(UserSpecPlus).label("UserArray");

// Tracks 

export const TrackSpec = Joi.object()
.keys({ // this is for add track , validation happens at playlist-controller.addTrack
  title: Joi.string().required().example("Piano Sonata No. 7"),
  artist: Joi.string().required().example("Beethoven"),
  duration: Joi.number().allow("").optional().example(12),// this allow("") , allows for a blank
  playlistid: IdSpec,
}).
label("Track");

export const TrackSpecPlus = TrackSpec.keys({
  _id: IdSpec,
  __v: Joi.number(),
}).label("TrackPlus");

export const TrackArraySpec = Joi.array().items(TrackSpecPlus).label("TrackArray");

export const PlaylistSpec = Joi.object() // this is for adding a new playlist on the dashboard page, validation happens at dashboard.addPlaylist
.keys({
  title: Joi.string().required().example("Beethoven Sonatas"),
  userid: IdSpec,
  tracks: TrackArraySpec,
})
.label("Playlist");

export const PlaylistSpecPlus = PlaylistSpec.keys({
  _id: IdSpec,
  __v: Joi.number(),
}).label("PlaylistPlus");

export const PlaylistArraySpec = Joi.array().items(PlaylistSpecPlus).label("PlaylistArray");

export const JwtAuth = Joi.object()
  .keys({
    success: Joi.boolean().example("true").required(),
    token: Joi.string().example("eyJhbGciOiJND.g5YmJisIjoiaGYwNTNjAOhE.gCWGmY5-YigQw0DCBo").required(),
  })
  .label("JwtAuth");
