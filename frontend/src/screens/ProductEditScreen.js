import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Form, Button } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import Message from '../components/Message';
import Loader from '../components/Loader';
import FormContainer from '../components/FormContainer';
import { listProductDetails, updateProduct } from '../actions/productActions';
import { PRODUCT_UPDATE_RESET } from '../constants/productConstants';

const ProductEditScreen = ({ match, history }) => {
    const productId = match.params.id;

    const [name, setName] = useState('');
    const [price, setPrice] = useState(0);
    const [image, setImage] = useState('');
    const [brand, setBrand] = useState('');
    const [category, setCategory] = useState('');
    const [amountInStock, setAmountInStock] = useState(0);
    const [description, setDescription] = useState('');
    // Uploading is set to false by default
    const [uploading, setUploading] = useState(false);

    const dispatch = useDispatch();

    const productDetails = useSelector((state) => state.productDetails);
    const { loading, error, product } = productDetails;

    const productUpdate = useSelector((state) => state.productUpdate);
    const {
        loading: loadingUpdate,
        error: errorUpdate,
        success: successUpdate,
    } = productUpdate;

    // If the product already exist then...

    useEffect(() => {

        if (successUpdate) {
            dispatch({ type: PRODUCT_UPDATE_RESET });
            history.push('/admin/productlist');
        } else {

            // checking for the product's info
            if (!product.name || product._id !== productId) {
                dispatch(listProductDetails(productId));

            } else {
                //Save product info into placeholders
                setName(product.name);
                setPrice(product.price);
                setImage(product.image);
                setBrand(product.brand);
                setCategory(product.category);
                setAmountInStock(product.amountInStock);
                setDescription(product.description);
            }
        }
        
    }, [dispatch, history, productId, product, successUpdate]);

    const uploadFileHandler = async (e) => {
        const file = e.target.files[0]
        const formData = new FormData()
        formData.append('image', file)
        setUploading(true)

        try { 
            const config = {
                headers: {
                    'Content-Type': 'multipart/form-data' ,
                },
            }

        const { data } = await axios.post('/api/upload', formData, config)
        setImage(data)
        setUploading(false)
    }  catch (error) {
        console.error(error)
        setUploading(false)
    }
}


    const submitHandler = (e) => {
        e.preventDefault();
        //UPDATING PRODUCT
        dispatch(updateProduct({ 
            _id: productId, 
            name, 
            price, 
            image, 
            brand,
            category,
            description,
            amountInStock
        }));
    };

    return (

        <>
            <Link to='/admin/productList' className='btn btn-light my-3'>
                Go Back
            </Link>

            <FormContainer>
                <h1>Edit Product</h1>
                {loadingUpdate && <Loader />}
                {errorUpdate && <Message variant='danger'>{errorUpdate}</Message>}
                {loading ? (<Loader />) : error ? (<Message variant='danger'>{error}</Message>
                    ) : ( 
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

                            {/* PRICE */}
                            <Form.Group controlId='price'>
                                <Form.Label>Price</Form.Label>
                                <Form.Control
                                    type='number'
                                    placeholder='Enter price'
                                    value={price}
                                    onChange={(e) => setPrice(e.target.value)}
                                ></Form.Control>
                            </Form.Group>

                            {/* IMAGE */}
                            <Form.Group controlId='image'>
                                <Form.Label>Image</Form.Label>
                                <Form.Control
                                    type='image'
                                    placeholder='Enter Image URL'
                                    value={image}
                                    onChange={(e) => setImage(e.target.value)}
                                ></Form.Control>
                                <Form.File 
                                    id='image-file'
                                    label='Choose File' 
                                    custom 
                                    onChange={uploadFileHandler}
                                ></Form.File>
                                {uploading && <loader />}
                            </Form.Group>
                            
                            {/* BRAND */}
                            <Form.Group controlId='brand'>
                                <Form.Label>Brand</Form.Label>
                                <Form.Control
                                    type='text'
                                    placeholder='Enter brand'
                                    value={brand}
                                    onChange={(e) => setBrand(e.target.value)}
                                ></Form.Control>
                            </Form.Group>
                         
                            {/* Amount in Stock */}
                            <Form.Group controlId='amountInStock'>
                                <Form.Label>Amount in Stock</Form.Label>
                                <Form.Control
                                    type='number'
                                    placeholder='Enter Amount in Stock'
                                    value={amountInStock}
                                    onChange={(e) => setAmountInStock(e.target.value)}
                                ></Form.Control>
                            </Form.Group>
        
                            {/* CATEGORY */}
                            <Form.Group controlId='category'>
                                <Form.Label>Category</Form.Label>
                                <Form.Control
                                    type='text'
                                    placeholder='Enter Category'
                                    value={category}
                                    onChange={(e) => setCategory(e.target.value)}
                                ></Form.Control>
                            </Form.Group>
                                
                            {/* DESCRIPTION */}
                            <Form.Group controlId='description'>
                                <Form.Label>Description</Form.Label>
                                <Form.Control
                                    type='text'
                                    placeholder='Enter Description'
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                ></Form.Control>
                            </Form.Group>

                            <Button type='submit' variant='primary'>Update</Button>

                        </Form>
                    
                )}

            </FormContainer>

        </>


    );
};

export default ProductEditScreen;