const jwt = require("jsonwebtoken");

const secret = "anas@123";
function createTokenForUser(user) {
  const payload = {
    name: user.name,
    email: user.email,
    profileImageUrl: user.profileImageUrl,
    id: user._id,
  };
  const token = jwt.sign(payload, secret);
  return token;
}
function createDataFromToken(token) {
  const data = jwt.verify(token, secret);
  return data;
}

module.exports = { createTokenForUser, createDataFromToken };
