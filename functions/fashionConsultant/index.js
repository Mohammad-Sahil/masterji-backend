const admin = require("firebase-admin");
const db = admin.firestore();
const router = require("express").Router();

// Create
router.post("/v2/post", async (req, res) => {
  try {
    const postDATA = await db.collection("fashionConsultant").add({
      city: req.body.city,
      contact: req.body.contact,
      email: req.body.email,
      expertise: req.body.expertise,
      name:req.body.name,
      rate:req.body.rate,
      // image firebase url
      userImage: "userimage",
      workExperience: req.body.workExperience,
      //worksample images urls
      workSamples: ["work","samples"]
    });
    return res.status(200).send(postDATA);
  } catch (error) {
    console.log(error);
    return res.status(500).send(error);
  }
});

//Update
router.put("/v2/put/:id", async (req, res) => {
  try {
    const prevDoc = db.collection("fashionConsultant").doc(req.params.id);
    const queries = await prevDoc.get();
    const getDATA = queries.data();

    const document = db.collection("fashionConsultant").doc(req.params.id);
    const updateDATA = await document.update({
      city: req.body.city || getDATA.city,
      contact: req.body.contact || getDATA.contact,
      email: req.body.email || getDATA.email,
      expertise: req.body.expertise || getDATA.expertise,
      name:req.body.name || getDATA.name,
      rate:req.body.rate || getDATA.rate,
      // image firebase url
      userImage: "userimage" || getDATA.userImage,
      workExperience: req.body.workExperience || getDATA.workExperience,
      //worksample images urls
      workSamples: ["work","samples"] || getDATA.workSamples
    });
    return res.status(200).send(updateDATA);
  } catch (error) {
    console.log(error);
    return res.status(500).send(error);
  }
});

//Read  alll data
router.get("/v2/get", async (req, res) => {
  try {
    const collData = db.collection("fashionConsultant");
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
    const document = db.collection("fashionConsultant").doc(req.params.id);
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
    const document = db.collection("fashionConsultant").doc(req.params.id);
    const deleteDATA = await document.delete();
    return res.status(200).send(deleteDATA);
  } catch (error) {
    console.log(error);
    return res.status(500).send(error);
  }
});

module.exports = router;
