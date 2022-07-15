const admin = require("firebase-admin");
const db = admin.firestore();
const router = require("express").Router();

// Create
router.post('/v2/post', async (req, res) => {
    try {
    const postDATA = await db.collection('fashionConsultantBooking')
    .add({
        amount: req.body.amount,
        bookingDate: req.body.bookingDate,
        bookingId: req.body.bookingId,
        bookingTime: req.body.bookingTime,
        consultantId: req.body.consultantId,
        consultantImage: req.body.consultantImage,
        consultantName: req.body.consultantName,
        expertise: req.body.expertise,
        orderDate: new Date(),
        paymentId: req.body.paymentId,
        userId: req.body.userId,
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
        const document = db.collection('fashionConsultantBooking').doc(req.params.id);
        const updateDATA = await document.update({
            amount: req.body.amount,
            bookingDate: req.body.bookingDate,
            bookingId: req.body.bookingId,
            bookingTime: req.body.bookingTime,
            consultantId: req.body.consultantId,
            consultantImage: req.body.consultantImage,
            consultantName: req.body.consultantName,
            expertise: req.body.expertise,
            orderDate: new Date(),
            paymentId: req.body.paymentId,
            userId: req.body.userId,
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
    const collData = db.collection('fashionConsultantBooking');
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
    const document = db.collection('fashionConsultantBooking').doc(req.params.id);
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
    const document = db.collection('fashionConsultantBooking').doc(req.params.id);
    const deleteDATA = await document.delete();
    return res.status(200).send(deleteDATA);
} catch (error) {
    console.log(error);
    return res.status(500).send(error);
}
});

module.exports = router;