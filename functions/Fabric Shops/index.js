const admin = require("firebase-admin");
const db = admin.firestore();
const router = require("express").Router();

// Create
router.post('/v2/post', async (req, res) => {
    try {
const postDATA = await db.collection('fabricShops')
.add({
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
        return res.status(200).send(postDATA);
    } catch (error) {
        console.log(error);
        return res.status(500).send(error);
    }
});

//Update
router.put('/v2/put/:id', async (req, res) => {
    try {
        const document = db.collection('fabricShops').doc(req.params.id);
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
    const collData = db.collection('fabricShops');
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
    const document = db.collection('fabricShops').doc(req.params.id);
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
    const document = db.collection('fabricShops').doc(req.params.id);
    const deleteDATA = await document.delete();
    return res.status(200).send(deleteDATA);
} catch (error) {
    console.log(error);
    return res.status(500).send(error);
}
});

module.exports = router;