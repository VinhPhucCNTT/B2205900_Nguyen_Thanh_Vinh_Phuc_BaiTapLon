// Admin EXCLUSIVE
const MongoDB = require("../utils/mongodb.util");
const ApiError = require("../api-error");
const BBMService = require("../services/bbm.service");
const BCrypt = require("bcryptjs");

// Get history of all users.
exports.getAllHistory = async (_req, res, next) => {
  try {
    const bbmService = new BBMService(MongoDB.client);
    const historiesCursor = await bbmService.getAllHistory();
    const histories = await historiesCursor.toArray();
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
    const activeRequestsCursor = await bbmService.getAllOngoing();
    const activeRequests = await activeRequestsCursor.toArray();
    res.send(activeRequests);
  } catch (error) {
    console.log(error);
    return next(
      new ApiError(400, "An error occured when trying to get active requests.")
    );
  }
};

//IMPLEMENT
// Close an ongoing request, book is considered returned
exports.closeRequest = async (req, res, next) => {
  const { id } = req.params;
  if (!id) {
    return next(new ApiError(400, "Request ID is required."));
  }

  try {
    const bbmService = new BBMService(MongoDB.client);
    const closedRequest = await bbmService.closeRequest(id);

    if (!closedRequest) {
      return next(
        new ApiError(404, "Active request not found or already closed.")
      );
    }

    return res.send(closedRequest);
  } catch (error) {
    console.log(error);
    return next(
      new ApiError(500, "An error occurred while closing the request.")
    );
  }
};

//IMPLEMENT
// List books
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

//IMPLEMENT
// Create a new book
exports.createBook = async (req, res, next) => {
  const bookInfo = req.body;

  if (
    !bookInfo.TenSach ||
    !bookInfo.DonGia ||
    !bookInfo.SoQuyen ||
    !bookInfo.NamXuatBan ||
    !bookInfo.MaNXB ||
    !bookInfo.TacGia
  ) {
    return next(new ApiError(400, "All book fields are required."));
  }

  try {
    const bbmService = new BBMService(MongoDB.client);

    const publisherExists = await bbmService.checkPublisherExists(
      bookInfo.MaNXB
    );
    if (!publisherExists) {
      return next(new ApiError(404, "Publisher not found."));
    }

    const newBook = await bbmService.createBook(bookInfo);
    return res.status(201).send(newBook);
  } catch (error) {
    console.log(error);
    return next(new ApiError(500, "An error occurred while creating the book."));
  }
};

//IMPLEMENT
// Update an existing book
exports.updateBook = async (req, res, next) => {
  const { id } = req.params;
  const payload = req.body;

  if (!id) {
    return next(new ApiError(400, "Book ID is required."));
  }
  if (Object.keys(payload).length === 0) {
    return next(new ApiError(400, "Update payload is required."));
  }

  try {
    const bbmService = new BBMService(MongoDB.client);

    // If publisher is being updated, check if it exists
    if (payload.MaNXB) {
      const publisherExists = await bbmService.checkPublisherExists(
        payload.MaNXB
      );
      if (!publisherExists) {
        return next(new ApiError(404, "Publisher not found."));
      }
    }

    const updatedBook = await bbmService.updateBook(id, payload);
    if (!updatedBook) {
      return next(new ApiError(404, "Book not found."));
    }

    return res.send(updatedBook);
  } catch (error) {
    console.log(error);
    return next(
      new ApiError(500, "An error occurred while updating the book.")
    );
  }
};

//IMPLEMENT
// Delete an existing book
exports.deleteBook = async (req, res, next) => {
  const { id } = req.params;

  if (!id) {
    return next(new ApiError(400, "Book ID is required."));
  }

  try {
    const bbmService = new BBMService(MongoDB.client);

    const hasActiveRequests = await bbmService.hasActiveRequestsForBook(id);
    if (hasActiveRequests) {
      return next(
        new ApiError(400, "Cannot delete book with active borrowing requests.")
      );
    }

    const deletedBook = await bbmService.deleteBook(id);
    if (!deletedBook) {
      return next(new ApiError(404, "Book not found."));
    }

    return res.status(204).send();
  } catch (error) {
    console.log(error);
    return next(
      new ApiError(500, "An error occurred while deleting the book.")
    );
  }
};

//IMPLEMENT
// List Users
exports.listUsers = async (_req, res, next) => {
  try {
    const bbmService = new BBMService(MongoDB.client);
    const usersCursor = bbmService.listUsers();
    const users = await usersCursor.toArray();
    return res.send(users);
  } catch (error) {
    console.log(error);
    return next(new ApiError(500, "An error occurred while listing users."));
  }
};

//IMPLEMENT
// Create a new normal user
exports.createUser = async (req, res, next) => {
  const userInfo = req.body;

  // Basic validation from schema
  if (!userInfo.DIENTHOAI || !userInfo.MATKHAU || !userInfo.TEN || !userInfo.HOLOT) {
    return next(
      new ApiError(400, "Phone, password, first name and last name are required.")
    );
  }

  try {
    const bbmService = new BBMService(MongoDB.client);

    const userExists = await bbmService.checkUserByPhone(userInfo.DIENTHOAI);
    if (userExists) {
      return next(
        new ApiError(409, "User with this phone number already exists.")
      );
    }

    const newUser = await bbmService.createNewUser(userInfo);
    return res.status(201).send(newUser);
  } catch (error) {
    console.log(error);
    return next(new ApiError(500, "An error occurred while creating the user."));
  }
};

//IMPLEMENT
// Update an existing user
exports.updateUser = async (req, res, next) => {
  const { id } = req.params;
  const payload = req.body;

  if (!id) {
    return next(new ApiError(400, "User ID is required."));
  }
  if (Object.keys(payload).length === 0) {
    return next(new ApiError(400, "Update payload is required."));
  }

  try {
    const bbmService = new BBMService(MongoDB.client);
    // Prevent updating phone number to one that already exists
    if (payload.DIENTHOAI) {
      const existingUser = await bbmService.getUserByPhone(payload.DIENTHOAI);
      if (existingUser && existingUser._id.toString() !== id) {
        return next(
          new ApiError(409, "Phone number is already in use by another user.")
        );
      }
    }

    const updatedUser = await bbmService.updateUser(id, payload);

    if (!updatedUser) {
      return next(new ApiError(404, "User not found."));
    }

    return res.send(updatedUser);
  } catch (error) {
    console.log(error);
    return next(
      new ApiError(500, "An error occurred while updating the user.")
    );
  }
};

//IMPLEMENT
// Delete an existing user
exports.deleteUser = async (req, res, next) => {
  const { id } = req.params;

  if (!id) {
    return next(new ApiError(400, "User ID is required."));
  }

  try {
    const bbmService = new BBMService(MongoDB.client);

    const hasActiveRequests = await bbmService.hasActiveRequestsForUser(id);
    if (hasActiveRequests) {
      return next(
        new ApiError(400, "Cannot delete user with active borrowing requests.")
      );
    }

    const deletedUser = await bbmService.deleteUser(id);
    if (!deletedUser) {
      return next(new ApiError(404, "User not found."));
    }

    return res.status(204).send();
  } catch (error) {
    console.log(error);
    return next(
      new ApiError(500, "An error occurred while deleting the user.")
    );
  }
};

//IMPLEMENT
// List Admins
exports.listAdmins = async (_req, res, next) => {
  try {
    const bbmService = new BBMService(MongoDB.client);
    const adminsCursor = bbmService.listAdmins();
    const admins = await adminsCursor.toArray();
    return res.send(admins);
  } catch (error) {
    console.log(error);
    return next(new ApiError(500, "An error occurred while listing admins."));
  }
};

//IMPLEMENT
// Update an existing admin user's information (not password)
exports.updateAdmin = async (req, res, next) => {
  const { id } = req.params;
  const payload = req.body;

  if (!id) {
    return next(new ApiError(400, "Admin ID is required."));
  }
  if (Object.keys(payload).length === 0) {
    return next(new ApiError(400, "Update payload is required."));
  }

  try {
    const bbmService = new BBMService(MongoDB.client);
    // Prevent updating phone number to one that already exists
    if (payload.SoDienThoai) {
      const existingAdmin = await bbmService.getAdminByPhone(
        payload.SoDienThoai
      );
      if (existingAdmin && existingAdmin._id.toString() !== id) {
        return next(
          new ApiError(409, "Phone number is already in use by another admin.")
        );
      }
    }

    const updatedAdmin = await bbmService.updateAdmin(id, payload);

    if (!updatedAdmin) {
      return next(new ApiError(404, "Admin not found."));
    }

    return res.send(updatedAdmin);
  } catch (error) {
    console.log(error);
    return next(
      new ApiError(500, "An error occurred while updating the admin.")
    );
  }
};

//IMPLEMENT
// Delete an existing admin user
exports.deleteAdmin = async (req, res, next) => {
  const { id } = req.params;
  const requesterId = req.user.id; // from checkToken middleware

  if (!id) {
    return next(new ApiError(400, "Admin ID is required."));
  }

  if (id === requesterId) {
    return next(new ApiError(403, "Admins cannot delete their own account."));
  }

  try {
    const bbmService = new BBMService(MongoDB.client);
    const deletedAdmin = await bbmService.deleteAdmin(id);

    if (!deletedAdmin) {
      return next(new ApiError(404, "Admin not found."));
    }

    return res.status(204).send();
  } catch (error) {
    console.log(error);
    return next(
      new ApiError(500, "An error occurred while deleting the admin.")
    );
  }
};
