import { User } from '../models/user.model.js';
import { asyncHandler } from '../utilities/asyncHandler.js';
import { ApiError } from '../utilities/ApiError.js';
import { ApiResponse } from '../utilities/ApiResponse.js';
import { verifyGoogleToken } from '../utilities/googleAuth.js';
import {
  registerBodySchema,
  loginBodySchema,
  googleLoginBodySchema,
  authResponseSchema,
} from '../zod/auth.zod.js';
import { userResponseSchema } from '../zod/user.zod.js';

const generateAccessAndRefreshTokens = async (userId) => {
  try {
    const user = await User.findById(userId);
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(
      500,
      'Something went wrong while generating refresh and access token'
    );
  }
};

const register = asyncHandler(async (req, res) => {
  const parsedBody = registerBodySchema.safeParse(req.body);
  if (!parsedBody.success) {
    throw new ApiError(400, parsedBody.error.errors[0].message);
  }

  const { fullName, email, password } = parsedBody.data;

  const existedUser = await User.findOne({ email });

  if (existedUser) {
    throw new ApiError(409, 'User with this email already exists');
  }

  const user = await User.create({
    fullName,
    email,
    password,
  });

  const createdUser = await User.findById(user._id)
    .select('-password -refreshToken')
    .lean();

  if (!createdUser) {
    throw new ApiError(500, 'Something went wrong while registering the user');
  }

  const validatedResponse = userResponseSchema.parse(createdUser);

  return res
    .status(201)
    .json(
      new ApiResponse(201, validatedResponse, 'User registered successfully')
    );
});

const login = asyncHandler(async (req, res) => {
  const parsedBody = loginBodySchema.safeParse(req.body);
  if (!parsedBody.success) {
    throw new ApiError(400, parsedBody.error.errors[0].message);
  }

  const { email, password } = parsedBody.data;

  const user = await User.findOne({ email });

  if (!user) {
    throw new ApiError(404, 'User does not exist, please register first');
  }

  const isPasswordValid = await user.isPasswordCorrect(password);

  if (!isPasswordValid) {
    throw new ApiError(401, 'Invalid credentials');
  }

  const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(
    user._id
  );

  const loggedInUser = await User.findById(user._id)
    .select('-password -refreshToken')
    .lean();

  const validatedResponse = authResponseSchema.parse({
    user: loggedInUser,
    accessToken,
    refreshToken,
  });

  const accessTokenOptions = {
    httpOnly: true,
    secure: true,
    sameSite: 'none',
    maxAge: 1 * 24 * 60 * 60 * 1000,
  };

  const refreshTokenOptions = {
    httpOnly: true,
    secure: true,
    sameSite: 'none',
    maxAge: 7 * 24 * 60 * 60 * 1000,
  };

  return res
    .status(200)
    .cookie('accessToken', accessToken, accessTokenOptions)
    .cookie('refreshToken', refreshToken, refreshTokenOptions)
    .json(
      new ApiResponse(200, validatedResponse, 'User logged in successfully')
    );
});

const googleLogin = asyncHandler(async (req, res) => {
  const parsedBody = googleLoginBodySchema.safeParse(req.body);
  if (!parsedBody.success) {
    throw new ApiError(400, parsedBody.error.errors[0].message);
  }

  const { idToken } = parsedBody.data;

  let payload;
  try {
    payload = await verifyGoogleToken(idToken);
  } catch (error) {
    throw new ApiError(401, 'Google auth failed');
  }

  const { email, name, picture } = payload;

  let user = await User.findOne({ email });

  if (!user) {
    user = await User.create({
      fullName: name,
      email: email,
      profilePhoto: picture,
    });
  }

  const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(
    user._id
  );

  const loggedInUser = await User.findById(user._id)
    .select('-password -refreshToken')
    .lean();

  const validatedResponse = authResponseSchema.parse({
    user: loggedInUser,
    accessToken,
    refreshToken,
  });

  const accessTokenOptions = {
    httpOnly: true,
    secure: true,
    sameSite: 'none',
    maxAge: 1 * 24 * 60 * 60 * 1000,
  };

  const refreshTokenOptions = {
    httpOnly: true,
    secure: true,
    sameSite: 'none',
    maxAge: 7 * 24 * 60 * 60 * 1000,
  };

  return res
    .status(200)
    .cookie('accessToken', accessToken, accessTokenOptions)
    .cookie('refreshToken', refreshToken, refreshTokenOptions)
    .json(
      new ApiResponse(
        200,
        validatedResponse,
        'User logged in via Google successfully'
      )
    );
});

const logout = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(
    req.user._id,
    {
      $unset: {
        refreshToken: 1,
      },
    },
    {
      new: true,
    }
  );

  const accessTokenOptions = {
    httpOnly: true,
    secure: true,
    sameSite: 'none',
  };

  const refreshTokenOptions = {
    httpOnly: true,
    secure: true,
    sameSite: 'none',
  };

  return res
    .status(200)
    .clearCookie('accessToken', accessTokenOptions)
    .clearCookie('refreshToken', refreshTokenOptions)
    .json(new ApiResponse(200, {}, 'User logged out successfully'));
});

export { register, login, googleLogin, logout };
