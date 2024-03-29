import React, {useState, useEffect} from 'react'
import { Link } from 'react-router-dom'
import { Form, Button, Row, Col } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import Message from '../components/Message'
import  Loader from '../components/Loader'
import  FormContainer from '../components/FormContainer'
import { register } from '../actions/userActions'

const RegisterScreen = ({ location, history }) => {

    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [message, setMessage] = useState(null)

    const dispatch = useDispatch()

    const userRegister = useSelector ((state) => state.userRegister)
    const { loading, error, userInfo } = userRegister

    const redirect = location.search ? location.search.split('=')[1] : '/'

    // If the user already exist then...
    useEffect(() => {
        // checking for the user's info
        if(userInfo) {
            history.push(redirect)
        }
    }, [history, userInfo, redirect])

    const submitHandler = (e) => {
        e.preventDefault()

        // DISPATCH REGISTER ACTION
        if(password !== confirmPassword) {
            setMessage('Passwords Do Not Match... ')
        } else {
            dispatch(register(name, email, password)) 
        }       
    }

    return (
        <FormContainer>
                <h1>Sign Up</h1>

                {/* CHECK FOR ERROR... IF THERE IS ONE THEN.... */}
                {message && <Message variant='danger'>{message}</Message>}
                {error && <Message variant='danger'>{error}</Message>}
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

                    <Button type='submit' variant='primary'>Register</Button>

                </Form>

                <Row className='py-3'>
                    <Col>
                        Have an Account... ?{' '}
                        <Link to={ redirect ? `/login?redirect=${redirect}` : '/login'}>
                            Login Here!
                        </Link>
                    </Col>
                </Row>

        </FormContainer>
    )
}

export default RegisterScreen



