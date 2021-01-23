import React, { Component } from 'react';
import axios from 'axios';
import Select from 'react-select';
import '../App.css';

const houseInteriorOptions = [
    { value: '1-southside', label: '1. Southside' },
    { value: '2-middleclass', label: '2. Middle Class' },
    { value: '3-mansion', label: '3. Mansion' },
    { value: '10-business', label: '10. Business' },
];

// Temporary Property Owners. Should be populated from your Users Database.
const propertyOwners = [
    { value: 'Wayne Givens', label: 'Wayne Givens' },
    { value: 'Joe Nilly', label: 'Joe Nilly' },
    { value: 'RJ Stevens', label: 'RJ Stevens' },
    { value: 'Gene Galarin', label: 'Gene Galarin' },
];

// Address
// Date - DATE (auto-filled)
// Price - Integer (open text)
// Realtor - String (open text)
// Property owner - String (dropdown)
// House ID - Integer (open text, or autofilled)
// GPS Coordinates - string (autofilled)
// Notes - string - open text

// Transfers
// Address
// Date
// Realtor
// Old Property Owner
// New Property Owner
// Old House ID
// New House ID
// Notes

export default class CreateTodo extends Component {
    constructor(props) {
        super(props);
        this.getDateSubmitted = this.getDateSubmitted.bind(this);
        this.onChangePropertyAddress = this.onChangePropertyAddress.bind(this);
        this.onChangePropertyPrice = this.onChangePropertyPrice.bind(this);
        this.onChangePropertyOwner = this.onChangePropertyOwner.bind(this);
        this.onChangeHouseId = this.onChangeHouseId.bind(this);
        this.onChangePropertyRealtor = this.onChangePropertyRealtor.bind(this);
        this.onChangePropertyNotes = this.onChangePropertyNotes.bind(this);
        this.onSelectChangeHouseInterior = this.onSelectChangeHouseInterior.bind(this);
        this.onSubmit = this.onSubmit.bind(this);

        const today = this.getDateSubmitted();
        const coords = this.getGpsCoordinates();
        console.log(props);
        this.state = {
            date_submitted: today,
            property_address: props.location.address,
            property_price: props.location.price,
            property_owner: '',
            property_house_id: null,
            property_realtor: '',
            property_house_interior: null,
            property_notes: '',
            property_gps_coordinates: coords,
            property_description: props.location.description,
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
                property_owner: this.state.property_owner.value,
                property_house_id: this.state.property_house_id,
                property_realtor: this.state.property_realtor,
                property_house_interior: this.state.property_house_interior.value,
                property_notes: this.state.property_notes,
                property_gps_coordinates: this.state.property_gps_coordinates,
            };

            axios.post('http://localhost:4000/todos/inserttitle', newProperty)
                .then(res => console.log(res.data));

            this.setState({
                date_submitted: null,
                property_address: '',
                property_price: null,
                property_owner: '',
                property_house_id: null,
                property_realtor: '',
                property_gps_coordinates: '',
                property_notes: '',
                property_house_interior: null
            });
        } else {
            this.setState({
                showSubmissible: true
            })
        }
    }

    // This works, but I'd replace this with w/e function you're currently use
    // to get the current date/time in the city. Ensures consistency for your database.
    getDateSubmitted() {
        const today = new Date();
        return today.toString();
    }

    // For testing purposes, just generates an arbitratry coordinate
    // Replace this with your existing function that gets current coordinates
    getGpsCoordinates() {
        const num1 = Math.random() * (500000 - 100000) + 100000;
        const num2 = Math.random() * (500000 - 100000) + 100000;
        const coords = "<" + num1 + ", " + num2 + ">"
        return coords;
    }

    onChangePropertyOwner = property_owner => {
        this.setState(
            { property_owner }
        );
    }

    onChangePropertyPrice(e) {
        this.setState({
            property_price: parseInt(e.target.value)
        })
    }

    onChangeHouseId(e) {
        this.setState({
            property_house_id: parseInt(e.target.value)
        })
    }

    onChangePropertyRealtor(e) {
        this.setState({
            property_realtor: e.target.value
        })
    }

    onSelectChangeHouseInterior = property_house_interior => {
        this.setState(
            { property_house_interior }
        );
    };

    onChangePropertyAddress(e) {
        this.setState({
            property_address: e.target.value
        })
    }

    onChangePropertyNotes(e) {
        this.setState({
            property_notes: e.target.value
        });
    }

    filterSearch() {

    }

    render() {
        return (
            <div className="container" style={{ marginTop: 10 }}>
                <div>
                    <h3>Add New Title:
                        <h3 className="green-header">
                            {this.state.property_address}
                        </h3>
                    </h3>
                </div>
                <form onSubmit={this.onSubmit}
                    noValidate>
                    <div className="form-group">
                        <label>Date: </label>
                        <input
                            type="text"
                            className="form-control"
                            value={this.state.date_submitted}
                            readOnly
                        />
                    </div>
                    <div className="form-group">
                        <label>Address: </label>
                        <input type="text"
                            className="form-control"
                            value={this.state.property_address}
                            onChange={this.onChangePropertyAddress}
                            required
                            readOnly
                        />
                    </div>
                    <div className="form-group">
                        <label>Property Owner:</label>
                        <Select
                            value={this.state.property_owner}
                            onChange={this.onChangePropertyOwner}
                            options={propertyOwners}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Property ID: </label>
                        <input type="text"
                            className="form-control"
                            value={this.state.property_house_id}
                            onChange={this.onChangeHouseId}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Price: </label>
                        <input type="text"
                            className="form-control"
                            value={this.state.property_price}
                            onChange={this.onChangePropertyPrice}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Property Interior:</label>
                        <Select
                            value={this.state.property_house_interior}
                            onChange={this.onSelectChangeHouseInterior}
                            options={houseInteriorOptions}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Realtor: </label>
                        <input type="text"
                            className="form-control"
                            value={this.state.property_realtor}
                            onChange={this.onChangePropertyRealtor}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Description: </label>
                        <textarea
                            type="text"
                            className="form-control"
                            value={this.state.property_description}
                            readOnly
                        />
                    </div>
                    <div className="form-group">
                        <label>Notes: </label>
                        <textarea
                            type="text"
                            className="form-control"
                            value={this.state.property_notes}
                            onChange={this.onChangePropertyNotes}
                        />
                    </div>
                    <div className="form-group">
                        <label>GPS Coordinates: </label>
                        <input
                            type="text"
                            className="form-control"
                            value={this.state.property_gps_coordinates}
                            readOnly
                        />
                    </div>
                    <div className="form-group">
                        <input type="submit" value="Add Title" className="btn btn-primary" />
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