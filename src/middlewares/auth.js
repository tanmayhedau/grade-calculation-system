const jwt = require("jsonwebtoken");

const authentication = async function (req, res, next) {
  try {
    let token = req.headers["authorization"];
    if (!token) {
      return res
        .status(400)
        .send({ status: false, message: "token must be present" });
    }
    token = token.split(" ");

    jwt.verify(token[1], "plutonium", function (error, decodedToken) {
      if (error)
        return res
          .status(401)
          .send({ status: false, message: "token is invalid or expired" });

      req["decodedToken"] = decodedToken;

      next();
    });
  } catch (error) {
    return res.status(500).send({ status: false, message: error.message });
  }
};

module.exports = { authentication };
