const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let Todo = new Schema({
    date_submitted: {
        type: Date
    },
    last_modified: {
        type: Date
    },
    property_address: {
        type: String
    },
    property_price: {
        type: Number
    },
    property_house_id: {
        type: Number
    },
    property_owner: {
        type: String
    },
    property_realtor: {
        type: String
    },
    property_house_interior: {
        type: String
    },
    property_notes: {
        type: String
    },
    property_gps_coordinates: {
        type: String
    }
});

module.exports = mongoose.model('Todo', Todo);