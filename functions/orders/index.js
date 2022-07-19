const admin = require("firebase-admin");
const db = admin.firestore();
const router = require("express").Router();
const uniqid = require("uniqid");

// Create
router.post('/v2/post', async (req, res) => {
    try {
        const id = uniqid();
        const postDATA = await db.collection('orders').doc('/' + id + '/')
        .create({
            address: req.body.address,
            RfOrderItem: req.body.RfOrderItem,
            phoneNumber: req.body.phoneNumber,
            prePaymentId: req.body.prePaymentId,
            orderDate: new Date( new Date().getTime() + (-8) * 3600 * 1000).toUTCString().replace( / GMT$/, "" ),
            orderID: id,
            timeline: req.body.timeline,
            currentStatus: req.body.currentStatus,
            commentData: req.body.commentData,
            cancelReason: req.body.cancelReason,
            bookingTime: new Date().getTime(),
            bookingDate: new Date().getDate(),
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
        const document = db.collection('orders').doc(req.params.id);
        const updateDATA = await document.update({
            address: req.body.address,
            RfOrderItem: req.body.RfOrderItem,
            phoneNumber: req.body.phoneNumber,
            prePaymentId: req.body.prePaymentId,
            timeline: req.body.timeline,
            currentStatus: req.body.currentStatus,
            commentData: req.body.commentData,
            cancelReason: req.body.cancelReason,
            bookingTime: req.body.bookingTime,
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
    const collData = db.collection('orders');
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
    const document = db.collection('orders').doc(req.params.id);
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
    const document = db.collection('orders').doc(req.params.id);
    const deleteDATA = await document.delete();
    return res.status(200).send(deleteDATA);
} catch (error) {
    console.log(error);
    return res.status(500).send(error);
}
});

module.exports = router;