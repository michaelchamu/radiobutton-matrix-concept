let { Matrix } = require('../Models/Matrix.model');
module.exports = [
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
}
];