const jwt = require('jsonwebtoken');

// THIS IS THE ONLY FUNCTION IN THIS FILE
const generateAccessToken = (userId) => {

  // The payload for the token
  const payload = { id: userId };

  // --- THIS IS THE TEST ---
  // We are hardcoding the secret key directly into the function call.
  // This completely bypasses the .env file.
  const hardcodedSecret = 'ThisIsMyHardcodedSecretKeyPleaseWork12345';

  console.log('--- DEBUG: Attempting to sign token with hardcoded secret ---');

  return jwt.sign(payload, hardcodedSecret, {
    expiresIn: '1d',
  });
};

module.exports = {
  generateAccessToken,
};