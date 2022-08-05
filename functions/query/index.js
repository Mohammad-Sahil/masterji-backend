const admin = require("firebase-admin");
const db = admin.firestore();
const router = require("express").Router();
const nodemailer = require('nodemailer');
const dotenv = require('dotenv').config()

// Utils
const getDate = () => {
  return new Date();
};

const sendEmail = (email,message,solution) => {
  console.log("code executed");
  let transport = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
    },
    tls : { rejectUnauthorized: false }
  });
  console.log("code executed");
  const mailOptions = {
     
      from: 'hemantbajaj923@gmail.com', 
      to: `${email}`, 
     subject: 'Your Query is Resolved!!!',
      html: `Hello World ${message} ${solution}`,
      // html: `<head><meta content="text/html; charset=utf-8" http-equiv="Content-Type" /><title>Your Query Has Been answered</title> <meta name="description" content="Reset Password Email Template."> <style type="text/css"> a:hover {text-decoration: underline !important;} </style> </head> <body marginheight="0" topmargin="0" marginwidth="0" style="margin: 0px; background-color: #f2f3f8;" leftmargin="0"> <!--100% body table--> <table cellspacing="0" border="0" cellpadding="0" width="100%" bgcolor="#f2f3f8" style="@import url(https://fonts.googleapis.com/css?family=Rubik:300,400,500,700|Open+Sans:300,400,600,700); font-family: Open Sans, sans-serif;"> <tr> <td> <table style="background-color: #f2f3f8; max-width:670px;  margin:0 auto;" width="100%" border="0" align="center" cellpadding="0" cellspacing="0"> <tr> <td style="height:80px;">&nbsp;</td> </tr> <tr> <td style="text-align:center;"><img width="60" src="https://masterji.online/assets/css/logo-masterji.svg" title="logo" alt="logo"/></td></tr> <tr> <td style="height:20px;">&nbsp;</td> </tr> <tr> <td> <table width="95%" border="0" align="center" cellpadding="0" cellspacing="0" style="max-width:670px;background:#fff; border-radius:3px; text-align:center;-webkit-box-shadow:0 6px 18px 0 rgba(0,0,0,.06);-moz-box-shadow:0 6px 18px 0 rgba(0,0,0,.06);box-shadow:0 6px 18px 0 rgba(0,0,0,.06);"> <tr> <td style="height:40px;">&nbsp;</td> </tr> <tr> <td style="padding:0 35px;"> <h1 style="color:#1e1e2d; font-weight:500; margin:0;font-size:32px;font-family:Rubik,sans-serif;">Your Query has been resolved</h1> <span style="display:inline-block; vertical-align:middle; margin:29px 0 26px; border-bottom:1px solid #cecece; width:100px;"></span> <p style="color:#455056; font-size:15px;line-height:24px; margin:0;">Your query ${message} has been resolved}</p> <p style="background:#20e277;text-decoration:none !important; font-weight:500; margin-top:35px; color:#fff;text-transform:uppercase; font-size:14px;padding:10px 24px;display:inline-block;border-radius:50px;">Solution: ${solution}</p> </td> </tr> <p>--- OR ---</p> <tr> <td style="height:40px;">&nbsp;</td> </tr> </table> </td> <tr> <td style="height:20px;">&nbsp;</td> </tr> <tr> <td style="text-align:center;">&nbsp;&nbsp;&nbsp;${link}&nbsp;&nbsp;&nbsp;</td> </tr> <tr> <td style="height:80px;">&nbsp;</td></tr></table></td></tr></table></body></html>`,
      attachments: [ { filename: 'logo-MasterJi.svg', path: 'https://masterji.online/assets/css/logo-masterji.svg' }]
  };
  console.log("code executed");
 transport.sendMail(mailOptions, function(err, info) {
     if (err) {
       console.log(err)
       console.log("code error");
     } else {
       console.log(info)
     }
 });
}

router.post('/resolved', async (req, res) => {
  try {
   
    const id = req.body.id;
    const solution = req.body.solution;
    const document =  db.collection("query").doc(id)
      // .where("email", "==", "yash@gmail.com").get();
      const getDoc = await document.get();
      const getDATA = getDoc.data();
    console.log(getDATA)
    const message = getDATA.message;
    const email = getDATA.email;

    
    // console.log(docs[0].message)
    // const message = snapshot.message;
    
      // const solution = data.solution;
      //mail has to be sent here
      sendEmail(email,message,solution);
    
          res.status(200).json({
              message: "Query is Resolved",
          
          });
      }

  catch (error) {
      res.status(500).send(error);
  }
});

// Create
router.post("/v2/post", async (req, res) => {
  try {
    const postDATA = await db.collection("query").add({
      date: getDate(),
      email: req.body.email,
      message: req.body.message,
      resolved: req.body.resolved,
      updatedAt: getDate(),
    });

    const prevDoc = db.collection("query").doc(postDATA._path.segments[1]);
    const queries = await prevDoc.get();
    const getDATA = queries.data();

    getDATA.id=postDATA._path.segments[1];

    return res.status(200).send(
      JSON.stringify({
        message: "Query posted successfully",
        data: getDATA,
        postDATA: postDATA,
      })
    );
  } catch (error) {
    console.log(error);
    return res.status(500).send(error);
  }
});

//Read  alll data
router.get("/v2/get", async (req, res) => {
  try {
    const collData = db.collection("query");
    collData.get().then((querySnapshot) => {
      const getDATA = [];
      querySnapshot.forEach((doc) => {
        getDATA.push({ id: doc.id, ...doc.data() });
      });
      return res.status(200).send(getDATA);
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send(error);
  }
});

//Read Single data
router.get("/v2/get/:id", async (req, res) => {
  try {
    const document = db.collection("query").doc(req.params.id);
    const queries = await document.get();
    const getDATA = queries.data();
    return res.status(200).send(getDATA);
  } catch (error) {
    console.log(error);
    return res.status(500).send(error);
  }
});

//Update
router.put("/v2/put/:id", async (req, res) => {
  try {
    let prevDoc = db.collection("query").doc(req.params.id);
    let queries = await prevDoc.get();
    let getDATA = queries.data();

    const document = db.collection("query").doc(req.params.id);
    const updateDATA = await document.update({
      email: req.body.email || getDATA.email,
      message: req.body.message || getDATA.message,
      resolved: req.body.resolved,
      updatedAt: getDate(),
      date: getDATA.date,
    });

    prevDoc = db.collection("query").doc(req.params.id);
    queries = await prevDoc.get();
    getDATA = queries.data();
    
    getDATA.id=req.params.id;

    return res.status(200).send(
      JSON.stringify({
        message: "Query updated successfully",
        data: getDATA,
        updateData: updateDATA,
      })
    );
  } catch (error) {
    console.log(error);
    return res.status(500).send(error);
  }
});

//Delete
router.delete("/v2/delete/:id", async (req, res) => {
  try {
    const document = db.collection("query").doc(req.params.id);
    const deleteDATA = await document.delete();
    return res.status(200).send(
      JSON.stringify({
        message: "Query deleted successfully",
        data: deleteDATA,
      })
    );
  } catch (error) {
    console.log(error);
    return res.status(500).send(error);
  }
});

module.exports = router;
