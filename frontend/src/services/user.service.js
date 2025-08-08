import axios from "axios";
import authHeader from "./auth-header";

const API_URL = "http://localhost:3000/api/";

class UserService {
  getBooks() {
    return axios.get(API_URL + "/book", { headers: authHeader() });
  }

  borrowBook(bookId) {
    return axios.post(
      API_URL + "/request",
      { bookid: bookId },
      { headers: authHeader() }
    );
  }

  getHistory() {
    return axios.get(API_URL + "/history", { headers: authHeader() });
  }

  getUserInfo() {
    return axios.get(API_URL + "/user", { headers: authHeader() });
  }
}

export default new UserService();
