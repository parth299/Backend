import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js"; 
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";


const generateRefreshAndAccessToken = async(userId) => {
    try {
        const user = await User.findById(userId);

        if(!user) {
            throw new ApiError(401, "User not found");
        }

        const accessToken = await user.generateAccessToken();
        const refreshToken = await user.generateRefreshToken();

        user.refreshToken = refreshToken;
        await user.save({validateBeforeSave: false})

        return {accessToken, refreshToken}

    } catch (error) {
        throw new ApiError(500, "Something went wrong while generating refresh and access token");
    }
}

const registerUser = asyncHandler( async (req, res) => {
    // get user details from the frontend
    // validation checks
    // check if the username already exists
    // check for images and avatar
    // upload them to cloudinary
    // create a user object
    // remove password and refresh token from the response
    // check for user creation
    // return response

    const { username, fullName, email, password,  } = req.body;
    console.log("Email is : ", email);

    // if(fullName === ""){
    //     throw new ApiError(400, "Full name is required");
    // }

    // Validation check
    if (
        [fullName, username, email, password].some((field) => field?.trim() === "") 
    ) {
        throw new ApiError(400, "All field are required!");
    }

    // Checking if user already exists
    const existedUser = User.findOne({
        $or: [{username}, {email}]
    })
    if(existedUser){
        throw new ApiError(409, "User with username already exists!");
    }


    const avatarLocalPath = req.files?.avatar[0]?.path;
    // const coverImageLocalPath = req.files?.coverImage[0]?.path;

    let coverImageLocalPath;
    if(req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0) {
        coverImageLocalPath = req.files?.coverImage[0]?.path
    }

    if(!avatarLocalPath){
        throw new ApiError(400, "Avatar is required");
    }

    const avatar = await uploadOnCloudinary(avatarLocalPath);
    const coverImage = await uploadOnCloudinary(coverImageLocalPath);

    if(!avatar){
        throw new ApiError(400, "Avatar is required");
    }

    const user = await User.create({
        fullName,
        avatar: avatar.url,
        coverImage: coverImage?.url || "",
        email,
        password,
        username: username.toLowerCase()
    })

    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    );

    if(!createdUser){
        throw new ApiError(500, "Something went wrong while registering user");
    }

    return res.status(201).json(
        new ApiResponse(200, createdUser, "User registered successfully!")
    )

} );

const loginUser = asyncHandler(async(req, res) => {
    // take username/email and password
    // find the user using email or password
    // check if the password is correct or not
    // generate refresh and access tokens
    // set the cookies for the user
    try {
        const {username, email, password} = req.body;

        if(!username && !email) {
            throw new ApiError(400, "Username or email is required")
        }
        const user = await User.findOne({
            $or: [
                {username},
                {email}
            ]
        })

        if(!user) {
            throw new ApiError(404, "User not found");
        }

        const isPasswordValid = await user.isPasswordCorrect(password);

        if(!isPasswordValid) {
            throw new ApiError(401, "Invalid user credentials");
        }
        const {accessToken, refreshToken} = await generateRefreshAndAccessToken(user._id);

        const loggedInUser = await User.findById(user._id).select("-password -refreshToken")
        const options = {
            httpOnly: true,
            secure: true
        }

        return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(
            new ApiResponse(
                200,
                {
                    user: loggedInUser, accessToken, refreshToken
                },
                "User logged in successfully"
            )
        )

    } catch (error) {
        throw new ApiError(500, "User login failed");
    }
})

const logoutUser = asyncHandler(async(req, res) => {
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $unset: {
                refreshToken: 1 // this removes the field from document
            }
        },
        {
            new: true
        }
    )

    const options = {
        httpOnly: true,
        secure: true
    }

    return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "User logged Out"))
})


export {
    registerUser,
}