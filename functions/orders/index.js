const admin = require("firebase-admin");
const db = admin.firestore();
const router = require("express").Router();

// Create
router.post("/v2/post", async (req, res) => {
  const id = String(new Date().valueOf());
  console.log("this is id",id)
  try {
    const postDATA = await db.collection("Orders").doc(id).create({
      timeline: req.body.timeline || [],
      executive: req.body.executive || {},
      address: req.body.address,
      bookingDate: req.body.bookingDate || new Date(),
      currentExecutiveName: req.body.currentExecutiveName || "",
      phoneNumber: req.body.phoneNumber,
      RfOrderItem: req.body.RfOrderItem,
      orderDate: req.body.orderDate || new Date(new Date().getTime() + -8 * 3600 * 1000)
        .toUTCString()
        .replace(/ GMT$/, ""),
      pickupDate: req.body.pickupDate,
      commentData: req.body.commentData,
      pickupTime: req.body.pickupTime,
      orderId: id,
      bookingTime: req.body.bookingTime || new Date().getTime(),
      executiveId: req.body.executiveId,
      flatDiscount: req.body.flatDiscount || 0,
      percentDiscount: req.body.percentDiscount || 0,
      name: req.body.name,
      currentBucket: req.body.currentBucket,
      currentStatus: req.body.currentStatus,
      tailorIds: req.body.tailorIds || [],
      prePaymentId: req.body.prePaymentId || null,
      cancelReason: req.body.cancelReason || null,
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
    const prevDoc = db.collection("Orders").doc(req.params.id);
    const queries = await prevDoc.get();
    const getDATA = queries.data();

    const document = db.collection("Orders").doc(req.params.id);
    const updateDATA = await document.update({
      timeline: req.body.timeline || getDATA.timeline,
      executive: req.body.executive || getDATA.executive,
      address: req.body.address || getDATA.address,
      bookingDate: req.body.bookingDate || getDATA.bookingDate,
      currentExecutiveName: req.body.currentExecutiveName || getDATA.currentExecutiveName,
      phoneNumber: req.body.phoneNumber || getDATA.phoneNumber,
      RfOrderItem: req.body.RfOrderItem || getDATA.RfOrderItem,
      orderDate: req.body.orderDate || getDATA.orderDate,
      pickupDate: req.body.pickupDate || getDATA.pickupDate,
      commentData: req.body.commentData || getDATA.commentData,
      pickupTime: req.body.pickupTime || getDATA.pickupTime,
      bookingTime: req.body.bookingTime || getDATA.bookingTime,
      executiveId: req.body.executiveId || getDATA.executiveId,
      flatDiscount: req.body.flatDiscount || getDATA.flatDiscount,
      percentDiscount: req.body.percentDiscount || getDATA.percentDiscount,
      name: req.body.name || getDATA.name,
      currentBucket: req.body.currentBucket || getDATA.currentBucket,
      currentStatus: req.body.currentStatus || getDATA.currentStatus,
      tailorIds: req.body.tailorIds || getDATA.tailorIds,
      prePaymentId: req.body.prePaymentId || getDATA.prePaymentId,
      cancelReason: req.body.cancelReason || getDATA.cancelReason,
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
    const collData = db.collection("Orders");
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
    const document = db.collection("Orders").doc(req.params.id);
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
    const document = db.collection("Orders").doc(req.params.id);
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
