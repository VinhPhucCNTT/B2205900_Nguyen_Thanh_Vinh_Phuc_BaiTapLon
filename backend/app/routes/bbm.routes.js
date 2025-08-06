const express = require("express");
const contacts = require("../controllers/contact.controller");

const router = express.Router();

// User / general routes
router.route("/login").post(contacts.login);
router.route("/register").post(contacts.createUser);

router.route("/book").all(contacts.findBooks);

router
  .route("/request")
  .post(contacts.createRequest)
  .delete(contacts.cancelRequest);

router.route("/history").all(contacts.listHistory);

// Admin specific routes
router
  .route("/admin")
  .get(contacts.findRequests)
  .post(contacts.acceptRequest)
  .put(contacts.closeRequest)
  .delete(contacts.cancelRequest);

router.route("/admin/history").all(contacts.listAllHistory);

router
  .route("/admin/book")
  .get(contacts.listAllBooks)
  .post(contacts.updateBook)
  .delete(contacts.deleteBook);

router
  .route("/admin/user")
  .get(contacts.listAllUsers)
  .put(contacts.createUser)
  .post(contacts.updateUser)
  .delete(contacts.deleteUser);

router
  .route("/admin/acc")
  .get(contacts.listAllAdmins)
  .put(contacts.createAdmin)
  .post(contacts.updateAdmin)
  .delete(contacts.deleteAdmin);
