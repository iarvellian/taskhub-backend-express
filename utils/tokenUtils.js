const { SignJWT, jwtVerify } = require('jose');
const { createSecretKey } = require('crypto');

// Load JWT secrets from .env
const secret = createSecretKey(Buffer.from(process.env.JWT_SECRET, 'utf-8'));

const signAccessToken = async (userId) => {
  const accessToken = await new SignJWT({ id: userId })
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime(process.env.JWT_EXPIRES_IN)
    .sign(secret);
  
  return accessToken;
};

const signRefreshToken = async (userId) => {
  const refreshToken = await new SignJWT({ id: userId })
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime(process.env.JWT_REFRESH_EXPIRES_IN)
    .sign(secret);
  
  return refreshToken;
};

const verifyToken = async (token) => {
  try {
    const { payload } = await jwtVerify(token, secret);
    return payload;
  } catch (error) {
    throw new Error('Token verification failed');
  }
};

module.exports = {
  signAccessToken,
  signRefreshToken,
  verifyToken,
};