import React, { Component } from 'react';
import logo from '../logo.svg';
import '../stylesheets/Header.css';
import Navbar from 'react-bootstrap/Navbar'
import Nav from 'react-bootstrap/Nav'

class Header extends Component {

  navTo (uri) {
    window.location.href = window.location.origin + uri;
  }

  render () {
    return (
      <Navbar bg="dark" variant="dark">
        <Navbar.Brand href="/">
          <img
            src={logo}
            width="30"
            height="30"
            className="d-inline-block align-top"
          />Udacitrivia</Navbar.Brand>
        <Nav className="mr-auto">
          <Nav.Link href="/">List</Nav.Link>
          <Nav.Link href="/add">Add</Nav.Link>
          <Nav.Link href="/play">Play</Nav.Link>
        </Nav>
      </Navbar>
    );
  }
}

export default Header;
