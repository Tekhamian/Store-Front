import React, {useState, useEffect} from 'react'
import {Link} from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import {Row, Col, Image, ListGroup, Card, Button, Form} from 'react-bootstrap'
import Rating from '../components/Rating'
import Message from '../components/Message'
import Loader from '../components/Loader'
import { listProductDetails, createProductReview } from '../actions/productActions'
import { PRODUCT_CREATE_REVIEW_RESET } from '../constants/productConstants'

// ************* Metadata for a Single Product ********************** 
const ProductScreen = ({history, match}) => {
    const [qty, setQty] = useState(1)
    const [rating, setRating] = useState(0)
    const [comment, setComment] = useState('')

    const dispatch = useDispatch()

    const productDetails = useSelector((state) => state.productDetails)
    const { loading, error, product } = productDetails

    const userLogin = useSelector(state => (state).userLogin)
    const { userInfo } = userLogin

    const productCreateReview = useSelector((state) => state.productCreateReview)
    const { success: successProductReview, error: errorProductReview } = productCreateReview

    // const productReviewCreate =useSelector((state) => state.productReviewCreate)
    // const { success: successProductReview, error: errorProductReview} = productReviewCreate

    useEffect(() => {
        dispatch(listProductDetails(match.params.id))
    }, [dispatch, match])

    const addToCartHandler = () => {
        history.push(`/cart/${match.params.id}?qty=${qty}`)
    }

    return (
        <>
            {/* Simple Go-Back Button that can be used when on the the product's page */}
            <Link className='btn btn-outline-primary my-3' to='/'>
                Go to Previous Page
            </Link>
    {loading ? <Loader /> : error ? <Message variant='danger'>{error}</Message> : (
        <>
        <Row>
        {/* ************* Column for Item's Image **********************  */}
        <Col md={6}>
            {/* fluid ensures that the image does not overflow its container */}
            <Image src={product.image} alt={product.name} fluid/>
        </Col>

        {/* ************* Column for Item's Info block... (Name/ Rating/ price/ description)  **********************  */}
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

        {/* ************* Column for Item details of price & status (in/out of stock) **********************  */}
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
                                {product.countInStock > 0 ? 'In Stock' : 'Out Of Stock'}
                            </Col>
                        </Row>
                    </ListGroup.Item>

                    {/* This block of code (quantity scroll) only runs if the item is in stock */}
                    {product.countInStock > 0 && (
                        <ListGroup.Item>
                        <Row>
                            <Col>
                                Qty:
                            </Col>

                            <Col>
                                <Form.Control as='select' value={qty} onChange={(e) => setQty(e.target.value)}
                                >
                                    {/* spread operator & array constructor */}
                                    {[...Array(product.countInStock).keys()].map(x => (
                                        <option key={x + 1} value={x + 1}>
                                            {x + 1}
                                        </option>
                                    ))}
                                </Form.Control>
                            </Col>
                        </Row>
                    </ListGroup.Item>
                    )}

                    <ListGroup.Item>
                        <Button 
                            onClick={addToCartHandler}
                            className='btn-block'
                            type='button'
                            variant='primary'
                            // ***Note: if item is out of stock then button is disabled
                            disabled={product.countInStock === 0}
                            
                        >
                            Add to Cart
                        </Button>
                    </ListGroup.Item>
                </ListGroup>
            </Card>
        </Col>
    </Row>
    <Row>
        <Col md={6}>
            <h2>Reviews</h2>
            <h6>
            {product.reviews.length === 0 && <Message>No Reviews Has Been Given To This Product Yet... Be The Very First To Review It</Message>}
            </h6>
            <ListGroup variant='flush'>
                {product.reviews.map((review) => (
                    <ListGroup.Item key={review._id}> 
                        <strong>{review.name}</strong>
                        <Rating value={review.rating} />
                        <p>{review.createdAt.substring(0,10)}</p>
                        <p>{review.comment}</p>
                    </ListGroup.Item>
                ))}
                <ListGroup.Item>
                    <h6><p class="text-primary">Write A Customer Review Here</p></h6>
                    {userInfo ? (
                    <h1></h1>
                        ) : (
                        <Message>
                            Please <Link to='/login'>Sign In</Link>To Write A Review
                            {' '}
                        </Message>
                        )} 

                </ListGroup.Item>
            </ListGroup>
        </Col>
    </Row>
    </>
    )} 
    </>
    )
}

export default ProductScreen
