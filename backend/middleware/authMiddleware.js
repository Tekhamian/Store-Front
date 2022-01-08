import jwt from 'jsonwebtoken'
import asyncHandler from 'express-async-handler'
import User from '../models/userModel.js'

const protect = asyncHandler (async (req, res, next) => {
    let token 

    // console.log(req.headers.authorization)
    if(
        req.headers.authorization && 
        req.headers.authorization.startsWith('Bearer')
    ) {
        try {
            token = req.headers.authorization.split(' ')[1]
            const decoded =jwt.verify(token, process.env.JWT_SECRET)
            
            // Returns all the user info except the password
            req.user = await User.findById(decoded.id).select('-password')

        next()

        } catch (error) {
            
            console.error(error)
            res.status(401)
            // if the token is bad then this error will be thrown
            throw new Error('NOT AUTHORIZED, TOKEN FAILURE!!!')
        }
    }

    if (!token){
        res.status(404)
        // If there is no token this error will be thrown
        throw new Error('NOT AUTHORIZED, NO TOKEN FOUND!!!')
    }

  
})

const admin = (req, res, next) => {
    if(req.user && req.user.isAdmin) {
        next()
    } else {
        res.status(401)
        // If user is not admin then this error will be thrown
        throw new Error('USER NOT AUTHORIZED, MUST BE ADMIN USER!!!')
    }
}

export {protect, admin}