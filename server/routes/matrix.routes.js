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
             	//count rows
             	//count columns
             	//get rows
             	//get columns
             	//longest row label count
             	//longest column label count
             	//total images
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
     			if(!record){
     			     				reject({statusCode: 404})}
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
  		Matrix.findOneAndRemove({'uniqueid': uniqueid}).then((record) => {
  			if(!record){
  				reject({statusCode: 404});
  			} else {
  				resolve({statusCode:201});
  			}
  			}).catch((err) => {
  			reject({statusCode: 400, message: err});
  		})
  	})
  	return promise;
  }
}
]; 