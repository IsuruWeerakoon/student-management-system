const multer = require('multer');
const path = require('path');

const save = multer.diskStorage({
    destination : function(req, res, callback){
        callback(null, './uploads/');
    },

    filename : function(req, res, callback){
        callback(null, Date.now() + path.extname(res.originalname));
    }
});

const upload = multer({storage : save}).single('file');

module.exports = upload;