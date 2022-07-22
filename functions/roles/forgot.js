const admin = require("firebase-admin");
const db = admin.firestore();
const jwt = require('jsonwebtoken');
require('dotenv').config();
const bcrypt = require("bcrypt");
const router = require("express").Router();
const nodemailer = require('nodemailer');


const sendEmail = (email, link) => {
    let transport = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
          user: process.env.EMAIL_USERNAME,
          pass: process.env.EMAIL_PASSWORD,
        }
     });
     const mailOptions = {
        from: 'hemantbajaj923@gmail.com', 
        to: `${email}`, 
        subject: 'Forgot Password',
        html: `<head><meta content="text/html; charset=utf-8" http-equiv="Content-Type" /><title>Reset Password Email Template</title> <meta name="description" content="Reset Password Email Template."> <style type="text/css"> a:hover {text-decoration: underline !important;} </style> </head> <body marginheight="0" topmargin="0" marginwidth="0" style="margin: 0px; background-color: #f2f3f8;" leftmargin="0"> <!--100% body table--> <table cellspacing="0" border="0" cellpadding="0" width="100%" bgcolor="#f2f3f8" style="@import url(https://fonts.googleapis.com/css?family=Rubik:300,400,500,700|Open+Sans:300,400,600,700); font-family: Open Sans, sans-serif;"> <tr> <td> <table style="background-color: #f2f3f8; max-width:670px;  margin:0 auto;" width="100%" border="0" align="center" cellpadding="0" cellspacing="0"> <tr> <td style="height:80px;">&nbsp;</td> </tr> <tr> <td style="text-align:center;"><img width="60" src="https://masterji.online/assets/css/logo-masterji.svg" title="logo" alt="logo"/></td></tr> <tr> <td style="height:20px;">&nbsp;</td> </tr> <tr> <td> <table width="95%" border="0" align="center" cellpadding="0" cellspacing="0" style="max-width:670px;background:#fff; border-radius:3px; text-align:center;-webkit-box-shadow:0 6px 18px 0 rgba(0,0,0,.06);-moz-box-shadow:0 6px 18px 0 rgba(0,0,0,.06);box-shadow:0 6px 18px 0 rgba(0,0,0,.06);"> <tr> <td style="height:40px;">&nbsp;</td> </tr> <tr> <td style="padding:0 35px;"> <h1 style="color:#1e1e2d; font-weight:500; margin:0;font-size:32px;font-family:Rubik,sans-serif;">You have requested to reset your password</h1> <span style="display:inline-block; vertical-align:middle; margin:29px 0 26px; border-bottom:1px solid #cecece; width:100px;"></span> <p style="color:#455056; font-size:15px;line-height:24px; margin:0;">A unique link to reset your password has been generated for you. To reset your password, click the following button or the link given bellow. </p> <a href=${link} style="background:#20e277;text-decoration:none !important; font-weight:500; margin-top:35px; color:#fff;text-transform:uppercase; font-size:14px;padding:10px 24px;display:inline-block;border-radius:50px;">Reset Password</a> </td> </tr> <p>--- OR ---</p> <tr> <td style="height:40px;">&nbsp;</td> </tr> </table> </td> <tr> <td style="height:20px;">&nbsp;</td> </tr> <tr> <td style="text-align:center;">&nbsp;&nbsp;&nbsp;${link}&nbsp;&nbsp;&nbsp;</td> </tr> <tr> <td style="height:80px;">&nbsp;</td></tr></table></td></tr></table></body></html>`,
        attachments: [ { filename: 'logo-MasterJi.svg', path: 'https://masterji.online/assets/css/logo-masterji.svg' }]
   };
   transport.sendMail(mailOptions, function(err, info) {
       if (err) {
         console.log(err)
       } else {
       }
   });
}


// forgot password
router.post('/password', async (req, res) => {
    try {
        const email = req.body.email;
        const snapshot = await db.collection('roles').where('email', '==', email).get();
        const docs = [];
        snapshot.forEach(doc => {
            docs.push({ id: doc.id, ...doc.data() });
        });
        const doc = docs[0];
        if(email !== doc.email){
            res.status(404).json({
                message: "User not registered, please signup"
            });
        }else{
            const payload = {
                id: doc.id,
                email: doc.email
            }
            const secret = doc.password + process.env.SECRET_KEY;
            const token = jwt.sign(payload, secret, { expiresIn: '15m' });
            const link = `https://stageap.web.app/forgot/${doc.id}/${token}`;
            //mail has to be sent here
            sendEmail(email, link);

            res.status(200).json({
                message: "Password reset link has been sent to your email",
                link: link
            });
        }

    } catch (error) {
        res.status(500).send(error);
    }
});

//reset password
router.get('/:id/:token', async (req, res) => {
    try {
        const { id, token } =  req.params;
        const document = db.collection('roles').doc(id);
        const getDoc = await document.get();
        const getDATA = getDoc.data();
        console.log("This is ID",getDATA)
        if(!getDATA){
            res.status(401).json({
                message: "Invalid Id"
            });
        }else{
            const secret = getDATA.password + process.env.SECRET_KEY;
            const payload = jwt.verify(token, secret);
            if((payload.id === id) && (payload.email === getDATA.email)){
                res.status(200).json({
                    message: "Token has verified"
                });
            }else{
                res.status(200).json({
                    message: "Token has expired"
                });
            }
        }

    } catch (error) {
        res.status(500).send(error);
    }
});

//reset-password
router.post('/reset-password', async (req,res) => {
    try {
        const id = req.body.id;
        const token = req.body.token;
        let newPass = req.body.newPass;
        const document = db.collection('roles').doc(id);
        const getDoc = await document.get();
        const getDATA = getDoc.data();
        if(!getDATA){
            res.status(401).json({
                message: "Invalid Id"
            });
        }else{
            const secret = getDATA.password + process.env.SECRET_KEY;
            console.log('old pass', getDATA.password)
            const payload = jwt.verify(token, secret);
            if((payload.id === id) && (payload.email === getDATA.email)){
                newPass = await bcrypt.hash(newPass, 10);
                console.log('new pass', newPass)
                const updateDATA = await document.update({
                    password: newPass,
                    email: getDATA.email,
                    name: getDATA.name,
                    role: getDATA.role,
                    createdAt: getDATA.createdAt,
                    token: getDATA.token
                });
                res.status(200).json({
                    message: "Password updated"
                });
            }else{
                res.status(401).json({
                    message: "Token has expired"
                });
            }
        }

    } catch (error) {
        res.status(500).send(error);
    }
})

module.exports = router;