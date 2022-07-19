const jwt = require("jsonwebtoken");
require('dotenv').config();

const isAuthenticated = (req, res, next) => {
  try {
      // const authHeader = req.headers["authorization"] || req.cookies.jwt;
      // const token = authHeader && authHeader.split(" ")[1];
      const cookie = req.cookies.jwt;
      if (!cookie) return res.sendStatus(401);
      const tokenVarify = jwt.verify(cookie,process.env.SECRET_KEY, async (err, user) => {
        if (err) {
          return res.sendStatus(403);
        }
        req.user = user;
        next();
      });
      const snapshot = await db.collection('roles').where('_id', '==', tokenVarify._id).get();
      const docs = [];
      snapshot.forEach(doc => {
          docs.push({ id: doc.id, ...doc.data() });
      });
      req.user = docs[0];
      req.cookie = cookie;
      next()
  } catch (error) {
    res.status(200).send(error)
  }
}

module.exports = isAuthenticated;

