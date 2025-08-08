// Public, for BOTH normal users and admins
const MongoDB = require("../utils/mongodb.util");
const ApiError = require("../api-error");
const BBMService = require("../services/bbm.service");

//IMPLEMENT
// Create a new borrowing request.
// Requests are created with the user's id (id field in req.user) and the book's id (bookid field in req)
// On success, response with the request entry, otherwise call next with ApiError (like below)
exports.createRequest = async (req, res, next) => {
  const userId = req.user.id;
  const { bookid } = req.body;

  if (!bookid) {
    return next(new ApiError(400, "Book ID is required."));
  }

  try {
    const bbmService = new BBMService(MongoDB.client);

    const book = await bbmService.getBookById(bookid);
    if (!book) {
      return next(new ApiError(404, "Book not found."));
    }

    const activeBorrows = await bbmService.countActiveBorrows(bookid);
    if (activeBorrows >= book.SOQUYEN) {
      return next(new ApiError(409, "This book is currently out of stock."));
    }

    const activeRequest = await bbmService.findActiveRequest(userId, bookid);
    if (activeRequest) {
      return next(
        new ApiError(409, "You already have an active request for this book.")
      );
    }

    const request = await bbmService.createRequest(userId, bookid);
    return res.send(request);
  } catch (error) {
    console.log(error);
    return next(
      new ApiError(500, "An error occurred while creating the request.")
    );
  }
};

exports.getUserHistory = async (req, res, next) => {
  const id = req.user.id;
  try {
    const bbmService = new BBMService(MongoDB.client);
    const userHistoryCursor = await bbmService.getHistoryByUserId(id);
    const userHistory = await userHistoryCursor.toArray();
    return res.send(userHistory);
  } catch (error) {
    console.log(error);
    return next(
      new ApiError(400, "An error occured when trying to get user history.")
    );
  }
};

exports.getActiveUserRequests = async (_req, res, next) => {
  try {
    const bbmService = new BBMService(MongoDB.client);
    const activeRequestsCursor = await bbmService.getAllOngoing();
    const activeRequests = await activeRequestsCursor.toArray();
    return res.send(activeRequests);
  } catch (error) {
    console.log(error);
    return next(
      new ApiError(400, "An error occured when trying to get active requests.")
    );
  }
};

exports.listBooks = async (_req, res, next) => {
  try {
    const bbmService = new BBMService(MongoDB.client);
    const booksCursor = await bbmService.listBooks();
    const books = await booksCursor.toArray();
    return res.send(books);
  } catch (error) {
    console.log(error);
    return next(
      new ApiError(400, "An error occured when trying to get books.")
    );
  }
};
