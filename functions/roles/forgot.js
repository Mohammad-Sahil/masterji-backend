const admin = require("firebase-admin");
const db = admin.firestore();
const jwt = require('jsonwebtoken');
require('dotenv').config();
const bcrypt = require("bcrypt");
const router = require("express").Router();
const nodemailer = require('nodemailer');


const sendEmail = (email, link) => {
    // let transport = nodemailer.createTransport(options[, defaults]);
    let transport = nodemailer.createTransport({
        // service: 'gmail',
        host: 'smtp.mailtrap.io',
        port: 2525,
        secure: true,
        auth: {
          user: process.env.EMAIL_USERNAME,
          pass: process.env.EMAIL_PASSWORD,
        }
     });
     console.log('this code  executed 1')
     const mailOptions = {
        from: 'sahilmejakhas@gmail.com', // Sender address
        to: `${email}`, // List of recipients
        subject: 'Forgot Password', // Subject line
        text: `Hello User, This is your link: ${link}`
        // html: '<h2 style="color:#ff6600;">Hello People!, Welcome to Bacancy!</h2>',
        // attachments: [ { filename: 'logo-MasterJi.svg', path: 'https://masterji.online/assets/css/logo-masterji.svg' }]
   };
   console.log('this code  executed 2')
   transport.sendMail(mailOptions, function(err, info) {
       if (err) {
         console.log(err)
       } else {
         console.log('Email  sent >>>>>', info);
       }
   });
   console.log('this code  executed 3')
   
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