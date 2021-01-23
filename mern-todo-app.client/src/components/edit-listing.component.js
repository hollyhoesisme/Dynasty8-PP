import React, { Component } from 'react';
import axios from 'axios';
import '../App.css';

export default class EditListing extends Component {
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

    componentDidMount() {
        axios.get('http://localhost:4000/todos/getlisting/' + this.props.location.id)
            .then(response => {
                this.setState({ property_title: response.data });
                console.log(this.state.property_title);

                this.setState({
                    date_submitted: response.data.date_submitted,
                    property_address: response.data.property_address,
                    property_price: response.data.property_price,
                    property_description: response.data.property_description,
                    property_area: response.data.property_area,
                    property_description: response.data.property_description,
                    property_gps_coordinates: response.data.property_gps_coordinates,
                });
            })
            .catch(function (error) {
                console.log(error);
            });
    }

    onSubmit(e) {
        e.preventDefault();

        const today = new Date();
        const isSubmissible = this.isSubmissible();
        console.log("is submissible " + isSubmissible);

        if (isSubmissible === true) {
            console.log(`Form submitted:`);

            const updatedListing = {
                property_address: this.state.property_address,
                property_price: this.state.property_price,
                property_description: this.state.property_description,
                property_area: this.state.property_area,
                property_gps_coordinates: this.state.property_gps_coordinates,
            };

            axios.post('http://localhost:4000/todos/updatelisting/' + this.props.location.id, updatedListing)
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
            this.props.history.push('/');
        } else {
            this.setState({
                showSubmissible: true
            })
        }
    }

    onCancel() {
        console.log('cancel');
        this.props.history.push('/');
    }

    isSubmissible() {
        let submissibleCheck = [];
        for (var key in this.state) {
            console.log(key + ": " + this.state[key]);
            //Not null, boolean, or empty
            if (typeof (this.state[key]) !== "boolean") {
                if (typeof (this.state[key]) === "string") {
                    if (this.state[key] === "" || this.state[key].trim().length <= 0) {
                        submissibleCheck.push(false);
                        console.log('false: ' + key + " " + this.state[key]);
                    }
                } else if (!this.state[key]) {
                    submissibleCheck.push(false);
                    console.log('false: ' + key + " " + this.state[key]);
                }
            }
        }
        console.log(submissibleCheck);
        let isSubmissible = false;
        if (!submissibleCheck.includes(false)) {
            isSubmissible = true;
        }

        return isSubmissible;
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
                    <h3>Edit Listing</h3>
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
                        <input type="submit" value="Update Listing" className="btn btn-primary" />
                        {
                            this.state.showSubmissible
                                ? <p className="dumbass"> Fill out the form properly dumbass!</p>
                                : null
                        }
                        &nbsp;&nbsp;
                        <input onClick={() => { this.onCancel() }} value="Cancel" className="btn btn-danger" />
                    </div>
                </form>
            </div>
        )
    }
}