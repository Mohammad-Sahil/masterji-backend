const admin = require("firebase-admin");
const db = admin.firestore();
const router = require("express").Router();

// Create
router.post("/v2/post", async (req, res) => {
  try {
    const postDATA = await db.collection("tailors").add({
      address: req.body.address,
      city: req.body.city,
      email: req.body.email,
      name: req.body.name,
      pincode: req.body.pincode,
      pricing: req.body.pricing,
      speciality: req.body.speciality,
    });

    const prevDoc = db.collection("tailors").doc(postDATA._path.segments[1]);
    const queries = await prevDoc.get();
    const getDATA = queries.data();
    getDATA.id=postDATA._path.segments[1];


    return res.status(200).send(
      JSON.stringify({
        message: "Tailor data posted successfully",
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
    let prevDoc = db.collection("tailors").doc(req.params.id);
    let queries = await prevDoc.get();
    let getDATA = queries.data();

    const document = db.collection("tailors").doc(req.params.id);
    const updateDATA = await document.update({
      address: req.body.address || getDATA.address,
      city: req.body.city || getDATA.city,
      email: req.body.email || getDATA.email,
      name: req.body.name || getDATA.name,
      pincode: req.body.pincode || getDATA.pincode,
      pricing: req.body.pricing || getDATA.pricing,
      speciality: req.body.specialization || getDATA.speciality,
    });


    prevDoc = db.collection("tailors").doc(req.params.id);
    queries = await prevDoc.get();
    getDATA = queries.data();

    getDATA.id=req.params.id;

    return res.status(200).send(
      JSON.stringify({
        message: "Tailor data updated successfully",
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
    const collData = db.collection("tailors");
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

// read tailors in a specific orders 
router.get("/orders/get/:tailorIds", async (req, res) => {
  const tailorIds = req.params.tailorIds;
  try {
    const collData = db.collection("Orders")
    .where("tailorIds", "array-contains", `${tailorIds}`);
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
    const document = db.collection("tailors").doc(req.params.id);
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
    const document = db.collection("tailors").doc(req.params.id);
    const deleteDATA = await document.delete();
    return res.status(200).send(
      JSON.stringify({
        message: "Tailor data deleted successfully",
        data: deleteDATA,
      })
    );
  } catch (error) {
    console.log(error);
    return res.status(500).send(error);
  }
});

module.exports = router;
