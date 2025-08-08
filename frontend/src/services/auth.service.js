import axios from "axios";

const API_URL = "http://localhost:3000/";

class AuthService {
  login(user) {
    return axios
      .post(API_URL + "login/", {
        phone: user.phone,
        password: user.password,
        isAdmin: user.isAdmin,
      })
      .then((response) => {
        if (response.data.accessToken) {
          localStorage.setItem("user", JSON.stringify(response.data));
        }
        return response.data;
      });
  }

  logout() {
    localStorage.removeItem("user");
  }
}

export default new AuthService();
