const router = require('express').Router();

router.put("/:id/like");
router.put("/:id/unlike");
router.put("/:id/delete");
router.put("/:id");
router.get("/:id/replies");
router.post("/:id/reply")

module.exports = router;