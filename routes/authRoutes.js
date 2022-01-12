
const { checkAuthStatus, login, register } = require('../controllers/authController');
const { verifyToken } = require('../middlewares/authMiddleware');
const { authValidatorChain } = require('../validators/authValidators');
const router = require('express').Router();

/**
 * @route GET api/v1/auth
 * @desc Verify access token and return user info
 * @access PUBLIC
 */
router.get("/", verifyToken ,checkAuthStatus);

/**
 * @route POST api/v1/auth/login
 * @desc Login a user
 * @access PUBLIC
 */
router.post("/login", authValidatorChain, login);

/**
 * @route POST api/v1/auth/register
 * @desc Register a new user
 * @access PUBLIC 
 */
router.post("/register", authValidatorChain, register);

module.exports = router;