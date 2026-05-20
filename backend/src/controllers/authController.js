const authService = require('../services/authService');
const catchAsyncErrors = require('../utils/catchAsyncErrors');
const { ApiResponse } = require('../utils/apiResponse');

exports.register = catchAsyncErrors(async (req, res) => {
  const result = await authService.register(req.body);

  res.status(201).json(
    new ApiResponse(201, result, 'User registered successfully')
  );
});

exports.login = catchAsyncErrors(async (req, res) => {
  const { email, password } = req.body;
  const result = await authService.login(email, password);

  res.status(200).json(
    new ApiResponse(200, result, 'Login successful')
  );
});

exports.getProfile = catchAsyncErrors(async (req, res) => {
  const user = await authService.getUserProfile(req.user.id);

  res.status(200).json(
    new ApiResponse(200, user, 'Profile fetched successfully')
  );
});

exports.getAllUsers = catchAsyncErrors(async (req, res) => {
  const users = await authService.getAllUsers();

  res.status(200).json(
    new ApiResponse(200, users, 'Users fetched successfully')
  );
});

exports.updateProfile = catchAsyncErrors(async (req, res) => {
  const user = await authService.updateUser(req.user.id, req.body);

  res.status(200).json(
    new ApiResponse(200, user, 'Profile updated successfully')
  );
});

exports.updateUserRole = catchAsyncErrors(async (req, res) => {
  const { id } = req.params;
  const { role } = req.body;
  const user = await authService.updateUserRole(id, role);

  res.status(200).json(
    new ApiResponse(200, user, 'User role updated successfully')
  );
});
