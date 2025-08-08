<template>
  <div>
    <h2>History</h2>
    <table class="table">
      <thead>
        <tr>
          <th>User</th>
          <th>Book</th>
          <th>Borrow Date</th>
          <th>Return Date</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in history" :key="item._id">
          <td>{{ item.user.TEN }} {{ item.user.HOLOT }}</td>
          <td>{{ item.book.TenSach }}</td>
          <td>{{ new Date(item.NgayMuon).toLocaleDateString() }}</td>
          <td>{{ new Date(item.NgayTra).toLocaleDateString() }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import AdminService from "../../services/admin.service";

export default {
  name: "AdminHistory",
  data() {
    return {
      history: [],
    };
  },
  created() {
    AdminService.getHistory().then((response) => {
      this.history = response.data;
    });
  },
};
</script>
