const functions = require("firebase-functions");
const admin = require("firebase-admin");
const express = require("express");
const cors = require("cors");
const app = express();
const serviceAccount = require("./permissions.json");
const cookieParser = require('cookie-parser');
const morgan = require('morgan');

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({extended: false})); 
app.use(morgan('dev'));

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

app.use(
  cors({
    origin: true,
  })
);

// Route
app.get("/", (req, res) => {
  res.send("<h1> Running....... </h1>");
});


app.use("/customers", require('./customers/index.js'));
app.use("/fabricshops", require('./Fabric Shops/index.js'));
app.use("/consultantbooking", require('./Consultant Booking/index.js'));
app.use("/fashionConsultant", require('./fashionConsultant/index.js'));
app.use("/query", require('./query/index.js'));
app.use("/faqs", require('./faqs/index.js'));
app.use("/orders", require('./orders/index.js'));
app.use("/garments", require('./garments/index.js'));
app.use("/aboutus", require('./aboutus/index.js'));
app.use("/warehouses", require('./warehouses/index.js'));
app.use("/executives", require('./executives/index.js'));
app.use("/tailors", require('./tailors/index.js'));
app.use("/auth", require('./roles/index.js'));
app.use("/forgot", require('./roles/forgot.js'));


//Export api to cloud functions
exports.app = functions.https.onRequest(app);
