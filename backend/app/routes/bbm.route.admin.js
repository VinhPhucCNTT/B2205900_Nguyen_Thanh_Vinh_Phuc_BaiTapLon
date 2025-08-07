const express = require("express");
const bbm = require("../controllers/bbm.controller.admin");

const router = express.Router();

// Admin specific routes
router
  .route("/")
  .get(bbm.getAllActiveRequests)
  .post(bbm.confirmRequest)
  .put(bbm.closeRequest)
  .delete(bbm.cancelRequest);

router.route("/history").all(bbm.getAllHistory);

router
  .route("/book")
  .get(bbm.listBooks)
  .post(bbm.updateBook)
  .delete(bbm.deleteBook);

router
  .route("/user")
  .get(bbm.listAllUsers)
  .put(bbm.createUser)
  .post(bbm.updateUser)
  .delete(bbm.deleteUser);

router
  .route("/acc")
  .get(bbm.listAdmins)
  .put(bbm.createAdmin)
  .post(bbm.updateAdmin)
  .delete(bbm.deleteAdmin);

module.exports = router;
