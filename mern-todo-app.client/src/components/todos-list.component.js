import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import axios from 'axios';

export default class TodosList extends Component {

    constructor(props) {
        super(props);
        this.deleteProperty = this.deleteProperty.bind(this);

        this.state = { todos: [] };
    }

    componentDidMount() {
        axios.get('http://localhost:4000/todos/getsold')
            .then(response => {
                this.setState({ todos: response.data });
            })
            .catch(function (error) {
                console.log(error);
            })
    }

    deleteProperty(propertyId) {
        // This "refreshes" the table upon delete. 
        // Without this, you have to refresh the web page to reflect the delete
        const currentProperties = this.state.todos;
        this.setState({
            todos: currentProperties.filter(p => p._id != propertyId)
        });

        axios.delete('http://localhost:4000/todos/delete/' + propertyId)
            .then((res) => {
                console.log(this.props.todo.property_address + ' has been deleted')
            }).catch((error) => {
                console.log(error)
            })
    }

    filterSearch() {

    }


    getSoldListings() {
        let todoList = this.state.todos.map((currentSold, i) => {
            return (
                <tr>
                    <td>
                        <Link to={"/edittitle/" + currentSold._id}>
                            <Button className="grid-button" variant="secondary">Edit Title</Button>
                        </Link>
                    </td>
                    <td>{currentSold.property_address}</td>
                    <td>{currentSold.property_owner}</td>
                    <td>{currentSold.property_house_id}</td>
                    <td>{currentSold.property_realtor}</td>
                    <td>{currentSold.date_submitted}</td>
                    <td>
                        <Button className="grid-button delete"
                            variant="danger"
                            onClick={() => { this.deleteProperty(currentSold._id) }}>
                            Delete
                                </Button>
                    </td>
                </tr >
            );
        });

        return todoList;
    }

    render() {
        return (
            <div>
                <div className="title">
                    <h3>Sold Properties</h3>
                    <div className="search-div">
                        <input type="text"
                            className="search-filter form-control"
                            onChange={this.filterSearch()}
                        />
                    </div>
                </div>
                <table className="custom-table table table-striped" style={{ marginTop: 20 }} >
                    <thead>
                        <tr>
                            <th>Edit</th>
                            <th>Address</th>
                            <th>Property Owner</th>
                            <th>House ID</th>
                            <th>Realtor</th>
                            <th>Date Submitted</th>
                            <th>Delete</th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.getSoldListings()}
                    </tbody>
                </table>
            </div>
        )
    }
}