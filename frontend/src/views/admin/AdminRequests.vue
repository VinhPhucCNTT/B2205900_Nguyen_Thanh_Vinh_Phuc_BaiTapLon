<template>
  <div>
    <h2>Active Requests</h2>
    <table class="table">
      <thead>
        <tr>
          <th>User</th>
          <th>Book</th>
          <th>Borrow Date</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="request in requests" :key="request._id">
          <td>{{ request.user.TEN }} {{ request.user.HOLOT }}</td>
          <td>{{ request.book.TenSach }}</td>
          <td>{{ new Date(request.NgayMuon).toLocaleDateString() }}</td>
          <td>
            <button class="btn btn-success" @click="closeRequest(request._id)">
              Close Request
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import AdminService from "../../services/admin.service";

export default {
  name: "AdminRequests",
  data() {
    return {
      requests: [],
    };
  },
  created() {
    this.loadRequests();
  },
  methods: {
    loadRequests() {
      AdminService.getActiveRequests().then((response) => {
        this.requests = response.data;
      });
    },
    closeRequest(requestId) {
      AdminService.closeRequest(requestId).then(() => {
        this.loadRequests();
      });
    },
  },
};
</script>