const fs = require('fs');
const path = require('path');
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('cloudinary').v2;

    // Configuration
    cloudinary.config({ 
        cloud_name: 'dchutnzwv', 
        api_key: '434344429477951', 
        api_secret: 'fhAWqkaBgq8T0g4YeLrBl7RQ1f8' // Click 'View API Keys' above to copy your API secret
    });
    const storage = new CloudinaryStorage({
      cloudinary: cloudinary,
      params: {
        folder: 'uploads',
        allowed_formats: ['jpg', 'jpeg', 'png', 'gif']
        // You can add more parameters like:
        // transformation: [{ width: 500, height: 500, crop: 'limit' }]
      }
    });
const upload = multer({ storage: storage });

    
    
module.exports = { upload};