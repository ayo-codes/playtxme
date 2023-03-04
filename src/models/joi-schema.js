import Joi from "joi";

export const UserSpec = { // this is to create the user , validation happens at 
  firstName: Joi.string().required(),
  lastName: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().required(),
};

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