const { createDataFromToken } = require("../services/authentication");
function checkTokenAtEveryReq(tokenNameInCookie) {
  return (req, res, next) => {
    const token = req.cookies[tokenNameInCookie];

    if (!token) {
      return next();
    }
    try {
      const userData = createDataFromToken(token);
      req.user = userData;
      next();
    } catch (error) {
      console.log(error);

      next();
    }
  };
}

module.exports = { checkTokenAtEveryReq };
