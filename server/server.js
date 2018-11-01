const Hapi = require('hapi');
const _ = require('lodash');
const fs = require('fs');

//set up knex for database transactions
var knex = require('knex')({
    client: 'sqlite3',
    connection: {
        filename: './database/questions.db'
    },
    useNullAsDefault:true
});

const server = Hapi.server({
    port: 3500,
    host: 'localhost',
    routes: { cors: true }

});

//retrieve all saved rows and columns
server.route({
    method: 'GET',
    path: '/',
    handler: async () => {
        var datastore = {};

        var data = await knex.select('*').from('Questions');

        datastore.data = data;
        //get all rows in result set
        datastore.rows = _.filter(data, {'type': 'row'})
        //get all columns in result set
        datastore.columns = _.filter(data, {'type': 'column'})
        //get the row with the longest label in the rows result set
        datastore.longestRow = _.map(datastore.rows, 'label').reduce((a, b) => a.length > b.length ? a : b, '').length
        //get the column with the longest label in the columsn result set
        datastore.longestColumn = _.map(datastore.columns, 'label').reduce((a, b) => a.length > b.length ? a : b, '').length
        //count the total number of images saved in the database
        datastore.images = _.sumBy(
            data,
            ({ image }) => Number(image !== null)
        );
        //return object with all the summaries to the client side
        return datastore;
    }

});

//add row or column
server.route({
    method: 'POST',
    path: '/',
    //request is the data from client side while h is the response that can be customised to give feedback to the client
    handler: (request, h) => {
       //add a single record to the questions table, can be a row or a column becuase these are not added simultenously
        knex('Questions').insert({
            'label': request.payload.label ,
            'type': request.payload.type ,
            'uniqueid': request.payload.uniquekey,
            'image': null
        }).then(( result )=>{
            return result
        })
        return 200;
    }
});

//upload pictures
server.route({
    method: 'POST',
    path: '/pics',
    //upload an image to the pics folder within the app folder
    config: {
        payload: {
            maxBytes: 1000 * 1000 * 5, // 5 Mb
            output: 'stream',
            allow: 'multipart/form-data' // important to ensure API aCccepts file uploads
        }
    },
    handler: (request, h) => {
        //write file to new location
        var result = [];
        for(var i = 0; i < request.payload["image"].length; i++) {
            result.push(request.payload["image"][i].hapi);
            request.payload["image"][i].pipe(fs.createWriteStream("./images/" + request.payload["image"][i].hapi.filename))
        }
        return 200;
    }
});

//change label name
server.route({
    method: 'PATCH',
    path: '/',
    handler: (request, h) => {
        console.log(request.payload)

        knex('Questions')
            .where({ uniqueid: request.payload.uniquekey })
            .update({image: request.payload.image, label: request.payload.label, type: request.payload.type })
            .then(( result )=>{
                return result
            })
        return 200;
    }
});

//remove a row or column
server.route({
    method: 'DELETE',
    path: '/',
    handler: (request, h) => {
        console.log(request.payload)

        knex('Questions')
            .where({ uniqueid: request.payload.uniquekey })
            .del()
            .then(( result )=>{
                return result
            })
        return 200;
    }
});


const init = async () => {
    await server.start();
    console.log(`Server running at: ${server.info.uri}`);
};

process.on('unhandledRejection', (err) => {

    console.log(err);
    process.exit(1);
});

init();