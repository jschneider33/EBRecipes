import React from 'react';
import { Link } from 'react-router-dom';
import { AuthUserContext } from '../Session';

import { Navbar, Nav } from 'react-bootstrap';

import SignOutButton from '../SignOut';

import * as ROUTES from '../../constants/routes';

import "./index.css";
 
const Navigation = () => (
  <div>
    <AuthUserContext.Consumer>
      {authUser =>
        authUser ? <NavigationAuth /> : <NavigationNonAuth />
      }
    </AuthUserContext.Consumer>
  </div>
)

const NavigationNonAuth = () => (

  <Navbar className="navbarMain" expand="lg">
    <Navbar.Brand className="brandMain" href="/">EBRecipes</Navbar.Brand>
    <Navbar.Toggle aria-controls="basic-navbar-nav" />
    <Navbar.Collapse id="basic-navbar-nav">
      <Nav className="navMain ml-auto">
        <Nav.Link href={ROUTES.HOME}>Home</Nav.Link>
        <Nav.Link href={ROUTES.LOGIN}>Login</Nav.Link>
      </Nav>
    </Navbar.Collapse>
  </Navbar>
);

const NavigationAuth = () => (
  <Navbar className="navbarMain" expand="lg">
    <Navbar.Brand className="brandMain" href="/">EBRecipes</Navbar.Brand>
    <Navbar.Toggle aria-controls="basic-navbar-nav" />
    <Navbar.Collapse id="basic-navbar-nav">
      <Nav className="navMain ml-auto">
        <Nav.Link href={ROUTES.HOME}>Home</Nav.Link>
        <Nav.Link href={ROUTES.NEWRECIPE}>Add Recipe</Nav.Link>
        <SignOutButton />
      </Nav>
    </Navbar.Collapse>
  </Navbar>
);

export default Navigation;