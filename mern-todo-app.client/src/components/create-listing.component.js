import React, { Component } from 'react';
import axios from 'axios';
import '../App.css';

export default class CreateListing extends Component {
    constructor(props) {
        super(props);
        this.setDateSubmitted = this.setDateSubmitted.bind(this);
        this.onChangePropertyAddress = this.onChangePropertyAddress.bind(this);
        this.onChangePropertyPrice = this.onChangePropertyPrice.bind(this);
        this.onChangePropertyDescription = this.onChangePropertyDescription.bind(this);
        this.onChangePropertyArea = this.onChangePropertyArea.bind(this);
        this.getNewGpsCoordinates = this.getNewGpsCoordinates.bind(this);
        this.onSubmit = this.onSubmit.bind(this);

        const today = this.setDateSubmitted();
        const coords = this.getNewGpsCoordinates();

        this.state = {
            date_submitted: today,
            property_address: '',
            property_price: null,
            property_description: '',
            property_area: '',
            property_gps_coordinates: coords,
            showSubmissible: false,
            isSubmissible: false,
        };
    }

    onSubmit(e) {
        e.preventDefault();

        const today = new Date();
        let submissibleCheck = [];
        for (var key in this.state) {
            //Not null, boolean, or empty
            if (!this.state[key] && typeof (this.state[key]) !== Boolean && this.state[key] === "") {
                if (key === "property_owner" || key === "property_house_interior") {
                    if (!this.state[key] || this.state[key].value.trim().length <= 0) {
                        submissibleCheck.push(false);
                    }
                } else if (this.state[key].trim().length <= 0) {
                    submissibleCheck.push(false);
                }
            }
        }

        let isSubmissible = false;
        if (!submissibleCheck.includes(false)) {
            isSubmissible = true;
        }

        if (isSubmissible === true) {
            console.log(`Form submitted:`);

            const newProperty = {
                date_submitted: today,
                property_address: this.state.property_address,
                property_price: this.state.property_price,
                property_description: this.state.property_description,
                property_area: this.state.property_area,
                property_gps_coordinates: this.state.property_gps_coordinates,
            };

            axios.post('http://localhost:4000/todos/insertlisting', newProperty)
                .then(res => console.log(res.data));

            this.setState({
                date_submitted: null,
                property_address: '',
                property_price: null,
                property_description: '',
                property_area: '',
                property_gps_coordinates: '',
                isSubmissible: false,
            });
        } else {
            this.setState({
                showSubmissible: true
            })
        }
    }

    // This works, but I'd replace this with w/e function you're currently use
    // to get the current date/time in the city. Ensures consistency for your database.
    setDateSubmitted() {
        const today = new Date();
        return today.toString();
    }

    getFormattedDateSubmitted(date) {
        date = new Date(date);
        return date.toLocaleDateString();
    }


    // For testing purposes, just generates an arbitratry coordinate
    // Replace this with your existing function that gets current coordinates
    getNewGpsCoordinates() {
        const num1 = Math.random() * (500000 - 100000) + 100000;
        const num2 = Math.random() * (500000 - 100000) + 100000;
        const coords = "<" + num1 + ", " + num2 + ">"
        this.setState({
            property_gps_coordinates: coords
        });
    }

    onChangePropertyOwner = property_owner => {
        this.setState(
            { property_owner }
        );
    }

    onChangePropertyPrice(e) {
        this.setState({
            property_price: parseInt(e.target.value)
        });
    }

    onChangePropertyAddress(e) {
        this.setState({
            property_address: e.target.value
        });
    }

    onChangePropertyDescription(e) {
        this.setState({
            property_description: e.target.value
        });
    }

    onChangePropertyArea(e) {
        this.setState({
            property_area: e.target.value
        });
    }

    render() {
        return (
            <div className="container" style={{ marginTop: 10 }}>
                <div className="green-header">
                    <h3>Create New Listing</h3>
                </div>
                <form onSubmit={this.onSubmit}
                    noValidate>
                    <div className="form-group">
                        <label>Date: </label>
                        <input
                            type="text"
                            className="form-control"
                            value={this.getFormattedDateSubmitted(this.state.date_submitted)}
                            readOnly
                        />
                    </div>
                    <div className="form-group">
                        <label>Address: </label>
                        <input type="text"
                            className="form-control"
                            value={this.state.property_address}
                            onChange={this.onChangePropertyAddress}
                            placeholder="Address"
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Price: </label>
                        <input type="text"
                            className="form-control"
                            value={this.state.property_price}
                            onChange={this.onChangePropertyPrice}
                            placeholder="$$$"
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Description: </label>
                        <textarea
                            type="text"
                            className="form-control"
                            value={this.state.property_description}
                            onChange={this.onChangePropertyDescription}
                            placeholder="Description"
                        />
                    </div>
                    <div className="form-group">
                        <label>Property Area: </label>
                        <input type="text"
                            className="form-control"
                            value={this.state.property_area}
                            onChange={this.onChangePropertyArea}
                            placeholder="Property Area"
                        />
                    </div>
                    <div className="form-group">
                        <label>GPS Coordinates: </label>
                        <input
                            type="text"
                            className="form-control"
                            value={this.state.property_gps_coordinates}
                            placeholder="< GPS, Coordinates >"
                            readOnly
                        />
                        <input onClick={() => { this.getNewGpsCoordinates() }} value="Update Location" className="btn btn-warning" />
                    </div>
                    <div className="form-group">
                        <input type="submit" value="Create Listing" className="btn btn-primary" />
                        {
                            this.state.showSubmissible
                                ? <p className="dumbass"> Fill out the form properly dumbass!</p>
                                : null
                        }
                    </div>
                </form>
            </div>
        )
    }
}