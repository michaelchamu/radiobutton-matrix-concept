let { Matrix } = require('../Models/Matrix.model');
module.exports = [
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
];