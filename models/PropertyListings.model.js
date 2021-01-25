const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let PropertyListings = new Schema({
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
    property_description: {
        type: String
    },
    property_area: {
        type: String
    },
    property_gps_coordinates: {
        type: String
    }
});

module.exports = mongoose.model('PropertyListings', PropertyListings);