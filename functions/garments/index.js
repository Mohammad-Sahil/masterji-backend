const admin = require("firebase-admin");
const db = admin.firestore();
const router = require("express").Router();

// Create
router.post("/v2/post", async (req, res) => {
  try {
    const postDATA = await db.collection("garments").add({
      category: req.body.category,
      city: req.body.city,
      garment_details: req.body.garment_details,
      stitching_category: req.body.stitching_category,
    });

    const prevDoc = db.collection("garments").doc(postDATA._path.segments[1]);
    const queries = await prevDoc.get();
    const getDATA = queries.data();

    getDATA.id=postDATA._path.segments[1];


    return res.status(200).send(
      JSON.stringify({
        message: "Garment details posted successfully",
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
    let prevDoc = db.collection("garments").doc(req.params.id);
    let queries = await prevDoc.get();
    let getDATA = queries.data();
    
    const document = db.collection("garments").doc(req.params.id);
    const updateDATA = await document.update({
      category: req.body.category || getDATA.category,
      city: req.body.city || getDATA.city,
      garment_details: req.body.garment_details || getDATA.garment_details,
      stitching_category:
        req.body.stitching_category || getDATA.stitching_category,
    });

    prevDoc = db.collection("garments").doc(req.params.id);
    queries = await prevDoc.get();
    getDATA = queries.data();

    getDATA.id=req.params.id;


    return res.status(200).send(
      JSON.stringify({
        message: "Garment details updated successfully",
        data: getDATA,
        updateData: updateDATA,
      })
    );
  } catch (error) {
    console.log(error);
    return res.status(500).send(error);
  }
});

//Read  all data
router.get("/v2/get", async (req, res) => {
  try {
    const collData = db.collection("garments");
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
    const document = db.collection("garments").doc(req.params.id);
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
    const document = db.collection("garments").doc(req.params.id);
    const deleteDATA = await document.delete();
    return res.status(200).send(
      JSON.stringify({
        message: "Garment details deleted successfully",
        data: deleteDATA,
      })
    );
  } catch (error) {
    console.log(error);
    return res.status(500).send(error);
  }
});

module.exports = router;