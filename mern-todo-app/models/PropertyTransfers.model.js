const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let PropertyTransfers = new Schema({
    date_submitted: {
        type: Date
    },
    property_address: {
        type: String
    },
    property_resale_price: {
        type: Number
    },
    old_property_owner: {
        type: String
    },
    new_property_owner: {
        type: String
    },
});

module.exports = mongoose.model('PropertyTransfers', PropertyTransfers);