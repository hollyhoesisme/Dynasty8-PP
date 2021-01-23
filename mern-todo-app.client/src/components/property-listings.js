import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import axios from 'axios';
import '../App.css';

export default class PropertyListings extends Component {
    constructor(props) {
        super(props);

        this.state = {
            listings: [],
            mirror_park: [],
            vinewood_hills: [],
            south_side: [],
            is_viewable: {
                mirror_park: true,
                vinewood_hills: true,
                south_side: true
            }
        };
    }

    componentDidMount() {
        axios.get('http://localhost:4000/todos/getlistingsmerged')
            .then(response => {
                this.setState({ listings: response.data });
                console.log(this.state.listings);
                this.separateByCity();
            })
            .catch(function (error) {
                console.log(error);
            })
    }

    separateByCity() {
        let allCities = this.state.listings;
        let mirrorPark = allCities.filter(listing => listing.property_area === "Mirror Park");
        let vinewoodHills = allCities.filter(listing => listing.property_area === "Vinewood");
        let southside = allCities.filter(listing => listing.property_area === "Southside");

        this.setState({
            mirror_park: mirrorPark,
            vinewood_hills: vinewoodHills,
            south_side: southside
        })
    }

    deleteProperty(propertyId) {
        // This "refreshes" the table upon delete. 
        // Without this, you have to refresh the web page to reflect the delete
        const currentProperties = this.state.listings;
        this.setState({
            listings: currentProperties.filter(p => p._id != propertyId)
        });

        axios.delete('http://localhost:4000/todos/deletelisting/' + propertyId)
            .then((res) => {
                console.log(this.props.todo.property_address + ' has been deleted')
            }).catch((error) => {
                console.log(error)
            })
    }

    getFormattedDateSubmitted(date) {
        date = new Date(date);
        return date.toLocaleDateString();
    }

    getFormattedPrice(price) {
        if (typeof (price) === "number") {
            return "$" + price.toLocaleString();
        } else {
            return price;
        }
    }

    getFormattedDescription(description) {
        var maxLength = 80;
        if (description.length > maxLength) {
            description = description.substring(0, maxLength) + "...";
        }
        return description;
    }

    filterSearch(searchString) {
        let city = this.state.vinewood_hills;
        city = city.filter(c => (
            c.property_address === searchString
        ));
    }

    getEditTitleButton() {
        return (
            <div>
                <Button className="grid-button" variant="secondary">Edit Title</Button>
            </div>
        );
    }

    getEditListingButton() {
        return (
            <div>
                <Button className="grid-button" variant="secondary">Edit Listing</Button>
            </div>
        );
    }

    getTransferButton() {
        return (
            <div>
                <Button className="grid-button" variant="warning">Transfer Title</Button>
            </div>
        );
    }

    getTable(city) {
        return (
            <table className="custom-table table table-bordered" >
                {this.getTableColumns()}
                <tbody>
                    {this.getPropertyListings(city)}
                </tbody>
            </table>
        );
    }

    getTableColumns() {
        return (
            <thead>
                <tr>
                    <th>---</th>
                    <th>---</th>
                    <th>Address</th>
                    <th>Price</th>
                    <th>Owner</th>
                    <th>Description</th>
                    <th>Area</th>
                    <th>Delete</th>
                </tr>
            </thead>
        );
    }

    getPropertyListings(city) {
        let propertyListings = city.map((currentListing, i) => {
            return (
                <tr>
                    <td>
                        <Link to={{
                            pathname: "/createtitle/" + currentListing.id,
                            address: currentListing.property_address,
                            price: currentListing.property_price,
                            description: currentListing.property_description
                        }}>
                            {
                                !currentListing.is_sold
                                    ? <Button className="grid-button" variant="success">Add Title</Button>
                                    : null
                            }
                        </Link>
                        <Link to={"/edittitle/" + currentListing.id}>
                            {
                                currentListing.is_sold
                                    ? this.getEditTitleButton()
                                    : null
                            }
                        </Link>
                    </td>
                    <td>
                        <Link to={{
                            pathname: "/transfertitle/" + currentListing._id,
                            id: currentListing.id,
                            address: currentListing.property_address,
                            old_property_owner: currentListing.property_owner,
                        }}>
                            {
                                currentListing.is_sold
                                    ? this.getTransferButton()
                                    : null
                            }
                        </Link>
                        <Link to={{
                            pathname: "/editlisting/" + currentListing._id,
                            id: currentListing._id,
                        }}>
                            {
                                !currentListing.is_sold
                                    ? this.getEditListingButton()
                                    : null
                            }
                        </Link>
                    </td>
                    <td>{currentListing.property_address}</td>
                    <td>{this.getFormattedPrice(currentListing.property_price)}</td>
                    <td>{currentListing.property_owner}</td>
                    <td class="cell">{this.getFormattedDescription(currentListing.property_description)}</td>
                    <td>{currentListing.property_area}</td>
                    <td>
                        <Button className="grid-button delete"
                            variant="danger"
                            onClick={() => { this.deleteProperty(currentListing._id) }}>
                            Delete
                                </Button>
                    </td>
                </tr >
            );
        });

        return propertyListings;
    }

    render() {
        return (
            <div>
                <div className="title">
                    <h3>Property Listings</h3>
                    <div className="search-div">
                        <input type="text"
                            className="search-filter form-control"
                            onChange={this.filterSearch()}
                        />
                    </div>
                </div>
                <br />
                <div className="title">
                    <h3 className="city title">Mirror Park</h3>
                    {
                        this.state.is_viewable.mirror_park
                            ? <div> {this.getTable(this.state.mirror_park)}</div>
                            : null
                    }
                </div>
                <br />
                <div className="title">
                    <h3 className="city title">Vinewood Hills</h3>
                    <div>
                        {this.getTable(this.state.vinewood_hills)}
                    </div>
                </div>
                <br />
                <div className="title">
                    <h3 className="city title">Southside</h3>
                    <div>
                        {this.getTable(this.state.south_side)}
                    </div>
                </div>
            </div>
        )
    }
}