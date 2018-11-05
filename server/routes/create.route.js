const _ = require('lodash');
const fs = require("fs");
const path = require('path');
let { Matrix } = require('../Models/Matrix.model');
module.exports = [
    //create row or column
    {
        method: ['POST'],
        path: "/api/matrix",
        //request is the data from client side while h is the response that can be customised to give feedback to the client
        handler: (request, h) => {
            //pick the desired values from the payload
            let body = _.pick(request.payload, ['label', 'type', 'uniqueid']);
            //save values in matrix object
            let matrix = new Matrix(body);
            let promise = new Promise((resolve, reject) => {
                matrix.save((err, result) => {
                    if (err) {
                        reject({ statusCode: 400, message: err });
                    } else {
                        resolve({ statusCode: 201, result });
                    }
                })
            });
            return promise;
        }
    },

    //upload image
    {
        method: "POST",
        path: "/api/matrix/pics",
        //upload an image to the pics folder within the app folder
        config: {
            payload: {
                maxBytes: 1000 * 1000 * 5, // 5 Mb
                output: "stream"
            }
        },
        handler: async (request, h) => {
            //write file to new location
            const file = await request.payload.image;
            let promise = new Promise((resolve, reject) => {
                const stream = fs.createWriteStream(path.join(__dirname, '..', 'images', request.payload.filename));
                file.on('error', err => reply(err));
                file.pipe(stream);
                file.on('end', err => {
                    if (err) {
                        reject({ statusCode: 400, message: 'image upload failed' })
                    } else {
                        //update row or column by ID
                        Matrix.findOneAndUpdate({ 'uniqueid': request.payload.id, 'type': request.payload.type }, {
                            $set: {
                                'image': request.payload.filename
                            }
                        }).then((record) => {
                            if (!record) {
                                resolve({ statusCode: 404 })
                            } else {
                                resolve({ statusCode: 201 })
                            }
                        }).catch((err) => {
                            reject({ statusCode: 400, message: err });
                        })
                    }
                });
            })
            return promise;
        }
    }
];