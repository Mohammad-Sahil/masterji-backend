const admin = require("firebase-admin");
const db = admin.firestore();
const router = require("express").Router();
const uniqid = require("uniqid");

// Create
router.post("/v2/post", async (req, res) => {
  try {
    const id = uniqid();
    const postDATA = await db.collection("orders").add({
      address: req.body.address,
      RfOrderItem: req.body.RfOrderItem,
      phoneNumber: req.body.phoneNumber,
      prePaymentId: req.body.prePaymentId,
      orderDate: new Date(),
      orderID: id,
      timeline: req.body.timeline,
      currentStatus: req.body.currentStatus,
      commentData: req.body.commentData,
      cancelReason: req.body.cancelReason,
      bookingTime: new Date().toLocaleTimeString(),
      bookingDate: new Date().toISOString(),
    });
    return res.status(200).send(
      JSON.stringify({
        message: "Order posted successfully",
        data: postDATA,
      })
    );
  } catch (error) {
    console.log(error);
    return res.status(500).send(error);
  }
});

//Update
router.put("/v2/put/:id", async (req, res) => {
  try {
    const prevDoc = db.collection("orders").doc(req.params.id);
    const queries = await prevDoc.get();
    const getDATA = queries.data();

    const document = db.collection("orders").doc(req.params.id);
    const updateDATA = await document.update({
      address: req.body.address|| getDATA.address,
      RfOrderItem: req.body.RfOrderItem|| getDATA.RfOrderItem,
      phoneNumber: req.body.phoneNumber|| getDATA.phoneNumber,
      prePaymentId: req.body.prePaymentId|| getDATA.prePaymentId,
      orderDate: req.body.orderDate || getDATA.orderDate,
      orderID: req.body.orderID || getDATA.orderID,
      timeline: req.body.timeline || getDATA.timeline,
      currentStatus: req.body.currentStatus || getDATA.currentStatus,
      commentData: req.body.commentData || getDATA.commentData,
      cancelReason: req.body.cancelReason || getDATA.cancelReason,
      bookingTime: getDATA.bookingTime,
      bookingDate: getDATA.bookingDate,
    });
    return res.status(200).send(
      JSON.stringify({
        message: "Order details updated successfully",
        data: updateDATA,
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
    const collData = db.collection("orders");
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
    const document = db.collection("orders").doc(req.params.id);
    const getDoc = await document.get();
    const getDATA = getDoc.data();
    return res.status(200).send(getDATA);
  } catch (error) {
    console.log(error);
    return res.status(500).send(error);
  }
});

//Delete
router.delete("/v2/delete/:id", async (req, res) => {
  try {
    const document = db.collection("orders").doc(req.params.id);
    const deleteDATA = await document.delete();
    return res.status(200).send(
      JSON.stringify({
        message: "Order details deleted successfully",
        data: deleteDATA,
      })
    );
  } catch (error) {
    console.log(error);
    return res.status(500).send(error);
  }
});

module.exports = router;
