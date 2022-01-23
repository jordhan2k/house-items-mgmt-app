const { check } = require("express-validator");
const moment = require("moment");


const itemValidatorChain = [
    check("name")
        .notEmpty()
        .withMessage("Must not be empty"),
    check("itemFunction")
        .notEmpty()
        .withMessage("Must not be empty"),
    check("location")
        .notEmpty()
        .withMessage("Must not be empty"),
    check("expireDate")
        .isISO8601()
        .toDate()
        .withMessage("Should be a valid date"),
    check("purchaseDate")
        .isISO8601()
        .toDate()
        .withMessage("Should be a valid date"),
    check("house")
        .isMongoId()
        .withMessage("Should be a valid id"),
]

module.exports = itemValidatorChain;