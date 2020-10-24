import React, {useState, useEffect} from 'react'
import {Link} from 'react-router-dom'
import {Row, Col, Image, ListGroup, Card, Button} from 'react-bootstrap'
import Rating from '../components/Rating'
import axios from 'axios'

const ProductScreen = ({match}) => {
    const [product, setProduct] = useState({})

    useEffect(() => {
        const fetchProduct = async () => {
           const {data} = await axios.get(`/api/products/${match.params.id}`) 
           setProduct(data)
        }

        fetchProduct()      
    }, [match])

    return (
        <>
            <Link className='btn btn-light my-3' to='/'>
                Previous Page
            </Link>
            <Row>

                <Col md={6}>
                    {/* fluid ensures that the image does not overflow its container */}
                    <Image src={product.image} alt={product.name} fluid/>
                </Col>

                <Col md={3}>
                    <ListGroup>
                        <ListGroup.Item className='list-group'>
                            <h5>{product.name}</h5>
                        </ListGroup.Item>

                        <ListGroup.Item className='list-group'>
                            <Rating
                                value={product.rating}
                                text={`${product.numReviews} reviews`}
                            />
                        </ListGroup.Item>

                        <ListGroup.Item className='list-group'>
                            Price: ${product.price}
                        </ListGroup.Item>

                        <ListGroup.Item className='list-group'>
                            Description: ${product.description}
                        </ListGroup.Item>
                  </ListGroup>
                </Col>

                <Col md={3}>
                    <Card>
                        <ListGroup variant='flush'>
                            <ListGroup.Item>
                                <Row>
                                    <Col>
                                        Item Price:
                                    </Col>

                                    <Col>
                                        <strong>{product.price}</strong>
                                    </Col>
                                </Row>
                            </ListGroup.Item>

                            <ListGroup.Item>
                                <Row>
                                    <Col>
                                        Status:
                                    </Col>

                                    <Col>
                                        {product.countInStock > 0 ? 'In Stck' : 'Out Of Stock'}
                                    </Col>
                                </Row>
                            </ListGroup.Item>

                            <ListGroup.Item>
                                <Button 
                                    className='btn-block'
                                    type='button'
                                    variant='primary'
                                    // If item is out of stock then button is disabled
                                    disabled={product.countInStock === 0}
                                >
                                    Add to Cart
                                </Button>
                            </ListGroup.Item>
                        </ListGroup>
                    </Card>
                </Col>
            </Row>
        </>
    )
}

export default ProductScreen
