const Hapi = require("hapi");
const _ = require("lodash");
const fs = require("fs");
const { mongoose } = require('./db/db.config');
const routes = require('./routes/matrix.routes');
let { Matrix } = require('./Models/Matrix.model');

//set up knex for database transactions


const server = Hapi.server({
  port: 3500,
  host: "localhost",
  routes: { cors: true }
});

server.route(routes);

const init = async () => {
  await server.start();
  console.log(`Server running at: ${server.info.uri}`);
};

process.on("unhandledRejection", err => {
  console.log(err);
  process.exit(1);
});

init();
