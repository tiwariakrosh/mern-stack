const User = require('../models/User')
const Note = require('../models/Note')
const asyncHandler = require('express-async-handler')
const bcrypt = require('bcrypt')
const mongoose = require('mongoose')


// @desc Get all users
// @route Get /users
// @access Private
const getAllUsers = asyncHandler(async (req, res) => {
    const users = await User.find().select('-password').lean()
    if (!users?.length) {
        return res.status(400).json({ message: 'No users found' })
    }
    res.json(users)
})

// @desc Create new user
// @route POST /users
// @access Private
const createNewUser = asyncHandler(async (req, res) => {
    const { username, password, roles } = req.body

    // Confirma data
    if (!username || !password || !Array.isArray(roles) || !roles.length) {
        return res.status(400).json({ message: 'All fields are required' })
    }

    // Check for duplicate
    const duplicate = await User.findOne({ username }).lean().exec()
    if (duplicate) {
        return res.status(409).json({ message: 'Duplicate username' })
    }

    // Hash password
    const hashedPwd = await bcrypt.hash(password, 10) //salt round
    const userObject = { username, 'password': hashedPwd, roles }

    // create and store new user
    const user = await User.create(userObject)

    if (user) {
        res.status(201).json({ message: `New user ${username} created` })
    } else {
        res.status(400).json({ message: 'Invalid data user' })
    }
})


// @desc Update user
// @route UPDATE /users
// @access Private
const updateUser = asyncHandler(async (req, res) => {
    const { id, username, roles, active, password } = req.body
    console.log(req.body)

    // Confirm data 
    if (!id || !username || !Array.isArray(roles) || !roles.length || typeof active !== 'boolean') {
        return res.status(400).json({ message: 'All fields are required' })

    }

    const user = await User.findById(id).exec()

    if (!user) {
        return res.status(400).json({ message: 'User not found' })
    }

    // check for duplicate
    const duplicate = await User.findOne({ username }).lean().exec()

    // Allow updated to the original user
    if (duplicate && duplicate?._id.toString() !== id) {
        return res.status(409).json({ message: ' Duplicate username' })
    }

    user.username = username
    user.roles = roles
    user.active = active

    if (password) {
        user.password = await bcrypt.hash(password, 10) //salt rounds
    }

    const updatedUser = await user.save()

    res.json({ message: `${updatedUser.username} updated` })

})

// @desc get Single user
// @route GET /users:id
// @access Private
const getSingleUser = asyncHandler(async (req, res) => {
    const { id } = req.params

    if (!id) {
        return res.status(400).json({ message: 'User ID Required' })
    }

    const user = await User.findById(id).select('-password').lean()
    if (!user) {
        return res.status(400).json({ message: 'User not found' })
    }

    res.json(user)
})

// @desc Delete user
// @route DELETE /users
// @access Private
const deleteUser = asyncHandler(async (req, res) => {
    const { id } = req.body

    if (!id) {
        return res.status(400).json({ message: 'User ID Required' })
    }

    const note = await Note.findOne({ user: id }).lean().exec()
    if (note) {
        return res.status(400).json({ message: 'User has assigned notes' })
    }

    const user = await User.findById(id).exec()

    if (!user) {
        return res.status(400).json({ message: 'User not found' })
    }

    const username = user.username
    const userId = user._id
    const result = await user.deleteOne()

    const reply = `Username ${username} with ID ${userId} deleted`

    res.json(reply)
})


module.exports = { getAllUsers, createNewUser, updateUser, deleteUser, getSingleUser }
