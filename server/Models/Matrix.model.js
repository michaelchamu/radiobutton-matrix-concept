const mongoose = require('mongoose');

let MatrixSchema = new mongoose.Schema({
    type: {
        type: String,
        require: true
    },
    label: {
        type: String
    },
    image: {
        type: String
    },
    uniqueid: {
        type: String
    }
});

let Matrix = mongoose.model('Matrix', MatrixSchema);
module.exports = { Matrix };