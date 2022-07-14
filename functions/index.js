const functions = require("firebase-functions");
const admin = require("firebase-admin");
const express = require("express");
const cors = require("cors");
const app = express();
const serviceAccount = require("./permissions.json");
// const customers =  ;

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
});

app.use(cors({
    origin: true,
}));


// Route
app.get('/', (req, res) => {
   res.send('<h1> Running....... </h1>');
});

app.use(require('./customers/index.js'));
app.use(require('./Fabric Shops/index.js'));


//Export api to cloud functions
 exports.app = functions.https.onRequest(app);


