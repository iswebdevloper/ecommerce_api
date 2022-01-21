const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    const token = authHeader.split(" ")[1];
    jwt.verify(token, process.env.JWTKEY, (err, user) => {
      if (err) res.status(401).json("You are not authenticated!");
      req.user = user;
      next();
    });
  } else {
    res.status(401).json("You are not authenticated!");
  }
};

const verifyAuthorization = (req, res, next) => {
  verifyToken(req, res, () => {
    if (req.user.id === req.params.id || req.user.isAdmin) next();
    else res.status(403).json("You are not Allowed!");
  });
};

const verifyAuthorizationIsAdmin = (req, res, next) => {
  verifyToken(req, res, () => {
    if (req.user.isAdmin) next();
    else res.status(403).json("You are not Allowed!");
  });
};

module.exports = {
  verifyToken,
  verifyAuthorization,
  verifyAuthorizationIsAdmin,
};
