import Joi from "joi";

export const IdSpec = Joi.alternatives().try(Joi.string(), Joi.object()).description("a valid ID");

export const UserSpec = Joi.object()
.keys({ // this is to create the user , validation happens at 
  firstName: Joi.string().example("Homer").required(),
  lastName: Joi.string().example("Simpson").required(),
  email: Joi.string().email().example("homer@simpson.com").required(),
  password: Joi.string().example("secret").required(),
  _id: IdSpec,
  __v: Joi.number(),
})
.label("UserDetails");

export const UserArray = Joi.array().items(UserSpec).label("UserArray");

export const UserCredentialsSpec = { // this is for the user sign in page , validation happens at accounts-controller.login
  email: Joi.string().email().required(),
  password: Joi.string().required(),
};

export const TrackSpec = { // this is for add track , validation happens at playlist-controller.addTrack
  title: Joi.string().required(),
  artist: Joi.string().required(),
  duration: Joi.number().allow("").optional(), // this allow("") , allows for a blank
};

export const PlaylistSpec = { // this is for adding a new playlist on the dashboard page, validation happens at dashboard.addPlaylist
  title: Joi.string().required(),
}