const expressAsyncHandler = require("express-async-handler");
const authModel = require("../Models/UserModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { default: axios } = require("axios");

const UserController = {
    showGoogleConsentScreen: (req, res) => {
        const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${process.env.GOOGLE_CLIENT_ID}&redirect_uri=${process.env.GOOGLE_REDIRECT_URL}&response_type=code&scope=openid%20profile%20email&access_type=offline`;
        return res.redirect(googleAuthUrl);
    },
    handleGoogle: expressAsyncHandler(async(req,res,next)=>{
        const {code}  = req.query;
        const { data } = await axios.post('https://oauth2.googleapis.com/token', {
            code,
            client_id: process.env.GOOGLE_CLIENT_ID,
            client_secret: process.env.GOOGLE_CLIENT_SECRET,
            redirect_uri: process.env.GOOGLE_REDIRECT_URL,
            grant_type: 'authorization_code',
          });
         // Fetch user information using access token
        const {access_token} = data;

        const response = await axios.get(`https://www.googleapis.com/oauth2/v1/userinfo`,
        {
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        });
        const user = await authModel.findOne({ email: response.data.email });
        if (!user) {
        const newUser = new authModel({
            username: response.data.name,
            email: response.data.email,
            password: access_token,
            picture: response.data.picture
        });
        await newUser.save();
        }
        const token = jwt.sign({data: user.id},process.env.JWT_SECRET, { expiresIn: '2h' });
        return res.json({ token });
    }),

    singUp: expressAsyncHandler(async (req, res) => {
        const { username,email, password, confirmPassword,phone  } = req.body;
        const user = await authModel.find({ username: username, email: email,})
        if (user.length > 0) {
            return res.status(400).json({ message: "User already exists" })
        }
        if (password !== confirmPassword) {
            return res.status(400).json({ message: "Password does not match" })
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await authModel.create({ username, email, password: hashedPassword, phone });
        res.status(201).json({ message: "User registered successfully", data: newUser });
    }),
    login: expressAsyncHandler(async (req, res) => {
        const { email, password } = req.body;
        const user = await authModel.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "Invalid email or password" });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "password missMatch" });
        }
        const token = jwt.sign({ data: user.id }, process.env.JWT_SECRET, { expiresIn: '2h' });
        res.status(200).json({ token });
    }),
    getUsers: expressAsyncHandler(async (req, res) => {
        const users = await authModel.find({});
        res.status(200).json(users);
    }),
    getUserById: expressAsyncHandler(async (req, res) => {
        const user = await authModel.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json(user);
    }),
    updateUser: expressAsyncHandler(async (req, res) => {
        const user = await authModel.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json(user);
    }),
    deleteUser: expressAsyncHandler(async (req, res) => {
        const user = await authModel.findByIdAndDelete(req.params.id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json({ message: "User deleted successfully" });
    }),
    exchangeJWTToUser: expressAsyncHandler(async (req, res) => {
        return res.json(req.user)
      }),
}
module.exports = UserController;