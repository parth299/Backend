const asyncHandler = (requestHandler) => {
    (req, res, next) => {
        Promise.resolve(requestHandler(req, res, next)).catch((err)=> next(err))
    }
}


export { asyncHandler };




// Approach 1 to handle the asynchronous functions 

// This is a higher order function i.e a function which can accept a function as an arguement.
// const asyncHandler = (func) => async (req, res, next) => {
//     try {
//         await func(req, res, next);
//     } catch (error) {
//         res.status(error.code || 500).json({
//             success: false,
//             message: error.message
//         })
//     }
// }