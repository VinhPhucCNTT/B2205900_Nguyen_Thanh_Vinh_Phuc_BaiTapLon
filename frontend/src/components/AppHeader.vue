<template>
  <nav class="navbar navbar-expand navbar-dark bg-dark">
    <router-link to="/" class="navbar-brand">Book Borrowing Manager</router-link>
    <div class="navbar-nav mr-auto">
      <li class="nav-item">
        <router-link v-if="currentUser && currentUser.role === 'user'" to="/user" class="nav-link">User Dashboard</router-link>
      </li>
      <li class="nav-item">
        <router-link v-if="currentUser && currentUser.role === 'admin'" to="/admin" class="nav-link">Admin Dashboard</router-link>
      </li>
    </div>

    <div v-if="!currentUser" class="navbar-nav ml-auto">
      <li class="nav-item">
        <router-link to="/login" class="nav-link">Login</router-link>
      </li>
    </div>

    <div v-if="currentUser" class="navbar-nav ml-auto">
      <li class="nav-item">
        <a class="nav-link" @click.prevent="logOut">Logout</a>
      </li>
    </div>
  </nav>
</template>

<script>
import AuthService from "../services/auth.service";

export default {
  name: "AppHeader",
  data() {
    return {
      currentUser: null,
    };
  },
  created() {
    this.currentUser = JSON.parse(localStorage.getItem("user"));
  },
  methods: {
    logOut() {
      AuthService.logout();
      this.$router.push("/login");
    },
  },
};
</script>