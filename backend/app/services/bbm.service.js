const { ObjectID } = require("mongodb");

class BBMService {
  constructor(client) {
    this.SACH = client.db().collection("SACH");
    this.NHAXUATBAN = client.db().collection("NHAXUATBAN");
    this.THEODOIMUONSACH = client.db().collection("THEODOIMUONSACH");
    this.NhanVien = client.db().collection("NhanVien");
    this.DOCGIA = client.db().collection("DOCGIA");
  }

  // Finds all requests waiting for approval
  async getAllWaiting() {
    return await this.THEODOIMUONSACH.find({
      NGAYTRA: 0,
    });
  }

  // Finds all ongoing requests
  async getAllOngoing() {
    return await this.THEODOIMUONSACH.find({
      NGAYTRA: 1,
    });
  }

  // Finds all requests that have been returned or cancelled
  async getAllHistory() {
    return await this.THEODOIMUONSACH.find({
      NGAYTRA: { $not: 0 },
    });
  }

  async removeUndefined(info) {
    const temp = info;
    Object.keys(temp).forEach(
      (key) => contact[key] === undefined && delete contact[key]
    );
    return temp;
  }

  async cancelRequest(borrowDate) {
    return this.THEODOIMUONSACH.findOneAndDelete({ NGAYMUON: borrowDate });
  }

  async numberExists(phone) {
    return (
      !!(await this.DOCGIA.find({ DIENTHOAI: phone })) ||
      !!(await this.NhanVien.find({ SoDienThoai: phone }))
    );
  }

  async createUser(userInfo) {
    const filteredInfo = this.removeUndefined(userInfo);
    const result = await this.DOCGIA.findOneAndUpdate(filteredInfo, {
      upsert: true,
    });
  }

  async createAdmin(adminInfo) {
    const info = this.removeUndefined(adminInfo);
  }
}

module.exports = BBMService;
