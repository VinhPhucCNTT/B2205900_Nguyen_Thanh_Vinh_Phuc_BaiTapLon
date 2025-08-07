const config = {
  app: {
    port: process.env.PORT || 3000,
  },
  db: {
    uri: process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/btl",
  },
  auth: {
    ACCESS_TOKEN_EXPIRY: "1h",
    ACCESS_TOKEN_SECRET:
      "84LUHADpozU2tY7sNwd0Y4BorFoB5PmQlkvIzzK7aUjYIw7lzEPShUCvZ9p55QLw",
  },
};

module.exports = config;
