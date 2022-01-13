const { searchUsersHandler, searchHousesHandler, searchItemsHandler } = require('../controllers/searchController');

const router = require('express').Router();

router.get("/users", searchUsersHandler);

router.get("/houses", searchHousesHandler);

router.get("/items", searchItemsHandler);

module.exports = router;