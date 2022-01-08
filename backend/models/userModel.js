import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'

const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },

    email: {
        type: String,
        required: true,
        unique: true
    },

    password: {
        type: String,
        required: true
    },

    isAdmin: {
        type: Boolean,
        required: true,
        default: false
    }
}, {
    timestamps: true
})

userSchema.methods.matchPassword = async function(enteredPassword) {
    // compares the entered password with the stored/hashed password
    return await bcrypt.compare(enteredPassword, this.password)
}

// Middleware for managing the encryption of the password before saving it
userSchema.pre('save', async function (next){

    // Runs before saving the password - if user has modified or updated the password otherwise - next
    if(!this.isModified('password')) {
        next()
    }

    // *Salts are used to safeguard passwords in storage - salting a pasword makes the hash unpredictable
    const salt = await bcrypt.genSalt(10)
    this.password = await bcrypt.hash(this.password, salt)
})

const User = mongoose.model('User', userSchema)

export default User


