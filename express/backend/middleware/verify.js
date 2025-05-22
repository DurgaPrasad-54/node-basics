const jwt = require('jsonwebtoken');


const verifytoken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).send({ message: 'Token not found' }); 
  }

  jwt.verify(token, 'prasad', (err, decoded) => {
    if (err) {
      return res.status(403).send({ message: 'Invalid or expired token' }); 
    }

    req.user = decoded;
    next();
  });
};


module.exports=verifytoken