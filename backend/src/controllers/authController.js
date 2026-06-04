const authService = require('../services/authService');
const catchAsyncErrors = require('../utils/catchAsyncErrors');
const { ApiResponse } = require('../utils/apiResponse');

const buildGoogleAuthUrl = () => {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const redirectUri = process.env.GOOGLE_REDIRECT_URI || `${process.env.API_BASE_URL || 'http://localhost:5000'}/api/auth/google/callback`;
  const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3001';

  if (!clientId) {
    throw new Error('GOOGLE_CLIENT_ID is not configured');
  }

  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    response_type: 'code',
    scope: 'openid email profile',
    access_type: 'offline',
    prompt: 'consent',
    state: Buffer.from(JSON.stringify({ frontendUrl })).toString('base64url'),
  });

  return `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
};

const exchangeGoogleCode = async (code) => {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  const redirectUri = process.env.GOOGLE_REDIRECT_URI || `${process.env.API_BASE_URL || 'http://localhost:5000'}/api/auth/google/callback`;

  if (!clientId || !clientSecret) {
    throw new Error('Google OAuth environment variables are not configured');
  }

  const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      code,
      client_id: clientId,
      client_secret: clientSecret,
      redirect_uri: redirectUri,
      grant_type: 'authorization_code',
    }),
  });

  if (!tokenResponse.ok) {
    const errorText = await tokenResponse.text();
    throw new Error(`Google token exchange failed: ${errorText}`);
  }

  const tokenData = await tokenResponse.json();

  const profileResponse = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
    headers: { Authorization: `Bearer ${tokenData.access_token}` },
  });

  if (!profileResponse.ok) {
    const errorText = await profileResponse.text();
    throw new Error(`Google profile fetch failed: ${errorText}`);
  }

  return profileResponse.json();
};

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

exports.googleAuth = catchAsyncErrors(async (req, res) => {
  const url = buildGoogleAuthUrl();
  res.redirect(url);
});

exports.googleCallback = catchAsyncErrors(async (req, res) => {
  const { code, error } = req.query;
  const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3001';

  if (error) {
    return res.redirect(`${frontendUrl}/login?google_error=${encodeURIComponent(error)}`);
  }

  if (!code) {
    return res.redirect(`${frontendUrl}/login?google_error=missing_code`);
  }

  const profile = await exchangeGoogleCode(code);
  const result = await authService.findOrCreateGoogleUser({
    email: profile.email,
    name: profile.name,
  });

  const payload = Buffer.from(JSON.stringify({
    token: result.token,
    user: result.user,
  })).toString('base64url');

  res.redirect(`${frontendUrl}/login?auth=${payload}`);
});
