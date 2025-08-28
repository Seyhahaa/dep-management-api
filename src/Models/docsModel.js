const mongoose = require('mongoose');

const docSchema = new mongoose.Schema({
    title: { type: String, required: true },
    location: { type: String, required: true },
    uploadBy:{ type: mongoose.Types.ObjectId, ref: 'Auth', required: true },
    office: { type: String, require: true},
    status: { type: String, default: 'public' },
    description: { type: String,},
    fileType: { type: String, required: true },
    isFavorite: { type: Boolean, default: false },
    thumbnail: { type: String}
},{ timestamps: true });

const docModel = mongoose.model("Docs", docSchema)

module.exports = docModel;