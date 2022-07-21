const admin = require("firebase-admin");
const db = admin.firestore();
const jwt = require('jsonwebtoken');
require('dotenv').config();
const router = require("express").Router();


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
            const secret = doc.password + SECRET_KEY;
            const token = jwt.sign(payload, secret, { expiresIn: '15m' });
            const link = `http://localhost:3000/${doc.id}/${token}`;
            console.log(link);
            res.status(200).json({
                message: "Password reset link has been sent to your email"
            });
        }

    } catch (error) {
        res.status(500).send(error);
    }
})

module.exports = router;