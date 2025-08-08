const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const ApiError = require("../api-error");
const BBMService = require("../services/bbm.service");
const MongoDB = require("../utils/mongodb.util");

exports.login = async (req, res, next) => {
  const { phone, password, isAdmin } = req.body;

  if (!phone || !password) {
    return next(new ApiError(400, "Phone and password are required."));
  }

  try {
    const bbmService = new BBMService(MongoDB.client);
    let user;

    if (isAdmin) {
      user = await bbmService.getAdminByPhone(phone);
    } else {
      user = await bbmService.getUserByPhone(phone);
    }

    if (!user) {
      return next(new ApiError(401, "Invalid credentials."));
    }

    const isPasswordValid = bcrypt.compareSync(password, user.Password || user.MATKHAU);

    if (!isPasswordValid) {
      return next(new ApiError(401, "Invalid credentials."));
    }

    const token = jwt.sign(
      { id: user._id, role: isAdmin ? "admin" : "user" },
      "your-secret-key", // Replace with a strong secret key in a config file
      { expiresIn: 86400 } // 24 hours
    );

    res.status(200).send({
      id: user._id,
      phone: user.SoDienThoai || user.DIENTHOAI,
      role: isAdmin ? "admin" : "user",
      accessToken: token,
    });
  } catch (error) {
    console.log(error);
    return next(new ApiError(500, "An error occurred during login."));
  }
};
