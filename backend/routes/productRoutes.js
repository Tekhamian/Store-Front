import express from 'express';
const router = express.Router()
import { 
    getProducts, 
    getProductById, 
    deleteProduct, 
    updateProduct,
    createProduct,
    createProductReview,
} from '../controllers/productController.js'
import { protect, admin } from '../middleware/authMiddleware.js';


    // Public access Route for products (in the database)
    router.route('/').get(getProducts).post(protect, admin, createProduct)
    router.route('/:id/reviews').post(protect, createProductReview)
    router
    .route('/:id')
    .get(getProductById)
    .post(createProductReview)
    .put(protect, admin, updateProduct)

export default router