const multer = require('multer');

const { v4: uuidv4 } = require('uuid');

const MAX_FILE_SIZE = 5 * 1024 * 1024;

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "./resources/static/uploads/")
    },

    filename: (req, file, cb) => {
        cb(null, `${uuidv4()}_${file.originalname.split(" ").join("_")}`);
    }
});

const upload = multer({
    storage: storage,
    limits: {
        fieldSize: MAX_FILE_SIZE
    },
    fileFilter: (req, file, cb) => {
        if (!file.originalname.match(/\.(jpg|jpeg|png|gif|jfif)$/)) {
            return cb(new Error("Only images are allowed"), false);
        }
        cb(null, true);
    }
})

module.exports = { upload };