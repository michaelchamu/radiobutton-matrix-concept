const Hapi = require('hapi');
const _ = require('lodash');
const fs = require('fs');

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


server.route({
    method: 'GET',
    path: '/',
    handler: async () => {
        var datastore = {};

        var data = await knex.select('*').from('Questions');


        datastore.data = data;
        //count rows
        datastore.rows = _.filter(data, {'type': 'row'})
        datastore.columns = _.filter(data, {'type': 'column'})
        datastore.longestRow = _.map(datastore.rows, 'label').reduce((a, b) => a.length > b.length ? a : b, '').length
        datastore.longestColumn = _.map(datastore.columns, 'label').reduce((a, b) => a.length > b.length ? a : b, '').length

        datastore.images = _.sumBy(
            data,
            ({ image }) => Number(image !== null)
        );

        return datastore;
    }

});

server.route({
    method: 'POST',
    path: '/',
    handler: (request, h) => {
        console.log(request.payload)
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

server.route({
    method: 'POST',
    path: '/pics',
    config: {
        payload: {
            maxBytes: 1000 * 1000 * 5, // 5 Mb
            output: 'stream',
            allow: 'multipart/form-data' // important
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