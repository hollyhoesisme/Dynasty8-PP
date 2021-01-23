import React, { Component } from 'react';
import axios from 'axios';
import Select from 'react-select';

const houseInteriorOptions = [
    { value: '1-southside', label: '1. Southside' },
    { value: '2-middleclass', label: '2. Middle Class' },
    { value: '3-mansion', label: '3. Mansion' },
    { value: '10-business', label: '10. Business' },
];

// Temporary Property Owners. Should be populated from your Users Database.
const propertyOwnersOptions = [
    { value: 'Wayne Givens', label: 'Wayne Givens' },
    { value: 'Joe Nilly', label: 'Joe Nilly' },
    { value: 'RJ Stevens', label: 'RJ Stevens' },
    { value: 'Gene Galarin', label: 'Gene Galarin' },
];

export default class EditTodo extends Component {

    constructor(props) {
        super(props);

        this.setLastModified = this.setLastModified.bind(this);
        this.setNewGpsCoordinates = this.setNewGpsCoordinates.bind(this);
        this.onChangePropertyAddress = this.onChangePropertyAddress.bind(this);
        this.onChangePropertyPrice = this.onChangePropertyPrice.bind(this);
        this.onChangePropertyOwner = this.onChangePropertyOwner.bind(this);
        this.onChangeHouseId = this.onChangeHouseId.bind(this);
        this.onChangePropertyRealtor = this.onChangePropertyRealtor.bind(this);
        this.onChangePropertyNotes = this.onChangePropertyNotes.bind(this);
        this.onSelectChangeHouseInterior = this.onSelectChangeHouseInterior.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
        this.onCancel = this.onCancel.bind(this);

        this.state = {
            date_submitted: null,
            property_address: '',
            property_price: null,
            property_owner: '',
            property_house_id: null,
            property_realtor: '',
            property_gps_coordinates: '',
            property_notes: '',
            property_house_interior: null,
            showSubmissible: false,
            isSubmissible: false,
        }
    }

    componentDidMount() {
        console.log(this.props);
        axios.get('http://localhost:4000/todos/' + this.props.match.params.id)
            .then(response => {
                const initial_owner = response.data.property_owner;
                const initialPropertyOwner = propertyOwnersOptions.find(o => o.value === initial_owner);

                const initial_interior = response.data.property_house_interior;
                const initialPropertyHouseInterior = houseInteriorOptions.find(i => i.value === initial_interior);

                this.setState({
                    date_submitted: response.data.date_submitted,
                    property_address: response.data.property_address,
                    property_price: response.data.property_price,
                    property_owner: initialPropertyOwner,
                    property_house_id: response.data.property_house_id,
                    property_realtor: response.data.property_realtor,
                    property_house_interior: initialPropertyHouseInterior,
                    property_notes: response.data.property_notes,
                    property_gps_coordinates: response.data.property_gps_coordinates,
                });
            })
            .catch(function (error) {
                console.log(error);
            })
    }


    getFormattedDateSubmitted(date) {
        date = new Date(date);
        return date.toLocaleDateString();
    }

    // This works, but I'd replace this with w/e function you're currently use
    // to get the current date/time in the city. Ensures consistency for your database.
    // This function should be called in onSubmit()
    setLastModified() {
        const today = new Date();
        return today.toString();
    }

    // For testing purposes, just generates an arbitratry coordinate
    // Replace this with your existing function that gets current coordinates
    setNewGpsCoordinates() {
        console.log('coords');
        const num1 = Math.random() * (500000 - 100000) + 100000;
        const num2 = Math.random() * (500000 - 100000) + 100000;
        const coords = "<" + num1 + ", " + num2 + ">"
        this.setState({
            property_gps_coordinates: coords
        });
    }

    onChangePropertyOwner = property_owner => {
        const p = property_owner.value;
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

    onSubmit(e) {
        e.preventDefault();
        const isSubmissible = this.isSubmissible();

        if (isSubmissible === true) {
            const lastModified = this.setLastModified();
            const obj = {
                date_submitted: this.state.date_submitted,
                last_modified: lastModified,
                property_address: this.state.property_address,
                property_price: this.state.property_price,
                property_owner: this.state.property_owner.value,
                property_house_id: this.state.property_house_id,
                property_realtor: this.state.property_realtor,
                property_house_interior: this.state.property_house_interior.value,
                property_notes: this.state.property_notes,
                property_gps_coordinates: this.state.property_gps_coordinates,
            };
            console.log(obj);
            console.log(this.props.match.params.id);
            axios.post('http://localhost:4000/todos/update/' + this.props.match.params.id, obj)
                .then(res => console.log(res.data));

            this.props.history.push('/');
        } else {
            this.setState({
                showSubmissible: true
            })
        }
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

    onCancel() {
        console.log('cancel');
        this.props.history.push('/');
    }

    render() {
        return (
            <div className="container" style={{ marginTop: 10 }}>
                <h3>Editing Property Title:
                    <h3 className="green-header">
                        {this.state.property_address}
                    </h3>
                </h3>
                <form onSubmit={this.onSubmit}>
                    <div class="row">
                        <div className="col-md-6">
                        </div>
                        <div className="col-md-6">
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Date: </label>
                        <input readOnly
                            type="text"
                            className="form-control"
                            value={this.getFormattedDateSubmitted(this.state.date_submitted)}

                        />
                    </div>
                    <div className="form-group">
                        <label>Address: </label>
                        <input type="text"
                            className="form-control"
                            value={this.state.property_address}
                            onChange={this.onChangePropertyAddress}
                        />
                    </div>
                    <div className="form-group">
                        <label>Property Owner:</label>
                        <Select
                            value={this.state.property_owner}
                            onChange={this.onChangePropertyOwner}
                            options={propertyOwnersOptions}
                        />
                    </div>
                    <div className="form-group">
                        <label>Property ID: </label>
                        <input type="text"
                            className="form-control"
                            value={this.state.property_house_id}
                            onChange={this.onChangeHouseId}
                        />
                    </div>
                    <div className="form-group">
                        <label>Price: </label>
                        <input type="text"
                            className="form-control"
                            value={this.state.property_price}
                            onChange={this.onChangePropertyPrice}
                        />
                    </div>
                    <div className="form-group">
                        <label>Property Interior:</label>
                        <Select
                            value={this.state.property_house_interior}
                            onChange={this.onSelectChangeHouseInterior}
                            options={houseInteriorOptions}
                        />
                    </div>
                    <div className="form-group">
                        <label>Realtor: </label>
                        <input type="text"
                            className="form-control"
                            value={this.state.property_realtor}
                            onChange={this.onChangePropertyRealtor}
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
                        <input readOnly
                            type="text"
                            className="form-control"
                            value={this.state.property_gps_coordinates}
                        />
                        <input onClick={() => { this.setNewGpsCoordinates() }} value="Update Location" className="btn btn-warning" />
                    </div>
                    <div className="form-group">
                        <input type="submit" value="Update Property" className="btn btn-primary" />
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