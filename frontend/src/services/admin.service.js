import axios from "axios";
import authHeader from "./auth-header";

const API_URL = "http://localhost:3000/api/admin";

class AdminService {
  getActiveRequests() {
    return axios.get(API_URL + "/", { headers: authHeader() });
  }

  closeRequest(requestId) {
    return axios.post(API_URL + "/", { id: requestId }, { headers: authHeader() });
  }

  getHistory() {
    return axios.get(API_URL + "/history", { headers: authHeader() });
  }

  getUsers() {
    return axios.get(API_URL + "/user", { headers: authHeader() });
  }

  createUser(user) {
    return axios.put(API_URL + "/user", user, { headers: authHeader() });
  }

  updateUser(user) {
    return axios.post(API_URL + `/user`, user, { headers: authHeader() });
  }

  deleteUser(userId) {
    return axios.delete(API_URL + `/user`, { headers: authHeader(), data: { id: userId } });
  }

  getAdmins() {
    return axios.get(API_URL + "/acc", { headers: authHeader() });
  }

  createAdmin(admin) {
    return axios.put(API_URL + "/acc", admin, { headers: authHeader() });
  }

  updateAdmin(admin) {
    return axios.post(API_URL + `/acc`, admin, { headers: authHeader() });
  }

  deleteAdmin(adminId) {
    return axios.delete(API_URL + `/acc`, { headers: authHeader(), data: { id: adminId } });
  }

  getBooks() {
    return axios.get(API_URL + "/book", { headers: authHeader() });
  }

  createBook(book) {
    return axios.put(API_URL + "/book", book, { headers: authHeader() });
  }

  updateBook(book) {
    return axios.post(API_URL + `/book`, book, { headers: authHeader() });
  }

  deleteBook(bookId) {
    return axios.delete(API_URL + `/book`, { headers: authHeader(), data: { id: bookId } });
  }
}

export default new AdminService();
