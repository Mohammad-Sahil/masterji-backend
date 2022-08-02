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
    const collData = db.collection("faqs");
    let data = await collData.get().then((querySnapshot) => {
      const getDATA = [];
      querySnapshot.forEach((doc) => {
        getDATA.push({ id: doc.id, ...doc.data() });
      });
      return getDATA;
    });

    data.sort((a, b) => {
      return b.no - a.no;
    });
    var count;
    if (data.length === 0) count = 0;
    else count = data[0].no;

    const postDATA = await db.collection("faqs").add({
      createdAt: getDate(),
      no: req.body.no,
      ques: req.body.ques,
      solution: req.body.solution,
    });

    const prevDoc = db.collection("faqs").doc(postDATA._path.segments[1]);
    const queries = await prevDoc.get();
    const getDATA = queries.data();
    getDATA.id=postDATA._path.segments[1];


    return res.status(200).send(
      JSON.stringify({
        message: "FAQ posted successfully",
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
    let prevDoc = db.collection("faqs").doc(req.params.id);
    let queries = await prevDoc.get();
    let getDATA = queries.data();

    const document = db.collection("faqs").doc(req.params.id);
    const updateDATA = await document.update({
      createdAt: getDATA.createdAt,
      no: req.body.no || getDATA.no,
      ques: req.body.ques || getDATA.ques,
      solution: req.body.solution || getDATA.solution,
    });

    prevDoc = db.collection("faqs").doc(req.params.id);
    queries = await prevDoc.get();
    getDATA = queries.data();

    getDATA.id=req.params.id;


    return res.status(200).send(
      JSON.stringify({
        message: "FAQ updated successfully",
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
        message: "FAQ is deleted successfully",
        data: deleteDATA,
      })
    );
  } catch (error) {
    console.log(error);
    return res.status(500).send(error);
  }
});

module.exports = router;
