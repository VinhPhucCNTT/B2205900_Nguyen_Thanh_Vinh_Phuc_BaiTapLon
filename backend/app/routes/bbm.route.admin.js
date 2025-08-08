const express = require("express");
const bbm = require("../controllers/bbm.controller.admin");
const auth = require("../auth/bbm.auth");

const router = express.Router();

// Admin specific routes
router.route("/").get(bbm.getAllActiveRequests).post(bbm.closeRequest);

router.route("/history").all(bbm.getAllHistory);

router
  .route("/book")
  .get(bbm.listBooks)
  .put(bbm.createBook)
  .post(bbm.updateBook)
  .delete(bbm.deleteBook);

router
  .route("/user")
  .get(bbm.listUsers)
  .put(bbm.createUser)
  .post(bbm.updateUser)
  .delete(bbm.deleteUser);

router
  .route("/acc")
  .get(bbm.listAdmins)
  .put(auth.createAdmin)
  .post(bbm.updateAdmin)
  .delete(bbm.deleteAdmin);

module.exports = router;
