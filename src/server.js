import Hapi from "@hapi/hapi";
import Vision from "@hapi/vision";
import Handlebars from "handlebars";
import Cookie from "@hapi/cookie"; // imports the cookie 
import Inert from "@hapi/inert"; // imports the inert for photos
import path from "path"; // provides utilities for working with file and directory files
import dotenv from "dotenv";
import Joi from "joi";
import HapiSwagger from "hapi-swagger";
import { fileURLToPath } from "url";
import { webRoutes } from "./web-routes.js";
import { db } from "./models/db.js";
import { accountsController } from "./controllers/accounts-controller.js";
import { apiRoutes } from "./api-routes.js";



const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const result = dotenv.config();
if (result.error){
  console.log(result.error.message);
  process.exit(1);
}

const swaggerOptions = {
  info: {
    title: "Playtime API",
    version:"0.1",
  },
};

async function init(){
  const server = Hapi.server({
    port:3000,
    host:"localhost",
  });
  await server.register(Vision);
  await server.register(Cookie);
  await server.register(Inert);
  await server.register([
    Inert,
    Vision,
    {
      plugin: HapiSwagger,
      options: swaggerOptions,
    },
  ]);
  server.validator(Joi);
  server.views({
    engines: {
      hbs: Handlebars,
    },
    relativeTo: __dirname,
    path: "./views",
    layoutPath: "./views/layouts",
    partialsPath:"./views/partials",
    layout: true,
    isCached: false,
  });

  server.auth.strategy("session", "cookie", {
    cookie: {
      name: process.env.COOKIE_NAME,
      password: process.env.COOKIE_PASSWORD,
      isSecure: false,
    },
    redirectTo:"/",
    validate: accountsController.validate,
  });
  server.auth.default("session");

  db.init("mongo"); // put in "mongo" to use the mongo database leave blank to use Json or memstore
  server.route(webRoutes);
  server.route(apiRoutes);
  await server.start();
  console.log("Server is running on %s", server.info.uri);
}

process.on("unhandledRejection", (err) => {
  console.log(err);
  process.exit(1);
});

init();
