import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom'
import { PayPalButton } from 'react-paypal-button-v2'
import { Row, ListGroup, Image, Card, Col, Button } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import  Message from '../components/Message'
import  Loader from '../components/Loader'
import { getOrderDetails, payOrder, deliverOrder } from '../actions/orderActions'
import { ORDER_PAY_RESET, ORDER_DELIVER_RESET } from '../constants/orderConstants'

const OrderScreen = ({match}) => {
    const orderId = match.params.id

    const [sdkReady, setSdkReady] = useState(false)
    const dispatch = useDispatch()

    const orderDetails = useSelector((state) => state.orderDetails)
    const { order, loading, error } = orderDetails

    const orderPay = useSelector((state) => state.orderPay)
    const { loading: loadingPay, success: successPay } = orderPay
    
    const orderDeliver = useSelector((state) => state.orderDeliver)
    const { loading: loadingDeliver, success: successDeliver } = orderDeliver
    
    const userLogin = useSelector((state) => state.userLogin)
    const { userInfo } = userLogin

    if (!loading) {
        // AddDecimal Function: adds 2 significant spaces
    const addDecimals = (num) => {
        return (Math.round(num * 100) / 100).toFixed(2)
    }

    // Calculate Item price(s)
    order.itemPrice = addDecimals(
        order.orderItems.reduce((acc, item) => acc + item.price * item.qty, 0))
    }
    
    // Dynamically add the paypal script.... 
    //   taken from (https://developer.paypal.com/docs/checkout/reference/customize-sdk/):
    //   <script src="https://www.paypal.com/sdk/js?client-id=YOUR_CLIENT_ID"></script>
    useEffect(() => {

        // if(!userInfo) {
        //     history.push('/login')
        // }

        const addPayPalScript = async () => {
            const { data: clientId } = await axios.get('/api/config/paypal')
            const script = document.createElement('script')  
            script.type = 'text/javascript'
            script.src = `https://www.paypal.com/sdk/js?client-id=${clientId}`
            script.async = true
            script.onload = () => {
                setSdkReady(true)
            }
            document.body.appendChild(script)
        }
        
        if(!order || successPay || successDeliver) {
            dispatch({ type: ORDER_PAY_RESET })// stops (refresh) infinite loop
            dispatch({ type: ORDER_DELIVER_RESET })
            dispatch(getOrderDetails(orderId))
        } else if (!order.isPaid) {
            if(!window.paypal) {
                addPayPalScript()
            } else {
                setSdkReady(true)
            }
        }
    }, [dispatch, orderId, successPay, successDeliver, order])


    const successPaymentHandler = (paymentResult) => {
        console.log(paymentResult)
        dispatch(payOrder(orderId, paymentResult))

    }

    const deliverHandler = () => {
        dispatch(deliverOrder(order))
    }
    
    return loading ? ( <Loader /> ) : error ? ( <Message variant='danger'>{error}</Message>
        ) : (  
            <>
                <h2>Order: {order._id}</h2>
                <Row>
                        <Col md={8}>
                            <ListGroup variant='flush'>
                                <ListGroup.Item>
                                    <h2>Shipping Info</h2>

                                    <p><strong>User: </strong>{order.user.name}</p>
                                    <p><strong>Email: </strong><a href={`mailto:${order.user.email}`}>{order.user.email}</a></p>

                                    <p>
                                        <strong>Address: </strong>
                                        {order.shippingAddress.address}, {order.shippingAddress.city}{' '}
                                        {order.shippingAddress.zipCode}, {' '}
                                        {order.shippingAddress.country}
                                    </p>
                                    {/* Check if order has been delivered */}
                                    {order.isDelivered ? (
                                    <Message variant='success'>Delivered On {order.deliveredAt}</Message>
                                    ) : (
                                    <Message variant='warning'>Item Has Not Been Delivered</Message>
                                    )}

                                </ListGroup.Item>

                                <ListGroup.Item>
                                    <h2>Payment Method</h2>
                                    <p>
                                        <strong>Method: </strong>
                                        {order.paymentMethod}
                                    </p>
                                    {/* Check if order is paid for */}
                                    {order.isPaid ? (
                                    <Message variant='success'>Paid on {order.paidAt}</Message>
                                    ) : (
                                    <Message variant='warning'>Item Not Yet Paid For</Message>
                                    )}
                                        
                                </ListGroup.Item>

                                <ListGroup.Item>
                                    <h2>Items Ordered </h2>
                                        {/* <strong>Items: </strong> */}
                                        {order.orderItems.length === 0 ? (<Message>Sorry this order is empty</Message>
                                        ) : (
                                            <ListGroup variant='flush'>
                                                {order.orderItems.map((item, index) => (
                                                    <ListGroup.Item key={index}>
                                                        <Row>
                                                            {/* Column1 */}
                                                            <Col md={1}>
                                                                <Image src={item.image} alt={item.name} fluid rounded />
                                                            </Col>

                                                            <Col>
                                                                <Link to={`/product/${item.product}`}>
                                                                    {item.name}
                                                                </Link>
                                                            </Col>
                                                            
                                                            <Col md={4}>
                                                                {item.qty} x ${item.price} = ${item.qty * item.price}
                                                            </Col>

                                                        </Row>
                                                    </ListGroup.Item>
                                                ))}
                                            </ListGroup>
                                        )}
                                </ListGroup.Item>
                            </ListGroup>
                        </Col>

                        {/* Column2 */}
                        <Col md={4}>
                            <Card>
                                <ListGroup variant='flush'>
                                    <ListGroup.Item>
                                        <h2>Order Summary</h2>
                                    </ListGroup.Item>

                                    <ListGroup.Item>
                                        <Row>
                                            <Col>Items</Col>
                                            <Col>${order.itemsPrice}</Col>
                                        </Row>
                                    </ListGroup.Item>
                                    
                                    <ListGroup.Item>
                                        <Row>
                                            <Col>Shipping</Col>
                                            <Col>${order.shippingPrice}</Col>
                                        </Row>
                                    </ListGroup.Item>

                                    <ListGroup.Item>
                                        <Row>
                                            <Col>Tax</Col>
                                            <Col>${order.taxPrice}</Col>
                                        </Row>
                                    </ListGroup.Item>

                                    <ListGroup.Item>
                                        <Row>
                                            <Col>Total</Col>
                                            <Col>${order.totalPrice}</Col>
                                        </Row>
                                    </ListGroup.Item>

                                    {/* PayPal Button... */}
                                    {!order.isPaid && (
                                    <ListGroup.Item>
                                        {loadingPay && <Loader />}
                                        {sdkReady ? (<Loader /> 
                                        ) : (
                                        <PayPalButton
                                            amount={order.totalPrice}
                                            onSuccess={successPaymentHandler}
                                        />
                                        )}
                                    </ListGroup.Item>
                                    )} 
                                    
                                    {loadingDeliver && <Loader />}
                                    {userInfo && userInfo.isAdmin && order.isPaid && !order.isDelivered && (
                                    <ListGroup.Item>
                                        <Button
                                            type='button'
                                            className='btn btn-block'
                                            onClick={deliverHandler}
                                        >
                                            MARK AS DELIVERED
                                        </Button>
                                    </ListGroup.Item>
                                    )}     
                               </ListGroup>
                            </Card>
                        </Col>
                    </Row>
            
            </> 
        )
}

export default OrderScreen
