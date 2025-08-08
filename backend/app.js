const express = require("express");
const cors = require("cors");
const auth = require("./app/auth/bbm.auth");

const router = require("./app/routes/bbm.route");
const adminRouter = require("./app/routes/bbm.route.admin");

const ApiError = require("./app/api-error");

const app = express();

app.use(cors());
app.use(express.json());

app.post("/login", auth.login);
app.post("/register", auth.createUser);

app.use("/api", auth.checkToken, router);
app.use("/api/admin", auth.checkToken, auth.checkAdmin, adminRouter);

// handle 404 response
app.use((req, nes, next) => {
  return next(new ApiError(404, "Resource not found"));
});

app.use((err, req, res, next) => {
  return res.status(err.statusCode || 500).json({
    message: err.message || "Internal Server Error",
  });
});

module.exports = app;
