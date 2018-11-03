const Hapi = require("hapi");
const _ = require("lodash");
const fs = require("fs");
const { mongoose } = require('./db/db.config');
let { Matrix } = require('./Models/Matrix.model');
//set up knex for database transactions
let knex = require("knex")({
  client: "sqlite3",
  connection: {
    filename: "./database/questions.db"
  },
  useNullAsDefault: true
});

const server = Hapi.server({
  port: 3500,
  host: "localhost",
  routes: { cors: true }
});

//retrieve all saved rows and columns
server.route({
  method: "GET",
  path: "/matrix",
  handler: async () => {
    let dataStore = {};
    try{
      let data = await knex.select("*").from("Questions");
       if (!data || data.length === 0) {
          //there is no data send 404 to client
          return 404;
        } else {
          dataStore.data = data;
          //get all rows in result set
          dataStore.rows = _.filter(data, { type: "row" });
          //get all columns in result set
          dataStore.columns = _.filter(data, { type: "column" });
          //get the row with the longest label in the rows result set
          dataStore.longestRow = _.map(dataStore.rows, "label").reduce(
            (a, b) => (a.length > b.length ? a : b),
            ""
          ).length;
          //get the column with the longest label in the columsn result set
          dataStore.longestColumn = _.map(dataStore.columns, "label").reduce(
            (a, b) => (a.length > b.length ? a : b),
            ""
          ).length;
          //count the total number of images saved in the database
          dataStore.images = _.sumBy(data, ({ image }) => Number(image !== null));
          //return object with all the summaries to the client side
          return { statusCode: 200, dataStore };
        }
    } catch(e) {
      return { statusCode: 500, e };
    }
  }
});

//add row or column
server.route({
  method: "POST",
  path: "/matrix",
  //request is the data from client side while h is the response that can be customised to give feedback to the client
  handler: (request, reply) => {
    //add a single record to the questions table, can be a row or a column becuase these are not added simultenously
    try{
        knex("Questions")
          .insert({
            label: request.payload.label,
            type: request.payload.type,
            uniqueid: request.payload.uniquekey,
            image: null
          })
          .then((err, result) => {
            //check error code then rsend that
            if (err) {
              return { statusCode: 400, message: err };
            } else {
              return { statusCode: 201, result };
            }
          })
          .catch((err) => {
            return {statusCode:500, message:err}
          });
        } catch(err) {
            return {statusCode:500, message:err}
        }
        reply(200)
  }
});

//upload pictures
server.route({
  method: "POST",
  path: "/matrix/pics",
  //upload an image to the pics folder within the app folder
  config: {
    payload: {
      maxBytes: 1000 * 1000 * 5, // 5 Mb
      output: "stream",
      allow: "multipart/form-data" // important to ensure API aCccepts file uploads
    }
  },
  handler: async (request, h) => {
    //write file to new location
    let result = [];
    for (let i = 0; i < request.payload["image"].length; i++) {
      result.push(request.payload["image"][i].hapi);
     let status = await request.payload["image"][i].pipe(
        fs.createWriteStream(
          "./images/" + request.payload["image"][i].hapi.filename
        )
      );


    }
  }
});

//change label name
server.route({
  method: "PATCH",
  path: "/matrix",
  handler: (request, h) => {
    console.log(request.payload);

    knex("Questions")
      .where({ uniqueid: request.payload.uniquekey })
      .update({
        image: request.payload.image,
        label: request.payload.label,
        type: request.payload.type
      })
      .then((err, result) => {
        if(err) {
          return {statusCode: 400, message: err};
        } else {
          return {statusCode: 200, result};
        }
      }).catch((err)=>{
        return {statusCode: 400, message: `Another unforseen exception ${err}`};
      });
  }
});

//remove a row or column
server.route({
  method: "DELETE",
  path: "/matrix",
  handler: (request, h) => {
    console.log(request.payload);

    knex("Questions")
      .where({ uniqueid: request.payload.uniquekey })
      .del()
      .then((err, result) => {
        if(err){
                  return {statusCode: 400, message: err};
        } else {
          return {statusCode: 200, result}
        }
      });
    return 200;
  }
});

const init = async () => {
  await server.start();
  console.log(`Server running at: ${server.info.uri}`);
};

process.on("unhandledRejection", err => {
  console.log(err);
  process.exit(1);
});

init();
