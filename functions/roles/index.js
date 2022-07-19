const admin = require("firebase-admin");
const db = admin.firestore();
const router = require("express").Router();
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');
require('dotenv').config();
const uniqid = require("uniqid");

// Create user
router.post('/v2/register', async (req, res) => {
    const email = req.body.email;
    const _id = uniqid();
    const snapshot = await db.collection('roles').where('email', '==', email).get();
    const docs = [];
    snapshot.forEach(doc => {
        docs.push({ id: doc.id, ...doc.data() });
      });
    if(docs[0]?.email === email){
        res.status(400).send({
            message: "User already exists, please login"
        });
    }else{
        try {
            let password = req.body.password;
            const cpassword = req.body.cpassword;
            const token = jwt.sign({_id: _id}, process.env.SECRET_KEY);
            if(password === cpassword){
                password = await bcrypt.hash(password,10);
                const postDATA = await db.collection('roles').doc(_id).create({
                    password: password,
                    email: req.body.email,
                    name: req.body.name,
                    role: req.body.role,
                    token: [{token:token}],
                    createdAt: new Date()
                });
                res.cookie('jwt',token,{
                    httpOnly: true
                });
                return res.status(200).json({
                    message: "Acc successfully created",
                    token: token
                  });
            }else{
                return res.status(400).json({
                    message: "Passwords do not match",
                  });
            }
            } catch (error) {
                console.log(error);
                return res.status(500).json({
                    message: "Something went wrong",
                  });
            }
    }
});
// login user
router.post('/v2/login', async (req, res) => {
    try {
    let password = req.body.password;
    const email = req.body.email;
    const _id = uniqid();
    const token = jwt.sign({_id: _id}, process.env.SECRET_KEY);
    const snapshot = await db.collection('roles').where('email', '==', email).get();
    const docs = [];
    snapshot.forEach(doc => {
        docs.push({ id: doc.id, ...doc.data() });
      });
    varifyPass = await bcrypt.compare(password, docs[0].password);
    if(varifyPass){
        const document = db.collection('roles').doc(docs[0].id);
        const updateDATA = await document.update({
            password: docs[0].password,
            email: docs[0].email,
            name: docs[0].name,
            role: docs[0].role,
            createdAt: docs[0].createdAt,
            token: docs[0].token.concat({token: token})
        })
        console.log(updateDATA);
        res.cookie('jwt',token,{
            httpOnly: true
        });
        res.status(200).json({
            message: "Login Successful",
            user: [{
                email: docs[0].email,
                name: docs[0].name,
                role: docs[0].role
            }],
            token: token
          });
    }else{
        res.status(404).json({
            message: "invalid credentials",
          });
    }
    return res.status(200).send(docs);
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "invalid",
          });
    }
});



//Update
router.put('/v2/put/:id', async (req, res) => {
    try {
        const document = db.collection('roles').doc(req.params.id);
        const updateDATA = await document.update({
            address: req.body.address,
            city: req.body.city,
            contact: req.body.contact,
            fabricSample: req.body.fabricSample,
            name: req.body.name,
            shopName: req.body.shopName,
            shopVariety: req.body.shopVariety,
            specialisation: req.body.specialisation,
            userImage: req.body.userImage,
            created: new Date(),
        });
        return res.status(200).send(updateDATA);
    } catch (error) {
        console.log(error);
        return res.status(500).send(error);
    }
    });

//Read  alll data
router.get('/v2/get', async (req, res) => {
try {
    const collData = db.collection('roles');
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
router.get('/v2/get/:id', async (req, res) => {
try {
    const document = db.collection('roles').doc(req.params.id);
    const getDoc = await document.get();
    const getDATA = getDoc.data();
    return res.status(200).send(getDATA);
} catch (error) {
    console.log(error);
    return res.status(500).send(error);
}
});


//Delete
router.delete('/v2/delete/:id', async (req, res) => {
try {
    const document = db.collection('roles').doc(req.params.id);
    const deleteDATA = await document.delete();
    return res.status(200).send(deleteDATA);
} catch (error) {
    console.log(error);
    return res.status(500).send(error);
}
});

module.exports = router;