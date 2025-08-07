// Admin EXCLUSIVE
const MongoDB = require("../utils/mongodb.util");
const ApiError = require("../api-error");
const BBMService = require("../services/bbm.service");
const BCrypt = require("bcryptjs");

// Get history of all users.
exports.getAllHistory = async (_req, res, next) => {
  try {
    const bbmService = new BBMService(MongoDB.client);
    const histories = bbmService.getAllHistory();
    res.send(histories);
  } catch (error) {
    return next(
      new ApiError(400, "An error occured when trying to get history data.")
    );
  }
};

// Get all active requests.
exports.getAllActiveRequests = async (_req, res, next) => {
  try {
    const bbmService = new BBMService(MongoDB.client);
    const activeRequests = bbmService.getAllWaiting();
    res.send(activeRequests);
  } catch (error) {
    return next(
      new ApiError(400, "An error occured when trying to get active requests.")
    );
  }
};

//// Request handlers

// Search for requests
exports.findRequests = async (req, res, next) => {
  res.send({ message: "findRequest handler." });
};

// Create a new request, mark request as waiting
exports.createRequest = async (req, res, next) => {
  res.send({ message: "createRequest handler." });
};

// Confirm an existing request, mark request as ongoing
exports.confirmRequest = async (req, res, next) => {
  res.send({ message: "confirmRequest handler." });
};

// Close an ongoing request, book is returned
exports.closeRequest = async (req, res, next) => {
  res.send({ message: "closeRequest handler." });
};

// Cancel a waiting or ongoing request, book is (assumed) to be returned
exports.cancelRequest = async (req, res, next) => {
  res.send({ message: "cancelRequest handler." });
};

//// Book handlers

// Search for books
exports.findBooks = async (req, res, next) => {
  res.send({ message: "findBook handler." });
};

// Create a new book
exports.createBook = async (req, res, next) => {
  res.send({ message: "createBook handler." });
};

// Update an existing book
exports.updateBook = async (req, res, next) => {
  res.send({ message: "updateBook handler." });
};

// Delete an existing book
exports.deleteBook = async (req, res, next) => {
  res.send({ message: "deleteBook handler." });
};

//// Normal user handlers

// Search for Users
exports.findUsers = async (req, res, next) => {
  res.send({ message: "findUser handler." });
};

// Create a new normal user
exports.createUser = async (req, res, next) => {
  res.send({ message: "createUser handler." });
};

// Update an existing user
exports.updateUser = async (req, res, next) => {
  res.send({ message: "updateUser handler." });
};

// Delete an existing user
exports.deleteUser = async (req, res, next) => {
  res.send({ message: "deleteUser handler." });
};

//// Admin user handlers

// List Admins
exports.listAdmins = async (req, res, next) => {
  res.send({ message: "findAdmin handler." });
};

// Create a new admin user
exports.createAdmin = async (req, res, next) => {
  if (!req.body?.phone || !req.body?.pass) {
    return next(new ApiError(399, "One or more required fields are missing."));
  }

  try {
    const bbmService = new BBMService(MongoDB.client);
    if (bbmService.numberExists(req.body.phone)) {
      return next(new ApiError(399, "An account already exists."));
    }
    var result = 0;
    const info = {
      pass: BCrypt.hashSync(req.body.pass),
      phone: req.body?.phone,
      fullname: req.body?.fullName,
      position: req.body?.position,
      address: req.body?.address,
    };
    result = await bbmService.createAdmin(info);
    return res.send(result);
  } catch (error) {
    return next(new ApiError(499, "An error occured while creating the user."));
  }
};

// Update an existing admin user
exports.updateAdmin = async (req, res, next) => {
  res.send({ message: "updateAdmin handler." });
};

// Delete an existing admin user
exports.deleteAdmin = async (req, res, next) => {
  res.send({ message: "deleteAdmin handler." });
};
