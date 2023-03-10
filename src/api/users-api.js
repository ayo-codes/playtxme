import Boom from "@hapi/boom";
import { db } from "../models/db.js";
import { UserCredentialsSpec ,IdSpec, UserArray, UserSpec, UserSpecPlus , JwtAuth} from "../models/joi-schema.js";
import { validationError } from "./logger.js";
import { createToken } from "./jwt-utils.js";

// validate is for APIs that have to take in a user input

export const userApi = {
  create: {
    auth: false,
    handler: async function(request, h) {
      try{
        const user = await db.userStore.addUser(request.payload);
        if (user) {
          return h.response(user).code(201);
        }
        return Boom.badImplementation("error creating user");
      } catch (err) {
        return Boom.serverUnavailable("Database Error");
      }
    },

    tags: ["api"],
    description: "Create a User",
    notes: "Returns the newly created user",
    validate: {payload:UserSpec, failAction: validationError},
    response: {schema: UserSpecPlus, failAction: validationError},
  },

  find:{
    auth: {
      strategy: "jwt",
    },
    handler: async function(request, h){
      try{
        const users = await db.userStore.getAllUsers();
        return users;
      }catch (err) {
        return Boom.serverUnavailable("Database Error")
      }
    },
    tags:["api"],
    description: "Get all userApi",
    notes:"Returns details of all userApi",
    response: { schema: UserArray , failAction: validationError },
  },

  findOne: {
    auth: {
      strategy: "jwt",
    },
    handler: async function (request, h){
      try{
        const user = await db.userStore.getUserById(request.params.id);
        if (!user) {
          return Boom.notFound("No User with this id");
        }
        return user;
      } catch(err) {
        return Boom.serverUnavailable("No User with this id")
      }
    },
    tags: ["api"],
    description: "Get a specific user",
    notes: "Returns user details",
    validate: {params: {id: IdSpec }, failAction: validationError}
,    response:{ schema: UserSpecPlus, failAction: validationError},
  },
// delete All has no response back to the user
  deleteAll: {
    auth: {
      strategy: "jwt",
    },
    handler: async function (request, h){
      try {
        await db.userStore.deleteAll();
        return h.response().code(204);
      } catch(err) {
        return Boom.serverUnavailable("Database Error")
      }
    },
    tags: ["api"],
    description: "Delete all userApi",
    notes:"All userApi removed from Playtime",
  },


  authenticate: {
    auth: false,
    handler: async function (request, h) {
      try {
        const user = await db.userStore.getUserByEmail(request.payload.email);
        if (!user) {
          return Boom.unauthorized("User not found");
        }
        if (user.password !== request.payload.password) {
          return Boom.unauthorized("Invalid password");
        }
        const token = createToken(user); // if we have a matching user we create the token
        return h.response({ success: true, token: token }).code(201);
      } catch (err) {
        return Boom.serverUnavailable("Database Error");
      }
    },
    tags: ["api"],
    description: "Authenticate  a User",
    notes: "If user has valid email/password, create and return a JWT token",
    validate: {payload:UserCredentialsSpec, failAction: validationError},
    response: {schema: JwtAuth, failAction: validationError}
  },

};