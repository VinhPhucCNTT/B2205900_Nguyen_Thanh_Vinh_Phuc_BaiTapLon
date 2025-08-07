const express = require("express");
const bbm = require("../controllers/bbm.controller");

const router = express.Router();

// User / general routes
router.route("/login").post(bbm.loginUser);
router.route("/register").post(bbm.createUser);

router.route("/book").all(bbm.listBooks);

router
  .route("/request")
  .get(bbm.getActiveUserRequests)
  .post(bbm.createRequest)
  .delete(bbm.cancelRequest);

router.route("/history").all(bbm.getUserHistory);

module.exports = router;
