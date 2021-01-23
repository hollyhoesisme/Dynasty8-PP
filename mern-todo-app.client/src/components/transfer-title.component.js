import React, { Component } from 'react';
import axios from 'axios';
import Select from 'react-select';
import '../App.css';

// Temporary Property Owners. Should be populated from a backend query to your Players database.
const propertyOwnersOptions = [
    { value: 'Wayne Givens', label: 'Wayne Givens' },
    { value: 'Joe Nilly', label: 'Joe Nilly' },
    { value: 'RJ Stevens', label: 'RJ Stevens' },
    { value: 'Gene Galarin', label: 'Gene Galarin' },
];

export default class TransferTitle extends Component {
    constructor(props) {
        super(props);
        this.getDateSubmitted = this.getDateSubmitted.bind(this);
        this.onChangePropertyAddress = this.onChangePropertyAddress.bind(this);
        this.onChangePropertyResalePrice = this.onChangePropertyResalePrice.bind(this);
        this.onChangeOldPropertyOwner = this.onChangeOldPropertyOwner.bind(this);
        this.onChangeNewPropertyOwner = this.onChangeNewPropertyOwner.bind(this);
        this.onSubmit = this.onSubmit.bind(this);

        const today = this.getDateSubmitted();
        console.log(props);
        this.state = {
            date_submitted: today,
            property_title: {},
            property_address: props.location.address,
            property_resale_price: null,
            old_property_owner: props.location.old_property_owner,
            new_property_owner: null,
            showSubmissible: false,
            isSubmissible: false,
        };
    }

    componentDidMount() {
        axios.get('http://localhost:4000/todos/' + this.props.location.id)
            .then(response => {
                this.setState({ property_title: response.data });
                console.log(this.state.property_title);
            })
            .catch(function (error) {
                console.log(error);
            });
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

            const transferredTitle = {
                date_submitted: today,
                property_address: this.state.property_address,
                property_resale_price: this.state.property_price,
                old_property_owner: this.state.old_property_owner.value,
                new_property_owner: this.state.new_property_owner.value,
            };

            axios.post('http://localhost:4000/todos/inserttransfer', transferredTitle)
                .then(res => console.log(res.data));

            this.state.property_title.property_owner = this.state.new_property_owner.value;
            const updatedTitle = this.state.property_title;

            axios.post('http://localhost:4000/todos/update/' + updatedTitle._id, updatedTitle)
                .then(res => console.log(res.data));

            this.setState({
                date_submitted: null,
                property_address: '',
                property_resale_price: null,
                old_property_owner: null,
                new_property_owner: null,
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
    getDateSubmitted() {
        const today = new Date();
        return today.toString();
    }

    onChangeOldPropertyOwner = old_property_owner => {
        this.setState(
            { old_property_owner }
        );
    }

    onChangeNewPropertyOwner = new_property_owner => {
        this.setState(
            { new_property_owner }
        );
    }

    onChangePropertyResalePrice(e) {
        this.setState({
            property_resale_price: parseInt(e.target.value)
        });
    }

    onChangePropertyAddress(e) {
        this.setState({
            property_address: e.target.value
        });
    }

    render() {
        return (
            <div className="container" style={{ marginTop: 10 }}>
                <div>
                    <h3>
                        Transfer Title:
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
                        />
                    </div>
                    <div className="form-group">
                        <label>Resale Price: </label>
                        <input type="text"
                            className="form-control"
                            value={this.state.property_resale_price}
                            onChange={this.onChangePropertyResalePrice}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Old Property Owner: </label>
                        <input type="text"
                            className="form-control"
                            value={this.state.old_property_owner}
                            required
                            readOnly
                        />
                    </div>
                    <div className="form-group">
                        <label>New Property Owner: </label>
                        <Select
                            value={this.state.new_property_owner}
                            onChange={this.onChangeNewPropertyOwner}
                            options={propertyOwnersOptions}
                            required
                        />
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