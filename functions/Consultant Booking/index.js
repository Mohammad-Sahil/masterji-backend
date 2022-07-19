const admin = require("firebase-admin");
const db = admin.firestore();
const router = require("express").Router();
// Utils
const getDate = () => {
  var offset = -8;
  return new Date(new Date().getTime() + offset * 3600 * 1000)
    .toUTCString()
    .replace(/ GMT$/, "");
};

// Create
router.post("/v2/post", async (req, res) => {
  try {
    const postDATA = await db.collection("fashionConsultantBooking").add({
      amount: req.body.amount,
      bookingDate: req.body.bookingDate,
      bookingId: req.body.bookingId,
      bookingTime: req.body.bookingTime,
      consultantId: req.body.consultantId,
      consultantImage: req.body.consultantImage,
      consultantName: req.body.consultantName,
      expertise: req.body.expertise,
      orderDate: getDate(),
      paymentId: req.body.paymentId,
      userId: req.body.userId,
    });
    return res.status(200).send(
      JSON.stringify({
        message: "Booking done successfully",
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
    const prevDoc = db
      .collection("fashionConsultantBooking")
      .doc(req.params.id);
    const queries = await prevDoc.get();
    const getDATA = queries.data();

    const document = db
      .collection("fashionConsultantBooking")
      .doc(req.params.id);
    const updateDATA = await document.update({
      amount: req.body.amount || getDATA.amount,
      bookingDate: req.body.bookingDate || getDATA.bookingDate,
      bookingId: req.body.bookingId || getDATA.bookingId,
      bookingTime: req.body.bookingTime || getDATA.bookingTime,
      consultantId: req.body.consultantId || getDATA.consultantId,
      consultantImage: req.body.consultantImage || getDATA.consultantImage,
      consultantName: req.body.consultantName || getDATA.consultantName,
      expertise: req.body.expertise || getDATA.expertise,
      orderDate: getDate(),
      paymentId: req.body.paymentId || getDATA.paymentId,
      userId: req.body.userId || getDATA.userId,
    });
    return res.status(200).send(
      JSON.stringify({
        message: "Booking details updated sucessfully",
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
