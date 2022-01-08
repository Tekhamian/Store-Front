import React, {useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux'
import {Row, Col} from 'react-bootstrap';
import Product from '../components/Product';
import Message from '../components/Message';
import Loader from '../components/Loader';
import {listProducts} from '../actions/productActions'

// ************* Product list & summation data ********************** 
const HomeScreen = () => {
    const dispatch = useDispatch()

    const productList = useSelector (state => state.productList)
    const { loading, error, products} = productList

    // ***Notes: UseEffect - makes request to backend for products
    // when utilyzing useffect hook...
    // it runs as soon as it is requested 
    useEffect(() => {
        dispatch(listProducts())
      
        // all dependencies will be defined in the [] array below   
    }, [dispatch])

    return (
        <>
             {/* ************* Product List's Structual Template with Responsive guidelines **********************  */}
           <h1>Store-Front Products</h1> 
           { loading ? (
           <Loader /> 
           ) : error ? (
           <Message variant='danger'>{error}</Message> 
           ) : (

           <Row>
              {/* (.map) creates a list */}
              {products.map((product) =>(
                      <Col key={product._id} sm={12} md={6} lg={4} xl={3}>
                          <Product product = {product} />
                      </Col>
              ))}
          </Row>
           )}
        </>
    )
}

export default HomeScreen
