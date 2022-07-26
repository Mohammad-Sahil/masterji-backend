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
    const postDATA = await db.collection("query").add({
      date: getDate(),
      email: req.body.email,
      message: req.body.message,
      resolved: req.body.resolved,
      updatedAt: getDate(),
    });

    const prevDoc = db.collection("query").doc(postDATA._path.segments[1]);
    const queries = await prevDoc.get();
    const getDATA = queries.data();

    getDATA.id=postDATA._path.segments[1];

    return res.status(200).send(
      JSON.stringify({
        message: "Query posted successfully",
        data: getDATA,
        postDATA: postDATA,
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
    const collData = db.collection("query");
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
    const document = db.collection("query").doc(req.params.id);
    const queries = await document.get();
    const getDATA = queries.data();
    return res.status(200).send(getDATA);
  } catch (error) {
    console.log(error);
    return res.status(500).send(error);
  }
});

//Update
router.put("/v2/put/:id", async (req, res) => {
  try {
    let prevDoc = db.collection("query").doc(req.params.id);
    let queries = await prevDoc.get();
    let getDATA = queries.data();

    const document = db.collection("query").doc(req.params.id);
    const updateDATA = await document.update({
      email: req.body.email || getDATA.email,
      message: req.body.message || getDATA.message,
      resolved: req.body.resolved,
      updatedAt: getDate(),
      date: getDATA.date,
    });

    prevDoc = db.collection("query").doc(req.params.id);
    queries = await prevDoc.get();
    getDATA = queries.data();
    
    getDATA.id=req.params.id;

    return res.status(200).send(
      JSON.stringify({
        message: "Query updated successfully",
        data: getDATA,
        updateData: updateDATA,
      })
    );
  } catch (error) {
    console.log(error);
    return res.status(500).send(error);
  }
});

//Delete
router.delete("/v2/delete/:id", async (req, res) => {
  try {
    const document = db.collection("query").doc(req.params.id);
    const deleteDATA = await document.delete();
    return res.status(200).send(
      JSON.stringify({
        message: "Query deleted successfully",
        data: deleteDATA,
      })
    );
  } catch (error) {
    console.log(error);
    return res.status(500).send(error);
  }
});

module.exports = router;
