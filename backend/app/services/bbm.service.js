const { ObjectID } = require("mongodb");

class BBMService {
  constructor(client) {
    this.SACH = client.db().collection("SACH");
    this.NHAXUATBAN = client.db().collection("NHAXUATBAN");
    this.THEODOIMUONSACH = client.db().collection("THEODOIMUONSACH");
    this.NhanVien = client.db().collection("NhanVien");
    // TODO: Check for admin permission!
    this.DOCGIA = client.db().collection("DOCGIA");
  }
}

module.exports = BBMService;
