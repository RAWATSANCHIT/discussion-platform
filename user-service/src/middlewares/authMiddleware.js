const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) {
    return res.sendStatus(401); // Unauthorized
  }

  jwt.verify(token, 'your_jwt_secret', (err, user) => {
    if (err) {
      console.log(err)
      return res.sendStatus(403); // Forbidden
    }
    req.user = user;
    next();
  });
};
