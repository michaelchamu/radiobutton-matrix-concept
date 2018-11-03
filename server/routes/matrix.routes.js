const _ = require('lodash');
let { Matrix } = require('../Models/Matrix.model');
module.exports = [
  {
      method: 'GET',
      path: '/api/matrix',
      handler: (request, h) => {	
      	let promise = new Promise((resolve, reject) => {
      		Matrix.find((error, results) => {
             if(error) {
             	reject({statusCode: 400, message: err});
             } else {
             	resolve({statusCode: 200, results});
             }
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
    let body = _.pick(request.payload, ['label', 'type', 'uniqueid', 'image']);
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
     			if(!record)
     				reject({statusCode: 404})
     			else
     				resolve({statusCode:201})
     		}).catch((err) => {
     			reject({statusCode: 404, message: err});
     	})
    });
    return promise;
  }
},
]; 