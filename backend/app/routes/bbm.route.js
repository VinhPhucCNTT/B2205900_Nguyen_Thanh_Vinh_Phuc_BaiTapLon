const express = require("express");
const bbm = require("../controllers/bbm.controller");

const router = express.Router();

router.route("/").all((_req, res) => {
  console.log("Working!");
  res.send({ message: "working!" });
});

// User / general routes
router.route("/book").all(bbm.listBooks);

router.route("/request").get(bbm.getActiveUserRequests).post(bbm.createRequest);

router.route("/history").all(bbm.getUserHistory);

module.exports = router;
