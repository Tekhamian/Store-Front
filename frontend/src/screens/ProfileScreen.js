import React, {useState, useEffect} from 'react'
import { Form, Button, Row, Col, Table } from 'react-bootstrap'
import { LinkContainer } from 'react-router-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import Message from '../components/Message'
import  Loader from '../components/Loader'
import { getUserDetails, updateUserProfile } from '../actions/userActions'
import {listMyOrders} from '../actions/orderActions'

const ProfileScreen = ({ location, history }) => {

    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [message, setMessage] = useState(null)

    const dispatch = useDispatch()

    const userDetails = useSelector ((state) => state.userDetails)
    const { loading, error, user } = userDetails
    
    const userLogin = useSelector ((state) => state.userLogin)
    const { userInfo } = userLogin

    const userUpdateProfile = useSelector ((state) => state.userUpdateProfile)
    const { success } = userUpdateProfile

    const orderListMy = useSelector ((state) => state.orderListMy)
    const { loading:loadingOrders, error:errorOrders, orders } = orderListMy

    // If the user already exist then...
    useEffect(() => {
        // checking for the user's info
        if(!userInfo) {
            history.push('/login')
        } else {
            if(!user.name) {
                dispatch(getUserDetails('profile'))
                dispatch(listMyOrders())
            } else {
                setName(user.name)
                setEmail(user.email)
            }
        }
    }, [dispatch, history, userInfo, user])

    const submitHandler = (e) => {
        e.preventDefault()

        // DISPATCH REGISTER ACTION
        if(password !== confirmPassword) {
            setMessage('Passwords Do Not Match... ')
        } else {
            dispatch(updateUserProfile({ id: user._id, name, email, password })) 
        }       
    }

    return (
        <Row>
            <Col md={3}>
                <h2>Profile</h2>
                {/* CHECK FOR ERROR... IF THERE IS ONE THEN.... */}
                {message && <Message variant='danger'>{message}</Message>}
                {error && <Message variant='danger'>{error}</Message>}
                {success && <Message variant='success'>PROFILE UPDATED... THANK YOU!</Message>}
                {/* CHECK FOR LOADING... IF THERE IS ONE THEN.... */}
                {loading && <Loader />}

                <Form onSubmit={submitHandler}>

                    {/* NAME */}
                    <Form.Group controlId='name'>
                        <Form.Label>Name</Form.Label>
                        <Form.Control 
                        type='name' 
                        placeholder='Enter Name'
                        value={name}
                        onChange={(e) => setName(e.target.value)}                    
                        ></Form.Control>
                    </Form.Group>

                    {/* EMAIL */}
                    <Form.Group controlId='email'>
                        <Form.Label>Email</Form.Label>
                        <Form.Control 
                        type='email' 
                        placeholder='Enter Email'
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}                    
                        ></Form.Control>
                    </Form.Group>

                    {/* PASSWORD */}
                    <Form.Group controlId='password'>
                        <Form.Label>Password</Form.Label>
                        <Form.Control 
                        type='password' 
                        placeholder='Enter Password'
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}                    
                        ></Form.Control>
                    </Form.Group>

                    {/* CONFIRM PASSWORD */}
                    <Form.Group controlId='confirmPassword'>
                        <Form.Label>Confirm Password</Form.Label>
                        <Form.Control 
                        type='Password' 
                        placeholder='Confirm Password'
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}                    
                        ></Form.Control>
                    </Form.Group>

                    <Button type='submit' variant="outline-primary">Update</Button>

                </Form>
            </Col>
            <Col md={9}>
                <h2>Order(s)</h2>
                {loadingOrders ? <Loader /> : errorOrders ? 
                <Message variant='danger'>{errorOrders}</Message> : (
                    <Table striped bordered hover responsive className='table-sm'>
                        <thead>
                            <tr>
                                <th>ORDER ID</th>
                                <th>DATE ORDERED</th>
                                <th>TOTAL</th>
                                <th>DATE PAID</th>
                                <th>DELIVERED</th>
                                <th>DETAILS</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders.map(order=>(
                                <tr key={order._id}>
                                    <td>{order._id}</td>
                                    <td>{order.createdAt.substring(0, 10)}</td>
                                    <td>{order.totalPrice}</td>
                                    
                                    <td>{order.isPaid ? order.paidAt.substring(0, 10) : (
                                        <i className='fas fa-times' style={{ color: 'red' }}></i>
                                        )}
                                    </td>
                                        {/* ***Need to fix the - order.deliveredAt.substring(0, 10) - line below so it can show the time in the profile */}
                                    <td>{order.isDelivered ? order.deliveredAt.substring(0, 10) : (
                                        <i className='fas fa-times' style={{ color: 'red' }}></i>
                                        )}
                                    </td>

                                    <td><LinkContainer to={`/order/${order._id}`}>
                                            <Button variant="outline-dark">View Details</Button>
                                        </LinkContainer></td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                )}
            </Col>

        </Row>
    )
}

export default ProfileScreen