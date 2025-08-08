<template>
  <div>
    <h2>Manage Admins</h2>
    <router-link to="/admin/admins/add" class="btn btn-primary mb-3">Add Admin</router-link>
    <table class="table">
      <thead>
        <tr>
          <th>Name</th>
          <th>Phone</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="admin in admins" :key="admin._id">
          <td>{{ admin.HoTen }}</td>
          <td>{{ admin.SoDienThoai }}</td>
          <td>
            <router-link :to="'/admin/admins/edit/' + admin._id" class="btn btn-warning btn-sm">Edit</router-link>
            <button class="btn btn-danger btn-sm" @click="deleteAdmin(admin._id)">Delete</button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import AdminService from "../../services/admin.service";

export default {
  name: "AdminAdmins",
  data() {
    return {
      admins: [],
    };
  },
  created() {
    this.loadAdmins();
  },
  methods: {
    loadAdmins() {
      AdminService.getAdmins().then((response) => {
        this.admins = response.data;
      });
    },
    deleteAdmin(adminId) {
      if (confirm("Are you sure you want to delete this admin?")) {
        AdminService.deleteAdmin(adminId).then(() => {
          this.loadAdmins();
        });
      }
    },
  },
};
</script>
