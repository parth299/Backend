import { asyncHandler } from "../utils/asyncHandler.js";


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

} )


export {
    registerUser,
}