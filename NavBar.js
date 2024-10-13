import React from 'react';
import { Navbar, Nav, Button } from 'react-bootstrap';
import { auth } from './firebaseFunction';
import { signOut } from 'firebase/auth';

function NavBar({ user }) {
  const handleLogout = async () => {
    try {
      await signOut(auth);
      console.log("Logged out successfully!");
    } catch (error) {
      console.error("Error logging out:", error.message);
    }
  };

  return (
    <Navbar bg="dark" variant="dark" expand="lg">
      <Navbar.Brand href="#">Delivery Tracker</Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="me-auto">
          <Nav.Link href="#">Home</Nav.Link>
          <Nav.Link href="#">About</Nav.Link>
          <Nav.Link href="#">Services</Nav.Link>
        </Nav>
        {user && (
          <Button variant="outline-light" onClick={handleLogout} className="ml-auto">
            Logout
          </Button>
        )}
      </Navbar.Collapse>
    </Navbar>
  );
}

export default NavBar;