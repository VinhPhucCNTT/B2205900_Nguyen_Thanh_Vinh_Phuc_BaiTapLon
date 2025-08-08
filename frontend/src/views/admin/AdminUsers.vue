<template>
  <div>
    <h2>Manage Users</h2>
    <router-link to="/admin/users/add" class="btn btn-primary mb-3">Add User</router-link>
    <table class="table">
      <thead>
        <tr>
          <th>Name</th>
          <th>Phone</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="user in users" :key="user._id">
          <td>{{ user.TEN }} {{ user.HOLOT }}</td>
          <td>{{ user.DIENTHOAI }}</td>
          <td>
            <router-link :to="'/admin/users/edit/' + user._id" class="btn btn-warning btn-sm">Edit</router-link>
            <button class="btn btn-danger btn-sm" @click="deleteUser(user._id)">Delete</button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import AdminService from "../../services/admin.service";

export default {
  name: "AdminUsers",
  data() {
    return {
      users: [],
    };
  },
  created() {
    this.loadUsers();
  },
  methods: {
    loadUsers() {
      AdminService.getUsers().then((response) => {
        this.users = response.data;
      });
    },
    deleteUser(userId) {
      if (confirm("Are you sure you want to delete this user?")) {
        AdminService.deleteUser(userId).then(() => {
          this.loadUsers();
        });
      }
    },
  },
};
</script>
