import path from 'path'
import express from 'express'
import dotenv from 'dotenv'
import morgan from 'morgan'
import { notFound, errorHandler} from './middleware/errorMiddleWare.js'
import connectDB from './config/db.js'

import productRoutes from './routes/productRoutes.js'
import userRoutes from './routes/userRoutes.js'
import orderRoutes from './routes/orderRoutes.js'
import uploadRoutes from './routes/uploadRoutes.js'

dotenv.config()

// when the backend is ran this should connect to the database
connectDB()

// inititializing express
const app = express()

// This is an (HTTP) request logger middleware - to see (in bckend) when someone hits a route 
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'))
}

// body parser for the req.body (email & password) in the usercontroller.js file
app.use(express.json()) // allows us to accept JSON format

// Route for a (api is running) response message
app.get('/', (req, res) => {
    res.send('API is running....')
}) 

app.use('/api/products', productRoutes)
app.use('/api/users', userRoutes)
app.use('/api/orders', orderRoutes)
app.use('/api/upload', uploadRoutes)

// fetch client ID to make PAYPAL payments
app.get('api/config/paypal', (req, res) => res.send(process.env.PAYPAL_CLIENT_ID))

// *Note: (double underscore pathname) = __dirname refers to the current folder
// *Also: create a variable called __dirname with path.resolve & this will mimic Common-js when using ES-modules 
const __dirname = path.resolve()

//Static folder (to be loaded in the browser)
app.use('/uploads', express.static(path.join(__dirname, '/uploads')))

// Route not found (404 Error) Middleware - *Note: shows up when user enters wrong route
app.use(notFound)


// Error Middleware - *Note: shows up only in development mode only, not production
app.use(errorHandler)

const PORT = process.env.PORT || 5000

app.listen(
    PORT,
    console.log(`Server Is Running In ${process.env.NODE_ENV} mode on port # ${PORT}`.yellow))

