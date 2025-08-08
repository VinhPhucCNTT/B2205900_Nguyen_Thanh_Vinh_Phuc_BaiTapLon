<template>
  <div>
    <AppHeader />
    <div class="container-fluid">
      <div class="row">
        <div class="col-md-3">
          <div class="list-group">
            <router-link to="/admin" class="list-group-item list-group-item-action">Requests</router-link>
            <router-link to="/admin/history" class="list-group-item list-group-item-action">History</router-link>
            <router-link to="/admin/users" class="list-group-item list-group-item-action">Manage Users</router-link>
            <router-link to="/admin/admins" class="list-group-item list-group-item-action">Manage Admins</router-link>
            <router-link to="/admin/books" class="list-group-item list-group-item-action">Manage Books</router-link>
          </div>
        </div>
        <div class="col-md-9">
          <router-view />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import AppHeader from "../components/AppHeader.vue";

export default {
  name: "AdminDashboard",
  components: {
    AppHeader,
  },
};
</script>