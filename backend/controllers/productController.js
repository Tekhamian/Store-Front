import asyncHandler from 'express-async-handler'
import Product from '../models/productModel.js'

    // @desc    Fetch all products
    // @route   GET /api/products
    // @access  Public
const getProducts = asyncHandler(async (req, res) => {
        const products = await Product.find({})
        res.json(products)
})

    // @desc    Fetch single product
    // @route   GET /api/products/:id
    // @access  Public
const getProductById = asyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id)

    if(product) {
        res.json(product)
        } else {
            // Set Status
            res.status(404)
            //error for wrong product id #
            throw new Error('SORRY PRODUCT NOT FOUND')                    
        }
})

    // @desc    Delete a product
    // @route   DELETE /api/products/:id
    // @access  Private/Admin
const deleteProduct = asyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id)

    if(product) {
        await product.remove()
        res.json({message: 'PRODUCT HAS BEEN REMOVED'})
        } else {
            // Set Status
            res.status(404)
            //error for wrong product id #
            throw new Error('SORRY PRODUCT NOT FOUND')                    
        }
})

    // @desc    CREATE a product
    // @route   POST /api/products
    // @access  Private/Admin
    const createProduct = asyncHandler(async (req, res) => {
        const product = new Product({
            name: 'Sample Name',
            price: 0,
            user: req.user._id,
            image: '/images/sample.jpg',
            brand: 'Sample Brand',
            category: 'Sample Category',
            amountInStock: 0,
            numReviews: 0,
            description: 'Sample Description'
        })
        
        const createdProduct = await product.save()
        res.status(201).json(createdProduct)
    })

    // @desc    UPDATE a product
    // @route   PUT /api/products
    // @access  Private/Admin
    const updateProduct = asyncHandler(async (req, res) => {
        const { 
            name, 
            price, 
            image, 
            brand,
            category, 
            amountInStock, 
            description,
        } = req.body
        
        const product = await Product.findById(req.params.id)
        if(product) {
            product.name = name
            product.price = price
            product.image = image
            product.brand = brand
            product.category = category
            product.amountInStock = amountInStock
            product.description = description

            const updatedProduct = await product.save()
            res.json(updatedProduct)

        } else {
            res.status(404)
            throw new Error('PRODUCT DOES NOT EXIST')
        }
        
    })

// @desc    Create new review
// @route   POST /api/products/:id/reviews
// @access  Private
const createProductReview = asyncHandler(async (req, res) => {
    const { 
        rating,
        comment,
    } = req.body
    
    const product = await Product.findById(req.params.id)
    if(product) {
        //If there is an existing product review(r) then:
        const alreadyReviewed = product.reviews.find(r => r.user.toString() === req.user.toString())
        // Message to user that the product has been reviewed already
        if(alreadyReviewed) {
            res.status(400)
            throw new Error('SORRY THIS PRODUCT HAS ALREADY BEEN REVIEWED')
        }
        // If there are no previous reviews then create a new review-object:
        const review = {
            // Name/rating/comment/user associated with the new review object
            name: req.user.name,
            rating: Number(rating),
            comment,
            user: req.user._id,
        }

        // Add new review to array of existing reviews 
        product.reviews.push(review) 

        // Udate the number of reviews 
        product.numReviews = product.reviews.length

        // Udate the average number of reviews 
        product.rating = product.reviews.reduce((acc, item) => item.rating + acc, 0) / product.reviews.length

        await product.save()
        res.status(201).json({ message: 'REVIEW HAS BEEN ADDED... THANK YOU!'})

    } else {
        res.status(404)
        throw new Error('PRODUCT DOES NOT EXIST')
    }
    
})

export {
    getProducts, 
    getProductById, 
    deleteProduct, 
    createProduct, 
    updateProduct,
    createProductReview
}