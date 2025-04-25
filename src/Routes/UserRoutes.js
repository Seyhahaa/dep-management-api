const express = require('express');
const UserController = require('../Controller/UserController');
const { verifyJWT } = require('../../middleware');
const Userrouter = express.Router();

Userrouter.post('/sign-up', UserController.singUp);
Userrouter.post('/login', UserController.login);

Userrouter.get('/users', UserController.getUsers);
Userrouter.get('/user/:id', UserController.getUserById);
Userrouter.put('/user/:id', UserController.updateUser);
Userrouter.delete('/user/:id', UserController.deleteUser);

Userrouter.get('/oauth', UserController.showGoogleConsentScreen);
Userrouter.get('/google/callback', UserController.handleGoogle);
Userrouter.get('/me', verifyJWT, UserController.exchangeJWTToUser);
module.exports = Userrouter;