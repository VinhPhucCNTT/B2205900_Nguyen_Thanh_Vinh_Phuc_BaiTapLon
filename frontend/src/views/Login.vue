<template>
  <div class="container">
    <div class="row justify-content-center">
      <div class="col-md-6">
        <div class="card mt-5">
          <div class="card-header">Login</div>
          <div class="card-body">
            <form @submit.prevent="handleLogin">
              <div class="form-group">
                <label for="phone">Phone Number</label>
                <input type="text" class="form-control" id="phone" v-model="user.phone" required />
              </div>
              <div class="form-group">
                <label for="password">Password</label>
                <input type="password" class="form-control" id="password" v-model="user.password" required />
              </div>
              <div class="form-group form-check">
                <input type="checkbox" class="form-check-input" id="isAdmin" v-model="user.isAdmin" />
                <label class="form-check-label" for="isAdmin">Login as Admin</label>
              </div>
              <button type="submit" class="btn btn-primary btn-block">Login</button>
              <div v-if="message" class="alert alert-danger mt-3">
                {{ message }}
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import AuthService from "../services/auth.service";

export default {
  name: "Login",
  data() {
    return {
      user: {
        phone: "",
        password: "",
        isAdmin: false,
      },
      message: "",
    };
  },
  methods: {
    handleLogin() {
      AuthService.login(this.user).then(
        (response) => {
          if (response.role === "admin") {
            this.$router.push("/admin");
          } else {
            this.$router.push("/user");
          }
        },
        (error) => {
          this.message =
            (error.response &&
              error.response.data &&
              error.response.data.message) ||
            error.message ||
            error.toString();
        }
      );
    },
  },
};
</script>