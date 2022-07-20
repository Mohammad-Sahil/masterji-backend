const jwt = require("jsonwebtoken");
require('dotenv').config();
const admin = require("firebase-admin");
const db = admin.firestore();

const isAuthenticated = async (req, res, next) => {
  try {
      const authHeader = req.headers["authorization"] || req.cookies.jwt;
      const cookie = authHeader;
      // const cookie = req.cookies.jwt;
      if (!cookie) return res.sendStatus(401);
      const tokenVarify = jwt.verify(cookie, process.env.SECRET_KEY);
      const document = db.collection('roles').doc(tokenVarify._id);
      const getDoc = await document.get();
      const getDATA = getDoc.data();
      req.user = getDATA;
      req.cookie = cookie;
      req._id = tokenVarify._id;
      next()
  } catch (error) {
    res.status(200).send(error)
  }
}

module.exports = isAuthenticated;

