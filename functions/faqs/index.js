const admin = require("firebase-admin");
const db = admin.firestore();
const router = require("express").Router();

// Utils
let increment=1;
const getDate = () => {
  var offset = -8;
  return new Date( new Date().getTime() + offset * 3600 * 1000).toUTCString().replace( / GMT$/, "" );
};

// Create
router.post("/v2/post", async (req, res) => {
  try {
    const postDATA = await db.collection("faqs").add({
      createdAt: getDate(),
      no: increment,
      ques: req.body.ques,
      solution: req.body.solution,
    });
    increment++;
    return res.status(200).send(postDATA);
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
      createdAt: getDATA.no,
      no: getDATA.no,
      ques: req.body.ques || getDATA.ques,
      solution: req.body.solution || getDATA.solution,
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
    increment--;
    return res.status(200).send(deleteDATA);
  } catch (error) {
    console.log(error);
    return res.status(500).send(error);
  }
});

module.exports = router;
