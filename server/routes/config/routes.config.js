const createRoutes = require('../create.route');
const readRoutes = require('../read.route');
const updateRoutes = require('../update.route');
const deleteRoutes = require('../delete.route');

module.exports = [].concat(createRoutes, readRoutes, updateRoutes, deleteRoutes);
