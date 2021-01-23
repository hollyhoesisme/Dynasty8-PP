import React, { Component } from "react";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";

//https://stackoverflow.com/questions/61305436/bootstrap-dropdown-is-not-working-in-react
import 'bootstrap/dist/css/bootstrap.min.css';
import 'jquery/dist/jquery.min.js';
import 'bootstrap/dist/js/bootstrap.min.js';
import 'bootstrap/dist/css/bootstrap.min.css';

import CreateTodo from "./components/create-todo.component";
import EditTodo from "./components/edit-todo.component";
import TodosList from "./components/todos-list.component";
import PropertyListings from "./components/property-listings";
import CreateListing from "./components/create-listing.component";

import logo from "./images/logo/Logo-Combined-Transparent.png"
import TransferTitle from "./components/transfer-title.component";
import EditListing from "./components/edit-listing.component";

class App extends Component {
  render() {
    return (
      <Router>
        <div className="container-custom">
          <nav className="navbar-custom navbar navbar-expand-lg navbar-light">
            <div>
              <Link to="/">
                <img className="logo" src={logo} />
              </Link>
            </div>
            <div className="collapse navbar-collapse">
              <ul className="navbar-nav mr-auto">
                <li className="navbar-item">
                  <Link to="/" className="nav-link">Property Listings</Link>
                </li>
                <li className="navbar-item">
                  <Link to="/sold" className="nav-link">Sold Properties</Link>
                </li>
                <li className="navbar-item">
                  <Link to="/createlisting" className="nav-link">Create New Listing</Link>
                </li>
              </ul>
            </div>
          </nav>
          <br />
          <Route path="/" exact component={PropertyListings} />
          <Route path="/sold" exact component={TodosList} />
          <Route path="/edittitle/:id" component={EditTodo} />
          <Route path="/createtitle" component={CreateTodo} render={(props) => <CreateTodo {...props} />} />
          <Route path="/transfertitle" component={TransferTitle} render={(props) => <TransferTitle {...props} />} />
          <Route path="/createlisting" component={CreateListing} />
          <Route path="/editlisting" component={EditListing} render={(props) => <EditListing {...props} />} />
        </div>
      </Router>
    );
  }
}

export default App;