const _ = require('lodash');
const fs = require("fs");
const path = require('path');
let { Matrix } = require('../Models/Matrix.model');
module.exports = [
  {
      method: ['GET'],
      path: '/api/matrix',
      handler: (request, h) => {
      	let promise = new Promise((resolve, reject) => {
          Matrix.find({}).then((results) => {

              let dataStore = {};
               dataStore.data = results;
             //get all rows in result set
               dataStore.rows = _.filter(results, { type: "row" });
             //get all columns in result set
             dataStore.columns = _.filter(results, { type: "column" });
             //get the row with the longest label in the rows result set
             dataStore.longestRow = _.map(dataStore.rows, "label").reduce(
               (a, b) => (a.length > b.length ? a : b), "").length;
             //get the column with the longest label in the columsn result set
             dataStore.longestColumn = _.map(dataStore.columns, "label").reduce(
               (a, b) => (a.length > b.length ? a : b),"").length;
             //count the total number of images saved in the database
             dataStore.images = _.sumBy(results, ({ image }) => Number(image !== null));
               resolve({statusCode: 200, dataStore});
            resolve(results)
          }, (err) => {
            reject(err)
          });
      	});     
      	 return promise;   
      }

  },
  //create a record
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
    		if(err) {
    			reject({statusCode: 400, message: err});
    		} else {
    			resolve({statusCode: 201, result});
    		}
   		})
    });
    return promise;
  }
},
//update a record
 {
  method: ['PATCH'],
  path: "/api/matrix/{uniqueid}",
  //request is the data from client side while h is the response that can be customised to give feedback to the client
  handler: (request, h) => {
    //pick the desired values from the payload
    let uniqueid = request.params.uniqueid;
    let body = _.pick(request.payload, ['label', 'type', 'image']);
    //save values in matrix object
    let promise = new Promise((resolve, reject) => {
    	 Matrix.findOneAndUpdate({'uniqueid': uniqueid, 'type': body.type},
     	{ $set: { 'label': body.label, 
     		   'type': body.type, 'image': body.image,
     		   'uniqueid': uniqueid}
     		}).then((record) => {
     			if(!record){
     			    resolve({statusCode: 404})}
     			else{
     			     resolve({statusCode:201})}
     		}).catch((err) => {
     			reject({statusCode: 400, message: err});
     	})
    });
    return promise;
  }
},
//delete record
{
  method: "DELETE",
  path: "/api/matrix/{uniqueid}",
  handler: (request, h) => {
  	let uniqueid = request.params.uniqueid;
  	let promise = new Promise((resolve, reject) => {
  		Matrix.findOneAndDelete({'uniqueid': uniqueid}).then((record) => {
  			if(!record){
  				resolve({statusCode: 404});
  			} else {
  				resolve({statusCode:201});
  			}
  			}).catch((err) => {
  			reject({statusCode: 400, message: err});
  		})
  	})
  	return promise;
  }
},
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
          const stream = fs.createWriteStream(path.join(__dirname,'..','images', file.hapi.filename));
          file.on('error', err => reply(err));
          file.pipe(stream);
          file.on('end', err => {
            if (err) {
              reject({statusCode: 400, message: 'image upload failed'})
            } else {
              resolve({statusCode: 201, message: 'image uploaded'})
            }
      });
    })
    return promise;
  }
}
]; 