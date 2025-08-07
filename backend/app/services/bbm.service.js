const { ObjectID } = require("mongodb");

class BBMService {
  constructor(client) {
    this.SACH = client.db().collection("SACH");
    this.NHAXUATBAN = client.db().collection("NHAXUATBAN");
    this.THEODOIMUONSACH = client.db().collection("THEODOIMUONSACH");
    this.NhanVien = client.db().collection("NhanVien");
    this.DOCGIA = client.db().collection("DOCGIA");
  }

  async checkAdminByID(id) {
    const info = this.NhanVien.findOne({ _id: ObjectID(id) });
    return !!info;
  }

  async checkAdminByPhone(phone) {
    const info = this.NhanVien.findOne({ SoDienThoai: phone });
    return !!info;
  }

  async checkUserByID(id) {
    const info = this.DOCGIA.findOne({ _id: ObjectID(id) });
    return !!info;
  }

  async checkUserByPhone(phone) {
    const info = this.DOCGIA.findOne({ DIENTHOAI: phone });
    return !!info;
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

  async getUserByPhone(phone) {
    return await this.DOCGIA.find({ DIENTHOAI: phone });
  }

  async getAdminByPhone(phone) {
    return await this.NhanVien.find({ SoDienThoai: phone });
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

  async createUser(userInfo) {
    const filteredInfo = this.removeUndefined(userInfo);
    const result = await this.DOCGIA.findOneAndUpdate(filteredInfo, {
      upsert: true,
    });
    return result;
  }

  async createAdmin(adminInfo) {
    const filteredInfo = this.removeUndefined(adminInfo);
    const result = await this.NhanVien.findOneAndUpdate(filteredInfo, {
      upsert: true,
    });
    return result;
  }
}

module.exports = BBMService;
