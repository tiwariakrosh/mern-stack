const express = require('express')
const router = express.Router()
const userControllers = require('../controllers/usersController')

router.route('/')
    .get(userControllers.getAllUsers)
    .post(userControllers.createNewUser)
    .patch(userControllers.updateUser)
    .get(userControllers.getSingleUser)
    .delete(userControllers.deleteUser)

module.exports = router