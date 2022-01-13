const { getItemById, createItem, updateItem, deleteItem } = require('../controllers/itemController');
const { verifyToken } = require('../middlewares/authMiddleware');
const { upload } = require('../middlewares/fileUpload');
const itemValidatorChain = require('../validators/itemValidator');

const router = require('express').Router();

/**
 * @route GET api/v1/items/:id
 * @desc Get item by id
 * @access PUBLIC
 */
router.get("/:id", getItemById);

/**
 * @route POST api/v1/items
 * @desc Create a new item
 * @access PRIVATE
 */
router.post("/",
    verifyToken,
    upload.single("file"),
    itemValidatorChain,
    createItem);

/**
 * @route PUT api/v1/items/:id
 * @desc Update an item
 * @access PRIVATE
 */
router.put("/:id",
    verifyToken,
    upload.single("file"),
    itemValidatorChain,
    updateItem);

/**
 * @route PUT api/v1/items/:id/delete
 * @desc Mark an item as deleted
 * @access PRIVATE
 */
router.put("/:id/delete",
    verifyToken,
    deleteItem);

module.exports = router;