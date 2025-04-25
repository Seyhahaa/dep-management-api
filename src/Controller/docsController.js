const expressAsyncHandler = require('express-async-handler');
const docModel = require('../Models/docsModel');
const cloudinary = require('cloudinary').v2;

const docsController = {
    uploadFile: expressAsyncHandler(async (req, res) => {
        const { title, office, description, } = req.body;
        const file = req.file?.path;
        const user = req.user;
        const fileType = req.file?.mimetype;

        console.log(req.file);

        const result = new docModel({
            title,
            office,
            description,
            uploadBy: user._id,
            fileType,
            location: file,
        });
        const newFile = await result.save();
        res.status(201).json({ message: 'File uploaded successfully', doc: newFile });
    }),
    getAllFiles: expressAsyncHandler(async (req, res) => {
        const files = await docModel.find({}).populate('uploadBy', 'username email');
        res.status(200).json(files);
    }),
    getFileById: expressAsyncHandler(async (req, res) => {
        const file = await docModel.findById(req.params.id).populate('uploadBy', 'username email');
        if (!file) {
            return res.status(404).json({ message: 'File not found' });
        }
        res.status(200).json(file);
    }),
    deleteFile: expressAsyncHandler(async (req, res) => {
        const file = await docModel.findByIdAndDelete(req.params.id);
        if (!file) {
            return res.status(404).json({ message: 'File not found' });
        }
        const url = file.location;
        const path = url.split('uploads/')[1].split('.')[0];
        const public_id = 'uploads/' + path;
        await cloudinary.uploader.destroy(public_id);
        res.status(200).json({ message: 'File deleted successfully' });
    }),
    updateFile: expressAsyncHandler(async (req, res) => {
        const { title, office, description } = req.body;
        const file = req.file?.path;
        const user = req.user;
        const fileType = req.file?.mimetype;
        const fileID = await docModel.findById(req.params.id);
        const updatedFile = await docModel.findByIdAndUpdate(req.params.id, {
            title,
            office,
            description,
            uploadBy: user._id,
            fileType,
            location: file,
        }, { new: true });
        const url = fileID.location;
        const path = url.split('uploads/')[1].split('.')[0];
        const public_id = 'uploads/' + path;
        await cloudinary.uploader.destroy(public_id);
        if (!updatedFile) {
            return res.status(404).json({ message: 'File not found' });
        }
        
        res.status(200).json({ message: 'File updated successfully', doc: updatedFile });
    }),
    toggleFavorite: expressAsyncHandler(async (req, res) => {
        const file = await docModel.findById(req.params.id);
        if (!file) {
            return res.status(404).json({ message: 'File not found' });
        }
        file.isFavorite = !file.isFavorite;
        await file.save();
        res.status(200).json({ message: 'File favorite status updated', doc: file });
    }),
    getFavoriteFiles: expressAsyncHandler(async (req, res) => {
        const files = await docModel.find({ isFavorite: true }).populate('uploadBy', 'username email');
        if (files.length === 0) {
            return res.status(404).json({ message: 'No favorite files found' });
        }
        res.status(200).json(files);
    }),
}

module.exports = docsController;