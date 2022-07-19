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
const getMarker = async () => {
  const snapshot = await firebase.firestore().collection("faqs").get();
  return snapshot.docs.map((doc) => doc.data());
};

// Create
router.post("/v2/post", async (req, res) => {
  try {
    const count = await db
      .collection("faqs")
      .get()
      .then((res) => res.size);
    const postDATA = await db.collection("faqs").add({
      createdAt: getDate(),
      no: count + 1,
      ques: req.body.ques,
      solution: req.body.solution,
    });

    return res.status(200).send(
      JSON.stringify({
        message: "FAQ posted successfully",
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
    const prevDoc = db.collection("faqs").doc(req.params.id);
    const queries = await prevDoc.get();
    const getDATA = queries.data();

    const document = db.collection("faqs").doc(req.params.id);
    const updateDATA = await document.update({
      createdAt: getDate(),
      no: getDATA.no,
      ques: req.body.ques || getDATA.ques,
      solution: req.body.solution || getDATA.solution,
    });
    return res.status(200).send(
      JSON.stringify({
        message: "FAQ updated successfully",
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
    const collData = db.collection("faqs");
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
    const document = db.collection("faqs").doc(req.params.id);
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
    const document = db.collection("faqs").doc(req.params.id);
    const deleteDATA = await document.delete();
    return res.status(200).send(
      JSON.stringify({
        messsage: "FAQ is deleted successfully",
        data: deleteDATA,
      })
    );
  } catch (error) {
    console.log(error);
    return res.status(500).send(error);
  }
});

module.exports = router;
