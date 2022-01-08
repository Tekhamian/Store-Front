import mongoose from 'mongoose'

// Database connection
const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI, {
            // these few options below are set to true or else there will be warnings/errors
            useUnifiedTopology: true,
            useNewUrlParser: true,
            useCreateIndex: true
        });
        // status messages that will show-up in the console 
        console.log(`MongoDB Connected: ${conn.connection.host}`.blue.bold);
    } catch (error) {
        console.error(`Error: ${error.message}`.red.bold);
        process.exit(1)
    }
}

export default connectDB
