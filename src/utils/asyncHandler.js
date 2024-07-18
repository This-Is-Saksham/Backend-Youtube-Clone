// this is a wrapper function to execute a function
// these are high order function which accept a function as a parameter

// this code is from Promises

const asyncHandler = (requestHandler) => {
    return (req, res, next) => {
        Promise.resolve(requestHandler(req, res, next)).catch((err) => next(err)) 
    }
}

export {asyncHandler}


// const asyncHandler = () => {}
// const asyncHandler = () => {() => {}}
// const asyncHandler = (func) => async() => {}


// this code is from try and catch :-

// const asyncHandler = (fn) => async(req, res, next) => {
//     try {
//         await fn(req, res, next)
//     } catch (error) {
//         res.status(err.code || 500).json({
//             success : false,
//             message : err.message
//         })
//     }
// }