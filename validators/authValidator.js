const { check } = require("express-validator");

const authValidatorChain = [
    check("username")
        .isLength({ min: 6 })
        .withMessage("Username must be at least 6 chars long."),
    check("password")
        .isLength({ min: 8, max: 15 })
        .withMessage("Password must be from 8 to 15 chars long.")
        .isStrongPassword({
            minLowercase: 1,
            minUppercase: 1,
            minSymbols: 1
        })
        .withMessage("Must contains at least a digit, an uppercase, a lowercase, and a special character")
];

module.exports = { authValidatorChain };