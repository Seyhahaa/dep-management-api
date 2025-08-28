const express = require('express');
const multer = require('multer');
const docRouter = express.Router();
const cloudinary = require('cloudinary').v2;
const fs = require('fs');
const { upload } = require('../../middleware/upload');
const docsController = require('../Controller/docsController');

const { verifyJWT } = require('../../middleware/index');

docRouter.post('/upload',verifyJWT, upload.single('file'), docsController.uploadFile);
//docRouter.post('/CloudUpload',verifyJWT, CloudUpload.single('file'), docsController.uploadFile);

docRouter.get('/all', docsController.getAllFiles);
docRouter.get('/:id', docsController.getFileById);
docRouter.get('/all/favorited', docsController.getFavoriteFiles);
docRouter.delete('/:id', docsController.deleteFile);
docRouter.put('/:id',verifyJWT, upload.single('file'), docsController.updateFile);
docRouter.put('/toggle-favorite/:id', docsController.toggleFavorite);


module.exports = docRouter;