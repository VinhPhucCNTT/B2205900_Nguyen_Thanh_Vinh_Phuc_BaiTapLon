const { ObjectId } = require("mongodb");
const bcrypt = require("bcryptjs");

class BBMService {
  constructor(client) {
    this.SACH = client.db().collection("SACH");
    this.NHAXUATBAN = client.db().collection("NHAXUATBAN");
    this.THEODOIMUONSACH = client.db().collection("THEODOIMUONSACH");
    this.NHANVIEN = client.db().collection("NHANVIEN");
    this.DOCGIA = client.db().collection("DOCGIA");
  }

  async checkAdminByID(id) {
    const info = await this.NHANVIEN.findOne({ _id: new ObjectId(id) });
    return !!info;
  }

  async checkAdminByPhone(phone) {
    const info = await this.NHANVIEN.findOne({ SoDienThoai: phone });
    return !!info;
  }

  async checkUserByID(id) {
    const info = await this.DOCGIA.findOne({ _id: new ObjectId(id) });
    return !!info;
  }

  async checkBookByID(id) {
    const info = await this.SACH.findOne({ _id: new ObjectId(id) });
    return !!info;
  }

  async getBookById(id) {
    return await this.SACH.findOne({ _id: new ObjectId(id) });
  }

  async countActiveBorrows(bookId) {
    return await this.THEODOIMUONSACH.countDocuments({
      MaSach: new ObjectId(bookId),
      NGAYTRA: 0,
    });
  }

  async checkUserByPhone(phone) {
    const info = await this.DOCGIA.findOne({ DIENTHOAI: phone });
    return !!info;
  }

  // Finds all ongoing requests
  async getAllOngoing() {
    return await this.THEODOIMUONSACH.find({
      NGAYTRA: 0,
    });
  }

  async findActiveRequest(userId, bookId) {
    return await this.THEODOIMUONSACH.findOne({
      MaDocGia: new ObjectId(userId),
      MaSach: new ObjectId(bookId),
      NGAYTRA: 0,
    });
  }

  // Finds all requests that have been returned
  async getAllHistory() {
    return await this.THEODOIMUONSACH.find({
      NGAYTRA: { $ne: 0 },
    });
  }

  // Finds a specific request that have been returned
  async getHistoryById(id) {
    return await this.THEODOIMUONSACH.find({
      _id: new ObjectId(id),
      NGAYTRA: { $ne: 0 },
    });
  }

  async getHistoryByUserId(userId) {
    return this.THEODOIMUONSACH.find({
      MaDocGia: new ObjectId(userId),
      NGAYTRA: { $ne: 0 },
    });
  }

  // Get a user info entry by phone number
  async getUserByPhone(phone) {
    return await this.DOCGIA.findOne({ DIENTHOAI: phone });
  }

  // Get an admin info entry by phone number
  async getAdminByPhone(phone) {
    return await this.NHANVIEN.findOne({ SoDienThoai: phone });
  }

  // Remove / delete undefined fields in an object
  removeUndefined(info) {
    const temp = info;
    Object.keys(temp).forEach(
      (key) => info[key] === undefined && delete info[key]
    );
    return temp;
  }

  // Insert (or replace existing) a user info entry
  async createUser(userInfo) {
    const filteredInfo = this.removeUndefined(userInfo);
    console.log(filteredInfo);
    const result = await this.DOCGIA.findOneAndUpdate(
      filteredInfo,
      { $set: { TEN: filteredInfo.TEN } },
      { upsert: true }
    );
    return result;
  }

  // Insert (or replace existing) an admin info entry
  async createAdmin(adminInfo) {
    const filteredInfo = this.removeUndefined(adminInfo);
    const result = await this.NHANVIEN.findOneAndUpdate(
      filteredInfo,
      { $set: { HoTenNV: filteredInfo.HoTenNV } },
      { upsert: true }
    );
    return result;
  }

  // List all books
  async listBooks() {
    return await this.SACH.find();
  }

  async createRequest(userId, bookId) {
    const request = {
      MaDocGia: new ObjectId(userId),
      MaSach: new ObjectId(bookId),
      NgayMuon: new Date(),
      NgayTra: 0,
    };
    const result = await this.THEODOIMUONSACH.insertOne(request);
    return await this.THEODOIMUONSACH.findOne({ _id: result.insertedId });
  }

  async closeRequest(requestId) {
    const result = await this.THEODOIMUONSACH.findOneAndUpdate(
      { _id: new ObjectId(requestId), NgayTra: 0 },
      { $set: { NgayTra: new Date() } },
      { returnDocument: "after" }
    );
    return result.value;
  }

  async createBook(bookInfo) {
    const { MaNXB, ...rest } = bookInfo;
    const document = {
      ...rest,
      MaNXB: new ObjectId(MaNXB),
    };
    const result = await this.SACH.insertOne(document);
    return await this.SACH.findOne({ _id: result.insertedId });
  }

  async checkPublisherExists(publisherId) {
    const publisher = await this.NHAXUATBAN.findOne({
      _id: new ObjectId(publisherId),
    });
    return !!publisher;
  }

  async updateBook(bookId, payload) {
    const filter = { _id: new ObjectId(bookId) };
    // If MaNXB is being updated, convert it to ObjectId
    if (payload.MaNXB) {
      payload.MaNXB = new ObjectId(payload.MaNXB);
    }
    const update = { $set: payload };
    const result = await this.SACH.findOneAndUpdate(filter, update, {
      returnDocument: "after",
    });
    return result.value;
  }

  async hasActiveRequestsForBook(bookId) {
    const request = await this.THEODOIMUONSACH.findOne({
      MaSach: new ObjectId(bookId),
      NGAYTRA: 0,
    });
    return !!request;
  }

  async deleteBook(bookId) {
    const result = await this.SACH.findOneAndDelete({
      _id: new ObjectId(bookId),
    });
    return result.value;
  }

  async listUsers() {
    return this.DOCGIA.find({});
  }

  async createNewUser(userInfo) {
    // Hash password before inserting
    userInfo.MATKHAU = bcrypt.hashSync(userInfo.MATKHAU, 8);
    const result = await this.DOCGIA.insertOne(userInfo);
    // Return the created user without the password
    return await this.DOCGIA.findOne(
      { _id: result.insertedId },
      { projection: { MATKHAU: 0 } }
    );
  }

  async updateUser(userId, payload) {
    const filter = { _id: new ObjectId(userId) };
    // If password is being updated, hash it
    if (payload.MATKHAU) {
      payload.MATKHAU = bcrypt.hashSync(payload.MATKHAU, 8);
    }
    const update = { $set: payload };
    const result = await this.DOCGIA.findOneAndUpdate(filter, update, {
      returnDocument: "after",
      projection: { MATKHAU: 0 }, // Exclude password from returned doc
    });
    return result.value;
  }

  async hasActiveRequestsForUser(userId) {
    const request = await this.THEODOIMUONSACH.findOne({
      MaDocGia: new ObjectId(userId),
      NGAYTRA: 0,
    });
    return !!request;
  }

  async deleteUser(userId) {
    const result = await this.DOCGIA.findOneAndDelete({
      _id: new ObjectId(userId),
    });
    return result.value;
  }

  async listAdmins() {
    // Exclude password from the result
    return this.NHANVIEN.find({}, { projection: { Password: 0 } });
  }

  async updateAdmin(adminId, payload) {
    const filter = { _id: new ObjectId(adminId) };
    // Ensure password is not updated
    delete payload.Password;
    const update = { $set: payload };
    const result = await this.NHANVIEN.findOneAndUpdate(filter, update, {
      returnDocument: "after",
      projection: { Password: 0 }, // Exclude password from returned doc
    });
    return result.value;
  }

  async deleteAdmin(adminId) {
    const result = await this.NHANVIEN.findOneAndDelete({
      _id: new ObjectId(adminId),
    });
    return result.value;
  }

  async createNewAdmin(adminInfo) {
    // Hash password before inserting
    adminInfo.Password = bcrypt.hashSync(adminInfo.Password, 8);
    const result = await this.NHANVIEN.insertOne(adminInfo);
    // Return the created admin without the password
    return await this.NHANVIEN.findOne(
      { _id: result.insertedId },
      { projection: { Password: 0 } }
    );
  }
}

module.exports = BBMService;
