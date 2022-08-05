const admin = require("firebase-admin");
const db = admin.firestore();
const router = require("express").Router();
const uniqid = require("uniqid");
// Utils
const getDate = () => {
  var offset = -8;
  return new Date(new Date().getTime() + offset * 3600 * 1000)
    .toUTCString()
    .replace(/ GMT$/, "");
};

// Create
router.post("/v2/post", async (req, res) => {
  const id = uniqid();
  try {
    const postDATA = await db.collection("fashionConsultantBooking").doc(id).create({
      amount: req.body.amount,
      bookingDate: req.body.bookingDate,
      bookingId: id,
      bookingTime: req.body.bookingTime,
      consultantId: req.body.consultantId,
      consultantImage: req.body.consultantImage || "",
      consultantName: req.body.consultantName,
      expertise: req.body.expertise,
      orderDate: getDate(),
      paymentId: req.body.paymentId,
      userId: req.body.userId,
    });

    const document = db
    .collection("fashionConsultantBooking")
    .doc(id);
  const getDoc = await document.get();
  const getDATA = getDoc.data();

    return res.status(200).send(
      JSON.stringify({
        message: "Booking done successfully",
        data: getDATA,
        postData: postDATA,
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
    let prevDoc = db
      .collection("fashionConsultantBooking")
      .doc(req.params.id);
    let queries = await prevDoc.get();
    let getDATA = queries.data();

    const document = db
      .collection("fashionConsultantBooking")
      .doc(req.params.id);
    const updateDATA = await document.update({
      amount: req.body.amount || getDATA.amount,
      bookingDate: req.body.bookingDate || getDATA.bookingDate,
      bookingId: getDATA.bookingId,
      bookingTime: req.body.bookingTime || getDATA.bookingTime,
      consultantId: req.body.consultantId || getDATA.consultantId,
      consultantImage: req.body.consultantImage || getDATA.consultantImage,
      consultantName: req.body.consultantName || getDATA.consultantName,
      expertise: req.body.expertise || getDATA.expertise,
      orderDate: getDATA.orderDate,
      paymentId: req.body.paymentId || getDATA.paymentId,
      userId: req.body.userId || getDATA.userId,
    });

    prevDoc = db.collection("fashionConsultantBooking").doc(req.params.id);
    queries = await prevDoc.get();
    getDATA = queries.data();

    getDATA.id=req.params.id;

    return res.status(200).send(
      JSON.stringify({
        message: "Booking details updated sucessfully",
        data: getDATA,
        updateData: updateDATA,
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
    const collData = db.collection("fashionConsultantBooking");
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
    const document = db
      .collection("fashionConsultantBooking")
      .doc(req.params.id);
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
    const document = db
      .collection("fashionConsultantBooking")
      .doc(req.params.id);
    const deleteDATA = await document.delete();
    return res.status(200).send(
      JSON.stringify({
        message: "Booking deleted successfully",
        data: deleteDATA,
      })
    );
  } catch (error) {
    console.log(error);
    return res.status(500).send(error);
  }
});

module.exports = router;
