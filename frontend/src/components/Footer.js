import React from 'react'
// React-Bootstrap elements being imported
import {Container, Row, Col} from 'react-bootstrap'


const Footer = () => {
    return (
        <footer>
            <Container>
                <Row>
                    <Col className = 'text-center py-3'> 
                        Copyright &copy; Tekhamian Store-Front
                    </Col>
                </Row>
            </Container>
        </footer>
    )
}

export default Footer
