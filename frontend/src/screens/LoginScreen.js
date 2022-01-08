import React, {useState, useEffect} from 'react'
import { Link } from 'react-router-dom'
import { Form, Button, Row, Col } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import Message from '../components/Message'
import  Loader from '../components/Loader'
import  FormContainer from '../components/FormContainer'
import { login } from '../actions/userActions'

const LoginScreen = ({ location, history }) => {

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const dispatch = useDispatch()

    const userLogin = useSelector (state => state.userLogin)
    const { loading, error, userInfo } = userLogin

    const redirect = location.search ? location.search.split('=')[1] : '/'

    // If the user's already logged in then...
    useEffect(() => {
        // checking for the user's info
        if(userInfo) {
            history.push(redirect)
        }
    }, [history, userInfo, redirect])

    const submitHandler = (e) => {
        e.preventDefault()

        // DISPATCH LOGIN ACTION
        dispatch(login(email, password))
    }

    return (
        <FormContainer>
                <h1>Sign In</h1>

                {/* CHECK FOR ERROR... IF THERE IS ONE THEN.... */}
                {error && <Message variant='danger'>{error}</Message>}
                {/* CHECK FOR LOADING... IF THERE IS ONE THEN.... */}
                {loading && <Loader />}

                <Form onSubmit={submitHandler}>

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

                    <Button type='submit' variant='primary'>Sign In</Button>

                </Form>

                <Row className='py-3'>
                    <Col>
                        New Customer... ?{' '}
                        <Link to={ redirect ? `/register?redirect=${redirect}` : '/register'}>
                            Register Here!
                        </Link>
                    </Col>
                </Row>

        </FormContainer>
    )
}

export default LoginScreen



