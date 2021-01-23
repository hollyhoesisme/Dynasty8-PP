const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const todoRoutes = express.Router();
const PORT = 4000;

let Todo = require('./models/todo.model');
let PropertyListings = require('./models/PropertyListings.model');
let PropertyTransfers = require('./models/PropertyTransfers.model');

app.use(cors());
app.use(bodyParser.json());

mongoose.connect('mongodb://127.0.0.1:27017/todos', { useNewUrlParser: true });
const connection = mongoose.connection;

connection.once('open', function () {
    console.log("MongoDB database connection established successfully");
})

todoRoutes.route('/getsold').get(function (req, res) {
    Todo.find(function (err, todos) {
        if (err) {
            console.log(err);
        } else {
            res.json(todos);
        }
    });
});

todoRoutes.route('/getlistings').get(function (req, res) {
    PropertyListings.find(function (err, listings) {
        if (err) {
            console.log(err);
        } else {
            res.json(listings);
        }
    });
});

//This should be a JOIN with your PropertyListings.dbo and SoldProperties.dbo.
//Ignore the code here, it's just a hacky way of doing a join because MongoDB is weird and I'm lazy.
todoRoutes.route('/getlistingsmerged').get(function (req, res) {
    Todo.find(function (err, todos) {
        if (err) {
            console.log(err);
        } else {
            PropertyListings.find(function (err, listings) {
                if (err) {
                    console.log(err);
                } else {
                    var listingsJson = JSON.parse(JSON.stringify(listings));
                    var soldJson = JSON.parse(JSON.stringify(todos));
                    for (var i = 0; i < listingsJson.length; i++) {
                        for (var j = 0; j < soldJson.length; j++) {
                            delete listingsJson[i]["__v"];
                            if (listingsJson[i]["property_address"] === soldJson[j]["property_address"]) {
                                listingsJson[i]["property_owner"] = soldJson[j]["property_owner"];
                                listingsJson[i]["property_realtor"] = soldJson[j]["property_realtor"];
                                //Updates the price but doesn't actually modify PropertyListings.dbo
                                listingsJson[i]["property_price"] = 142232;
                                //This should be a normal ID and not the
                                listingsJson[i]["id"] = soldJson[j]._id;

                                if (soldJson[j]["property_owner"]) {
                                    listingsJson[i]["is_sold"] = true;
                                } else {
                                    listingsJson[i]["is_sold"] = false;

                                }
                            }

                        }
                    }
                    res.send(listingsJson);
                }
            });
        }
    });
});

todoRoutes.route('/:id').get(function (req, res) {
    let id = req.params.id;
    Todo.findById(id, function (err, todo) {
        res.json(todo);
    });
});

todoRoutes.route('/getlisting/:id').get(function (req, res) {
    let id = req.params.id;
    PropertyListings.findById(id, function (err, todo) {
        res.json(todo);
    });
});

todoRoutes.route('/update/:id').post(function (req, res) {
    Todo.findById(req.params.id, function (err, todo) {
        if (!todo)
            res.status(404).send("data is not found");
        else {
            todo.last_modified = req.body.last_modified;
            todo.property_address = req.body.property_address;
            todo.property_price = req.body.property_price;
            todo.property_owner = req.body.property_owner;
            todo.property_house_id = req.body.property_house_id;
            todo.property_realtor = req.body.property_realtor;
            todo.property_house_interior = req.body.property_house_interior;
            todo.property_notes = req.body.property_notes;
            todo.property_gps_coordinates = req.body.property_gps_coordinates;
        }
        todo.save().then(todo => {
            res.json('Todo updated!');
        })
            .catch(err => {
                res.status(400).send("Update not possible");
            });
    });
});

todoRoutes.route('/updatelisting/:id').post(function (req, res) {
    PropertyListings.findById(req.params.id, function (err, todo) {
        if (!todo)
            res.status(404).send("data is not found");
        else {
            todo.property_address = req.body.property_address;
            todo.property_price = req.body.property_price;
            todo.property_description = req.body.property_description;
            todo.property_area = req.body.property_area;
            todo.property_gps_coordinates = req.body.property_gps_coordinates;
        }
        todo.save().then(todo => {
            res.json('Listing updated!');
        })
            .catch(err => {
                res.status(400).send("Update not possible");
            });
    });
});

todoRoutes.route('/inserttitle').post(function (req, res) {
    let todo = new Todo(req.body);
    todo.save()
        .then(todo => {
            res.status(200).json({ 'todo': 'todo added successfully' });
        })
        .catch(err => {
            res.status(400).send('adding new todo failed');
        });
});

todoRoutes.route('/insertlisting').post(function (req, res) {
    let listing = new PropertyListings(req.body);
    listing.save()
        .then(listing => {
            res.status(200).json({ 'listing': 'listing added successfully' });
        })
        .catch(err => {
            res.status(400).send('adding new listing failed');
        });
});

todoRoutes.route('/inserttransfer').post(function (req, res) {
    let transfer = new PropertyTransfers(req.body);
    transfer.save()
        .then(transfer => {
            res.status(200).json({ 'transfer': 'transfer added successfully' });
        })
        .catch(err => {
            res.status(400).send('adding new transfer failed');
        });
});

todoRoutes.route('/delete/:id').delete(function (req, res) {
    Todo.findByIdAndRemove(req.params.id, (error, data) => {
        if (error) {
            return next(error);
        } else {
            res.status(200).json({
                msg: data
            });
        }
    });
});

todoRoutes.route('/deletelisting/:id').delete(function (req, res) {
    PropertyListings.findByIdAndRemove(req.params.id, (error, data) => {
        if (error) {
            return next(error);
        } else {
            res.status(200).json({
                msg: data
            });
        }
    });
});

app.use('/todos', todoRoutes);

app.listen(PORT, function () {
    console.log("Server is running on Port: " + PORT);
});