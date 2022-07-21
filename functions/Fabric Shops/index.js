const admin = require("firebase-admin");
const isAuthenticated = require("../roles/isAuth");
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
    const postDATA = await db.collection("fabricShops").add({
      address: req.body.address,
      city: req.body.city,
      contact: req.body.contact,
      fabricSample: req.body.fabricSample,
      name: req.body.name,
      shopName: req.body.shopName,
      shopVariety: req.body.shopVariety,
      specialisation: req.body.specialisation,
      userImage: req.body.userImage,
      created: getDate(),
    });
    return res.status(200).send(
      JSON.stringify({
        message: "Fabric shop details posted successfully",
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
    const prevDoc = db.collection("fabricShops").doc(req.params.id);
    const queries = await prevDoc.get();
    const getDATA = queries.data();

    const document = db.collection("fabricShops").doc(req.params.id);
    const updateDATA = await document.update({
      address: req.body.address || getDATA.address,
      city: req.body.city || getDATA.city,
      contact: req.body.contact || getDATA.contact,
      fabricSample: req.body.fabricSample || getDATA.fabricSample,
      name: req.body.name || getDATA.name,
      shopName: req.body.shopName || getDATA.shopName,
      shopVariety: req.body.shopVariety || getDATA.shopVariety,
      specialisation: req.body.specialisation || getDATA.specialisation,
      userImage: req.body.userImage || getDATA.userImage,
      created: getDate(),
    });
    return res.status(200).send(
      JSON.stringify({
        message: "Fabric shop details updated successfully",
        data: updateDATA,
      })
    );
  } catch (error) {
    console.log(error);
    return res.status(500).send(error);
  }
});

//Read  alll data
router.get('/v2/get', async (req, res) => {
try {
    const collData = db.collection('fabricShops');
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
    const document = db.collection("fabricShops").doc(req.params.id);
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
    const document = db.collection("fabricShops").doc(req.params.id);
    const deleteDATA = await document.delete();
    return res.status(200).send(
      JSON.stringify({
        message: "Fabric shop details deleted successfully",
        data: deleteDATA,
      })
    );
  } catch (error) {
    console.log(error);
    return res.status(500).send(error);
  }
});

module.exports = router;
