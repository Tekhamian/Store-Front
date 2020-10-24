import React from 'react';
import {LinkContainer} from 'react-router-bootstrap';
import {Container, Navbar, Nav} from 'react-bootstrap';

const Header = () => {
    return (
        <header>
            {/* variant='dark' =  Bootstrap element that lightens the color of the navlinks */}
            <Navbar bg="Dark" variant='dark' expand="lg" collapseOnSelect>
                <Container>
                    <LinkContainer to='/'>
                        <Navbar.Brand>Store-Front</Navbar.Brand>
                    </LinkContainer>
                    
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                        {/* ml-auto = margin-left-auto = Bootstrap element that floats the navlinks over to the right */}
                        <Nav className="ml-auto">
                            <LinkContainer to='/cart'>
                                <Nav.Link>
                                    <i className='fas fa-shopping-cart'> Shop</i>
                                </Nav.Link>
                            </LinkContainer>

                            <LinkContainer to='/login'>
                                <Nav.Link>
                                    <i className='fas fa-user'> Sign In</i>
                                </Nav.Link>
                            </LinkContainer>
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
        </header>
    )
}

export default Header
