const Hapi = require("hapi");
const routes = require('./routes/config/routes.config');

const {mongoose} = require('./db/db.config'); 
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
  process.exit(1);
});

init();