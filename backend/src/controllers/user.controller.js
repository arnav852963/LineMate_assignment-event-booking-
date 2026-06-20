import { User } from '../models/user.model.js';
import { asyncHandler } from '../utilities/asyncHandler.js';
import { ApiError } from '../utilities/ApiError.js';
import { ApiResponse } from '../utilities/ApiResponse.js';
import { upload } from '../utilities/cloudinary.js';
import jwt from 'jsonwebtoken';

const getUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).select(
    '-password -refreshToken'
  );

  if (!user) {
    throw new ApiError(404, 'User not found');
  }

  return res
    .status(200)
    .json(new ApiResponse(200, user, 'User fetched successfully'));
});

const addProfilePhoto = asyncHandler(async (req, res) => {
  const localFilePath = req?.file?.path;

  if (!localFilePath) {
    throw new ApiError(400, 'Profile photo file is required');
  }

  const uploadedImage = await upload(localFilePath);

  if (!uploadedImage || !uploadedImage.url) {
    throw new ApiError(500, 'Error while uploading image to Cloudinary');
  }

  const updatedUser = await User.findByIdAndUpdate(
    req.user._id,
    {
      $set: {
        profilePhoto: uploadedImage.url,
      },
    },
    { new: true }
  ).select('-password -refreshToken');

  return res
    .status(200)
    .json(
      new ApiResponse(200, updatedUser, 'Profile photo updated successfully')
    );
});

const refreshAccessToken = asyncHandler(async (req, res) => {
  const incomingRefreshToken = req.cookies.refreshToken;

  if (!incomingRefreshToken) {
    throw new ApiError(
      401,
      'Unauthorized request: No refresh token found in cookies'
    );
  }

  try {
    const decodedToken = jwt.verify(
      incomingRefreshToken,
      process.env.REFRESH_TOKEN_SECRET
    );

    const user = await User.findById(decodedToken?._id);

    if (!user) {
      throw new ApiError(401, 'Invalid refresh token: User not found');
    }

    if (incomingRefreshToken !== user?.refreshToken) {
      throw new ApiError(401, 'Refresh token is expired or has been revoked');
    }

    const accessTokenOptions = {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      maxAge: 1 * 24 * 60 * 60 * 1000,
    };

    const accessToken = user.generateAccessToken();

    return res
      .status(200)
      .cookie('accessToken', accessToken, accessTokenOptions)
      .json(
        new ApiResponse(
          200,
          { accessToken },
          'Access token refreshed successfully'
        )
      );
  } catch (error) {
    throw new ApiError(401, error?.message || 'Invalid refresh token');
  }
});

export { getUser, addProfilePhoto, refreshAccessToken };
