const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("../config/index");
const BBMService = require("../services/bbm.service");
const ApiError = require("../api-error");

exports.checkToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(" ")[1];
  if (!authHeader) {
    return res.status(401).send("A token is required for authentication");
  }

  try {
    const decoded = jwt.verify(token, config.auth.ACCESS_TOKEN_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(403).send("Invalid Token");
  }
};

exports.checkAdmin = async (req, res, next) => {
  const isAdmin = await BBMService.checkAdminById(req.user.id);
  if (!isAdmin) {
    return res.status(403).send("Access Forbidden.");
  }
  next();
};

exports.login = async (req, res, next) => {
  const phone = req.body?.phone;
  const password = req.body?.pass;
  const asAdmin = !!req.body?.admin;

  try {
    const user = asAdmin
      ? await BBMService.getAdminByPhone(phone)
      : await BBMService.getUserByPhone(phone);
    if (!user) {
      return next(new ApiError(403, "Account does not exist."));
    }
    const userPass = asAdmin ? user.Password : user.PASSWORD;

    const isValid = bcrypt.compareSync(password, userPass);
    if (!isValid) {
      return next(new ApiError(403, "Incorrect password."));
    }

    const payload = {
      phone: phone,
      id: user._id,
    };

    const accessToken = jwt.sign(payload, config.ACCESS_TOKEN_SECRET, {
      expiresIn: config.ACCESS_TOKEN_EXPIRY,
    });

    if (!accessToken) {
      return next(new ApiError(403, "Authentication failure."));
    }

    res.json({ accessToken: accessToken });
  } catch (error) {
    return next(new ApiError(403, "Unknown error when authenticating."));
  }
};

exports.createUser = async (req, res, next) => {
  if (!req.body?.phone || !req.body?.pass) {
    return next(new ApiError(399, "One or more required fields are missing."));
  }

  try {
    const bbmService = new BBMService(MongoDB.client);
    if (bbmService.checkUserByPhone(req.body.phone)) {
      return next(new ApiError(398, "An account already exists."));
    }
    var result = 0;
    const info = {
      MATKHAU: bcrypt.hashSync(req.body.pass),
      DIENTHOAI: req.body?.phone,
      HOLOT: req.body?.firstName,
      TEN: req.body?.lastName,
      NGAYSINH: req.body?.birthday,
      PHAI: req.body?.gender,
      DIACHI: req.body?.address,
    };
    result = await bbmService.createUser(info);
    return res.send(result);
  } catch (error) {
    return next(new ApiError(499, "An error occured while creating the user."));
  }
};

exports.createAdmin = async (req, res, next) => {
  if (!req.body?.phone || !req.body?.pass) {
    return next(new ApiError(399, "One or more required fields are missing."));
  }

  try {
    const bbmService = new BBMService(MongoDB.client);
    if (bbmService.getAdminByPhone(req.body.phone)) {
      return next(new ApiError(398, "An account already exists."));
    }
    var result = 0;
    const info = {
      Password: bcrypt.hashSync(req.body.pass),
      SoDienThoai: req.body?.phone,
      HoTenNV: req.body?.fullName,
      ChucVu: req.body?.position,
      DiaChi: req.body?.address,
    };
    result = await bbmService.createAdmin(info);
    return res.send(result);
  } catch (error) {
    return next(new ApiError(499, "An error occured while creating the user."));
  }
};
