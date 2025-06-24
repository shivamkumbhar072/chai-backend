import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from 'jsonwebtoken';
import { User } from "../models/user.model.js";

export const verifyJWT = asyncHandler(async (req, res, next) => {
  const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "");

//   console.log("Authorization Header:", req.header("Authorization")); 
//   console.log("Access Token:", token);

  if (!token) {
    throw new ApiError(401, "Unauthorized request: No token provided");
  }

  let decodedToken;
  try {
    decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
  } catch (err) {
    throw new ApiError(401, "Invalid or expired access token");
  }

  const user = await User.findById(decodedToken?._id).select("-password -refreshToken");
  if (!user) {
    throw new ApiError(401, "User not found");
  }

  req.user = user;
  next();
});
