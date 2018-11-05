const _ = require('lodash');
let { Matrix } = require('../Models/Matrix.model');
module.exports = [{
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
                    (a, b) => (a.length > b.length ? a : b), "").length;
                //count the total number of images saved in the database
                dataStore.images = _.sumBy(results, ({ image }) => Number(image != null));
                resolve({ statusCode: 200, dataStore });
                resolve(results)
            }, (err) => {
                reject(err)
            });
        });
        return promise;
    }
}];