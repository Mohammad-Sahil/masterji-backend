const admin = require("firebase-admin");
const db = admin.firestore();
const router = require("express").Router();

// Create
router.post("/v2/post", async (req, res) => {
  try {
    const postDATA = await db
      .collection("executives")
      .doc(String(req.body.id))
      .set({
        address: req.body.address,
        assignedArea: req.body.assignedArea,
        city: req.body.city,
        email: req.body.email,
        name: req.body.name,
        pincode: req.body.pincode,
        // phoneNumber: req.body.phoneNumber,
        id: req.body.id,
      });
    return res.status(200).send(
      JSON.stringify({
        message: "Executives details added successfully",
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
    const prevDoc = db.collection("executives").doc(req.params.id);
    const queries = await prevDoc.get();
    const getDATA = queries.data();

    const document = db.collection("executives").doc(req.params.id);
    const updateDATA = await document.update({
      id: req.body.id || getDATA.id,
      // phoneNumber: req.body.phoneNumber || getDATA.phoneNumber,
      address: req.body.address || getDATA.address,
      assignedArea: req.body.assignedArea || getDATA.assignedArea,
      city: req.body.city || getDATA.city,
      email: req.body.email || getDATA.email,
      name: req.body.name || getDATA.name,
      pincode: req.body.pincode || getDATA.pincode,
    });
    return res.status(200).send(
      JSON.stringify({
        message: "Executive details updated successfully",
        data: getDATA,
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
    const collData = db.collection("executives");
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

//Read  alll data
router.get("/v2/get-orders/:id", async (req, res) => {
  try {
    const collData = db.collection("orders");
    collData.get().then((querySnapshot) => {
      const getDATA = [];
      querySnapshot.forEach((doc) => {
        getDATA.push({ id: doc.id, ...doc.data() });
      });
      const data = getDATA.filter(
        (order) => order.executiveId === req.params.id
      );
      console.log(data);
      return res.status(200).send(data);
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send(error);
  }
});

//Read Single data
router.get("/v2/get/:id", async (req, res) => {
  try {
    const document = db.collection("executives").doc(req.params.id);
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
    const document = db.collection("executives").doc(req.params.id);
    const deleteDATA = await document.delete();
    return res.status(200).send(
      JSON.stringify({
        message: "Executive details deleted successfully",
        data: deleteDATA,
      })
    );
  } catch (error) {
    console.log(error);
    return res.status(500).send(error);
  }
});

module.exports = router;
