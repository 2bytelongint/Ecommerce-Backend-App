const { trusted } = require('mongoose');
const { generateToken } = require('../config/jwtToken');
const { generateRefreshToken } = require('../config/refreshToken');
const User = require('../model/userModel')
const asyncHandler = require('express-async-handler');
const jwt = require("jsonwebtoken")

const createUser = asyncHandler(async(req,res) => {
    const email = req.body.email;

    const findUser = await User.findOne({email : email});

    if(!findUser){
        const newUser = await User.create(req.body);
        res.json(newUser)
    }else{
        throw new Error("User already Exists")
    }
})


const loginController = asyncHandler(async(req,res) => {
    const {email,password} = req.body;

    //check if user exists or not

    const findUser = await User.findOne({email});
    if(findUser && await findUser.isPasswordMatched(password)){
        const refreshToken = generateRefreshToken(findUser?._id)
        const updateUser = await User.findByIdAndUpdate(findUser._id, {
            refreshToken : refreshToken
        },{
            new : true
        })

        res.cookie('refreshToken', refreshToken, {
            httpOnly : true,
            maxAge : 72 * 60 * 60 * 1000
        })
        res.json({
            _id : findUser?._id,
            firstName : findUser?.firstName,
            lastName : findUser?.lastName,
            email : findUser?.email,
            mobile : findUser?.mobile,
            token : generateToken(findUser?._id)
        })
    }else{
        throw new Error("Invalid credentials")
    }
})


const handleRefreshToken = asyncHandler(async (req,res) => {
    const cookie = req.cookies;
    

    if(!cookie?.refreshToken){
        throw new Error("No refresh token")
    }
    const refreshToken = cookie.refreshToken;
    

    const user = User.findOne({refreshToken});
    
    if(!user){
        throw new Error("No refresh Token present in db")
    } 

    jwt.verify(refreshToken, process.env.PRIVATE_KEY, (err, decoded) => {
        if(err || user.id !== decoded._id){
            throw new Error("There is something error with REFRESH TOKEN");
        }

        const accessToken = generateRefreshToken(user?._id);
        res.json({
            accessToken
        })
    })
    
})

const logOutCrtl = asyncHandler(async (req,res) => {
    await User.findByIdAndUpdate(
        req.cookies.refreshToken._id,
        {
            $set : {
                refreshToken : undefined
            }
        },{
            new : true
        }
    )

    const option  = {
        httpOnly : true,
        secure : true
    }

    return res.status(200).clearCookie("refreshToken" ,option)
    .json({
        success : true
    })

})

const getAllUser = asyncHandler(async(req,res) => {
    try {
        const getUser = await User.find()
        res.json(getUser)
    } catch (error) {
        throw new Error(error)
    }
})

const getAnUser = asyncHandler(async (req,res) => {
    try {
        const email = req.body.email
        const user = await User.find({email});
        res.json(user)
    } catch (error) {
        throw new Error(error)
    }
})

const getAnUserWithId = asyncHandler(async (req,res) => {
    const {id} = req.params;
    try {
        
        const user = await User.findById(id);
        res.json(user)
    } catch (error) {
        throw new Error(error)
    }
})

const deleteAnUserWithId = asyncHandler(async (req,res) => {
    const {id} = req.params;
    try {
        const deleteAnUserWithId = await User.findByIdAndDelete(id);
        res.json({
            deleteAnUserWithId
        })
    } catch (error) {
        throw new Error(error)
    }
})

const updateUser = asyncHandler(async (req,res) => {
    const { id } = req.user;
    try {
        const updateUser = await User.findByIdAndUpdate(id, {
            firstName : req?.body.firstName,
            lastName : req?.body.lastName,
            email : req?.body.email,
            mobile : req?.body.mobile,

        },{
            new : true
        })
        res.json({
            updateUser
        }
        )
    } catch (error) {
        
    }
})

module.exports = {createUser, loginController ,getAllUser, getAnUser ,deleteAnUserWithId,getAnUserWithId,
    updateUser, handleRefreshToken, logOutCrtl
}