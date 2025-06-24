import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import ApiResponse from "../utils/ApiRsponse.js";

import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const registerUser = asyncHandler(async (req, res) => {
    // Get user details from frontend
    const { username, email, fullName, password } = req.body;

    // Validation for required fields
    if ([fullName, email, username, password].some((field) => !field?.trim())) {
        throw new ApiError(400, "All fields are required");
    }

    // Check if user already exists
    const existedUser = await User.findOne({
        $or: [{ email }, { username }],
    });

    if (existedUser) {
        throw new ApiError(409, "User already registered");
    }

    // Check and upload images
    // console.log(req.files)
    const avatarLocalPath = req.files?.avatar?.[0]?.path;
    const coverImageLocalPath = req.files?.coverImage?.[0]?.path;

    if (!avatarLocalPath) {
        throw new ApiError(400, "Avatar is required");
    }
    const avatar = await uploadOnCloudinary(avatarLocalPath);
    const coverImage = coverImageLocalPath
        ? await uploadOnCloudinary(coverImageLocalPath)
        : null;

    if (!avatar?.url) {
        throw new ApiError(400, "Failed to upload avatar");
    }

    // Create user
    const user = await User.create({
        fullName,
        avatar: avatar.url,
        coverImage: coverImage?.url || "",
        email,
        password,
        username: username.toLowerCase(),
    });

    // Fetch clean user data
    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    );

    if (!createdUser) {
        throw new ApiError(500, "Error while registering user");
    }

    // Send response
    return res
        .status(201)
        .json(new ApiResponse(201, createdUser, "User registered successfully"));
});

const generateAccessTokenAndRefreshToken = async(userId)=>{
    try {
        const user = await User.findById(userId)
        const accessToken = user.generateAccessToken()
        const refreshToken = user.generateRefreshToken()
        user.refreshToken = refreshToken
        await user.save({validateBeforeSave :false})
        return {accessToken,refreshToken}
    } catch (error) {
        throw new ApiError(500,"err while generating tokens")
    }
}

const loginUser = asyncHandler(async (req, res) => {
    const { email, username, password } = req.body;

    // 1. Validate input
    if (!(email || username)) {
        throw new ApiError(400, "Email or Username are required");
    }

    if (!password) {
        throw new ApiError(400, "Password is required");
    }

    // 2. Find user by email or username
    const user = await User.findOne({
        $or: [{ email }, { username }]
    });

    if (!user) {
        throw new ApiError(404, "User does not exist");
    }

    // 3. Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        throw new ApiError(401, "Invalid credentials"); // Changed to 401 for authentication error
    }

    // 4. Generate tokens
    const { accessToken, refreshToken } = await generateAccessTokenAndRefreshToken(user._id);

    // 5. Get user without sensitive data
    const loggedUser = await User.findById(user._id) // Fixed: user._id instead of user._Id
        .select("-password -refreshToken");

    // 6. Send response
    const options = {
        httpOnly: true,
        secure: true
    };

    res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(
            new ApiResponse(200, {
                user: loggedUser,
                refreshToken,
                accessToken
            }, "User logged in successfully")
        );
});

const logOutUser = asyncHandler(async (req, res) => {
    const id = req.user._id;

    await User.findByIdAndUpdate(id, {
        $unset: { refreshToken: 1 } 
    }, {
        new: true
    });

    const options = {
        httpOnly: true,
        secure: true
    };

    return res
        .status(200)
        .clearCookie("accessToken", options)
        .clearCookie("refreshToken", options)
        .json(
            new ApiResponse(200, {}, "User logged out successfully")
        );
});

 const refreshAccessToken = asyncHandler(async (req, res) => {
  const oldRefreshToken = req.cookies?.refreshToken || req.body?.refreshToken;

  if (!oldRefreshToken) {
    throw new ApiError(401, "Unauthorized: Refresh token missing");
  }

  let decoded;
  try {
    decoded = jwt.verify(oldRefreshToken, process.env.REFRESH_TOKEN_SECRET);
  } catch (error) {
    throw new ApiError(401, "Invalid or expired refresh token");
  }

  const user = await User.findById(decoded?._id);
  if (!user || user.refreshToken !== oldRefreshToken) {
    throw new ApiError(401, "Refresh token mismatch or user not found");
  }

  const { accessToken, refreshToken: newRefreshToken } = await generateAccessTokenAndRefreshToken(user._id);

  const cookieOptions = {
    httpOnly: true,
    secure: true,
  };

  res
    .status(200)
    .cookie("accessToken", accessToken, cookieOptions)
    .cookie("refreshToken", newRefreshToken, cookieOptions)
    .json(
      new ApiResponse(200, {
        accessToken,
        refreshToken: newRefreshToken,
      }, "Access token refreshed successfully")
    );
});

export { registerUser, loginUser ,logOutUser,refreshAccessToken};
