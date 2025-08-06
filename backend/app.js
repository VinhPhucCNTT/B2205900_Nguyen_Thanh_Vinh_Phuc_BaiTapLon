const express = require("express");
const cors = require("cors");
const router = require("./app/routes/bbm.routes");

const app = express();

app.use(cors());
app.use(express.json());
app.get("/", (req, res) => {
  res.json({ message: "Welcome to the Book Borrow Manager!" });
});

app.use("/api/contacts", router);

module.exports = app;
