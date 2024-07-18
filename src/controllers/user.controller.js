import {asyncHandler} from "../utils/asyncHandler.js"
import {ApiError} from "../utils/ApiError.js"
import {User} from "../models/user.model.js"
import {uploadOnCloudinary} from "../utils/cloudinary.js"
import { ApiResponse } from "../utils/ApiResponse.js"

const registerUser = asyncHandler(async (req, res) => {
    /* these are some work we have to do while registering a user */
    // get user detail from frontend
    // validation - not empty
    // check if user already exits email or username
    // check avatar and images
    // upload images to cloudinary, avatar 
    // create user object - create entry [object creation for mongoDB uplodation]
    // remove password and response token field from response
    // check is user is created or not
    // resturn response

    const {fullName, email, username, password} = req.body
    console.log("email", email)

    // Validation check
    // ( here we only check for empty field ) [ we can also check for proper email ]
    if(
        [fullName, email, username, password].some((field)=> field ?.trim() === "")
    ){
        throw new ApiError(400, "fullname is required")
    }

    // Validation for is User already exist or not
    const existedUser = User.findOne({ // ['User' is model we have created before through mongoose we 
                                        // are finding the username or email in database, it will return true or false.]
        $or: [{username},{email}]
    })
    if(existedUser) {
        throw new ApiError(409, "User with email or username already exists")
    }

    //check for images 
    // jaise req me 'req.body' by default express deta h vaise he humne jo 'user' middleware add kiya hai vo hmko 'req.files' ka access deta h

    const avatarLocalPath = req.files?.avatar[0]?.path;
    // avatar[0] pe ek object hota hai
    // avatar[0].path vo path hai to multer ne upload kiya hai
    // req.files ko ek baar console.log kara ke dekhna hai
    const coverImageLocalPath = req.files?.coverImage[0]?.path;

    if(!avatarLocalPath) {
        throw new ApiError(400, "Avatar file is required") // agar server pe upload ni hua hai to error dega
    }

    // upload images to cloudinary, avatar
    const avatar = await uploadOnCloudinary(avatarLocalPath)// kyuki cloudinary pe image upload hone me time lagega isliye await krva rhe hai
    const coverImage = await uploadOnCloudinary(coverImageLocalPath)

    if(!avatar){
        throw new ApiError(400, "Avatar file is required") // agar cloudinary pe upload ni hua hai  to error dega
    }

    // create user object - create entry [object creation for mongoDB uplodation]
    const user = await User.create({
        fullName,
        avatar: avatar.url, //cloudinary hmko pura response bhej rha hai usme se url nikal ke DB me store krvana hai hmko
        coverImage : coverImage?.url || "", //iss line ka mtlb hai agar cover image hai to url nikal lo vrna empty rhene do kyuki hmne uppar check ni lagaya hai or ye field required bhi nhi hai
        email,
        password,
        username: username.toLowerCase()
    })

    
    // checking is user is created or not
    // remove password and response token field from response
    // agar user ban gaya hoga to id miljayega
    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    )// select function me hum vo vo field pass krte hai jo humko ni chaiye by default sabhi select hote hai

    // check is user is created or not
    if(!createdUser) {
        throw new ApiError(500, "Something went wrong while registering a user")
    }
    
    // resturn response

    return res.status(201).json(
        new ApiResponse(200, createdUser, "User registered Successfully")
    )

} )

export {registerUser}