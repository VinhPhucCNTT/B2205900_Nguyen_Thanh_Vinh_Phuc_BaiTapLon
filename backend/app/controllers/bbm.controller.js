// Public, for BOTH normal users and admins
const MongoDB = require("../utils/mongodb.util");
const ApiError = require("../api-error");
const BBMService = require("../services/bbm.service");
const BCrypt = require("bcryptjs");

exports.loginUser = async (req, res, next) => {};

exports.getUserHistory = async (req, res, next) => {};

exports.getActiveUserRequests = async (req, res, next) => {
  res.send({ message: "getActiveUserRequests handler." });
};

exports.listBooks = async (_req, res, next) => {
  try {
    const bbmService = new BBMService(MongoDB.client);
    const books = bbmService.getBooks();
    return res.send(books);
  } catch (error) {
    return next(
      new ApiError(400, "An error occured when trying to get books.")
    );
  }
};
