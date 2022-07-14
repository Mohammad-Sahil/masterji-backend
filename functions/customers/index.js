const admin = require("firebase-admin");
const db = admin.firestore();
const router = require("express").Router();

// Create
router.post('/v2/post', async (req, res) => {
    try {
const postDATA = await db.collection('customers').doc('/' + req.body.id + '/')
.create({
    address: req.body.address,
    contactNo: req.body.contactNo,
    name: req.body.name,
    email: req.body.email,
});
        return res.status(200).send(postDATA);
    } catch (error) {
        console.log(error);
        return res.status(500).send(error);
    }
});

//Read  alll data
router.get('/v2/get', async (req, res) => {
try {
    const collData = db.collection('customers');
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
    const document = db.collection('customers').doc(req.params.id);
    const customers = await document.get();
    const getDATA = customers.data();
    return res.status(200).send(getDATA);
} catch (error) {
    console.log(error);
    return res.status(500).send(error);
}
});

//Update
router.put('/v2/put/:id', async (req, res) => {
try {
    const document = db.collection('customers').doc(req.params.id);
    const updateDATA = await document.update({
            address: req.body.address,
            contactNo: req.body.contactNo,
            name: req.body.name,
            email: req.body.email,
    });
    return res.status(200).send(updateDATA);
} catch (error) {
    console.log(error);
    return res.status(500).send(error);
}
});


//Delete
router.delete('/v2/delete/:id', async (req, res) => {
try {
    const document = db.collection('customers').doc(req.params.id);
    const deleteDATA = await document.delete();
    return res.status(200).send(deleteDATA);
} catch (error) {
    console.log(error);
    return res.status(500).send(error);
}
});

module.exports = router;