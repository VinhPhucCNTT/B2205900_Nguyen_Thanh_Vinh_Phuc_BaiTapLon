const config = {
  app: {
    port: process.env.PORT || 3000,
  },
  db: {
    uri: process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/btl",
  },
  auth: {
    SECRET_KEY:
      "fcRIbCIWXJyNtDYULgsPWFwTKM9h58Tj3IXOerH1pqXeyQpGsYvrPMWWp9yjiBpQbeCIpBIEJOgOrFLcehnHXn8IOTIMmz1FOsBG56MLbcOwSqZWULPtlZQ2wf8eqyHp",
  },
};

module.exports = config;
