import asyncHandler from 'express-async-handler';
import generateToken from '../utils/generateToken.js';
import User from '../models/userModel.js';

// @desc    Auth the user & get Token
// @route   POST/api/users/login
// @access  Public
const authUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    // first we will check the email to see if it exist...
    const user = await User.findOne({ email });

    // Then we check the password to see if it matches the user...
    if (user && (await user.matchPassword(password))) {
        //If the password matches then we send the info below
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin,
            token: generateToken(user._id),
        });
    } else {
        res.status(401);
        throw new Error('INVALID EMAIL OR PASSWORD PLEASE CHECK YOUR INFO');
    }
});

// @desc    Register A New User
// @route   POS /api/users
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
    const { name, email, password } = req.body;

    // first we will check the user (email) to see if it exist...
    const userExists = await User.findOne({ email });

    // if the user do exist...
    if (userExists) {
        //Then we will send this 400 error
        res.status(400);
        throw new Error('THIS USER ALREADY EXISTS (PLEASE CHECK USERNAME OR EMAIL)');
    }

    const user = await User.create({
        name,
        email,
        password,

    });

    // User Info Authenticator
    if (user) {
        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin,
            token: generateToken(user._id),
        });
    } else {
        //if the info is not a match, Then just send a 400 error
        res.status(400);
        throw new Error('INVALID USER DATA - PLEASE CHECK YOUR INFO');
    }
});


// @desc    Get user's profile
// @route   GET /api/users/profile
// @access  Private
const getUserProfile = asyncHandler(async (req, res) => {

    const user = await User.findById(req.user._id);

    if (user) {
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin,
            // token: null
        });
    } else {
        res.status(404);
        throw new Error('SORRY THE INFORMATION YOU HAVE PROVDED IS NOT ASSOSIATED WITH ANY OF OUR ACCOUNTS');
    }
});

// @desc    Update user's profile
// @route   PUT /api/users/profile
// @access  Private
const updateUserProfile = asyncHandler(async (req, res) => {

    const user = await User.findById(req.user._id);

    if (user) {
        user.name = req.body.name || user.name;
        user.email = req.body.email || user.email;
        if (req.body.password) {
            user.password = req.body.password;
        }

        const updatedUser = await user.save();

        res.json({
            _id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
            isAdmin: updatedUser.isAdmin,
            token: generateToken(updatedUser._id),
        });

    } else {
        res.status(404);
        throw new Error('SORRY, THE INFORMATION YOU HAVE PROVDED IS NOT ASSOSIATED TO ANY ACCOUNTS FOUND');
    }
});

// @desc    Get all users
// @route   GET /api/users
// @access  Private/Admin
const getUsers = asyncHandler(async (req, res) => {

    const users = await User.find({});
    res.json(users);

});

// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Private/Admin
const deleteUser = asyncHandler(async (req, res) => {

    const user = await User.findById(req.params.id);

    if (user) {
        await user.remove();
        res.json({ message: 'USER HAS BEEN REMOVED' });
    } else {
        res.status(404);
        throw new Error('USER DOES NOT EXIST');
    }

});

// @desc    Get user by ID
// @route   GET /api/users/:id
// @access  Private/Admin
const getUserById = asyncHandler(async (req, res) => {

    const user = await User.findById(req.params.id).select('-password');
    if (user) {
        res.json(user);
    } else {
        res.status(404);
        throw new Error('USER DOES NOT EXIST');
    }


});

// @desc    Update user 
// @route   PUT /api/users/:id
// @access  Private/Admin
const updateUser = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);

    if (user) {
        user.name = req.body.name || user.name;
        user.email = req.body.email || user.email;
        user.isAdmin = req.body.isAdmin;


        const updatedUser = await user.save();

        res.json({
            _id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
            isAdmin: updatedUser.isAdmin,
        });

    } else {
        res.status(404);
        throw new Error('SORRY, THE INFORMATION YOU HAVE PROVDED IS NOT ASSOSIATED TO ANY ACCOUNTS FOUND');
    }
});


export {
    authUser,
    registerUser,
    getUserProfile,
    updateUserProfile,
    getUsers,
    deleteUser,
    getUserById,
    updateUser
};