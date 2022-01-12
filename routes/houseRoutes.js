const { getHouseById, createHouse, updateHouse, deleteHouse } = require('../controllers/houseController');
const { verifyToken } = require('../middlewares/authMiddleware');
const { upload } = require('../middlewares/fileUpload');
const router = require('express').Router();

/**
 * @route GET api/v1/houses/:id
 * @desc Get house info by id
 * @access PUBLIC
 */
router.get("/:id", getHouseById);

/**
 * @route POST api/v1/houses/
 * @desc Create a new house
 * @access PRIVATE
 */
router.post("/",
    verifyToken,
    upload.single("image"),
    createHouse);

/**
 * @route PUT api/v1/houses/:id
 * @desc Update an existing house
 * @access PRIVATE
 */
router.put("/:id",
    verifyToken,
    upload.single("image"),
    updateHouse);

/**
 * @route PUT api/v1/houses/:id/delete
 * @desc Mark an existing house as deleted
 * @access PRIVATE
 */
router.put("/:id/delete", verifyToken, deleteHouse);

module.exports = router;