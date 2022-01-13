const { getAllUsers, getUserById, getUserHouses } = require('../controllers/userController');

const router = require('express').Router();

/**
 * @route GET api/v1/users/
 * @desc Get all users
 * @accsess PUBLIC
 */
router.get("/", getAllUsers);

/**
 * @route GET api/v1/:userId
 * @desc Get user info by userId
 * @access PUBLIC
 */
router.get("/:userId",  getUserById);


/**
 * @route GET api/v1/:userId/houses
 * @desc Get all houses of a users
 * @access PUBLIC
 */
router.get("/:userId/houses", getUserHouses);


module.exports = router;

