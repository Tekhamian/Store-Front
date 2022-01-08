import path from 'path'
import express from 'express'
import multer from 'multer'

const router = express.Router()

const storage = multer.diskStorage({
    // *Note cb = callback
    destination(req, file, cb) {
        cb(null, 'uploads/')
    },
    filename(req, file, cb) {
        // *Note: the path-module (extname - built into node) will get the ext of a file name & add it to our file neme
        cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`)
    }
})

// File filter for the specific filetypes we want
function checkFileType(file, cb) {
    const filetypes = /jpg|jpeg|png/
    // Please note that the variable (const extname) name is different than the method (.extname)
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase())
    const mimetype = filetypes.test(file.mimetype)

    if(extname && mimetype) {
        return cb(null, true)
    } else {
        cb('IMAGES ONLY!')
    }
}

// Middleware function to our route
const upload = multer ({
    storage,
    fileFilter: function(req, file, cb) {
        checkFileType(file, cb)
    }
})
// Single images only
router.post('/', upload.single('image'), (req, res) => {
    res.send(`/${req.file.path}`)
})

export default router