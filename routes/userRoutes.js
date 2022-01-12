const router = require('express').Router();

/**
 * @route GET api/v1/users/
 * @desc Get all users
 * @accsess PUBLIC
 */
router.get("/");

/**
 * @route GET api/v1/:userId
 * @desc Get user info by userId
 * @access PUBLIC
 */
router.get("/:userId");


module.exports = router;

