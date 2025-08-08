<template>
  <div>
    <h2>{{ isEdit ? "Edit" : "Add" }} User</h2>
    <form @submit.prevent="handleSubmit">
      <div class="form-group">
        <label for="holot">First Name</label>
        <input type="text" class="form-control" id="holot" v-model="user.HOLOT" required />
      </div>
      <div class="form-group">
        <label for="ten">Last Name</label>
        <input type="text" class="form-control" id="ten" v-model="user.TEN" required />
      </div>
      <div class="form-group">
        <label for="dienthoai">Phone</label>
        <input type="text" class="form-control" id="dienthoai" v-model="user.DIENTHOAI" required />
      </div>
      <div class="form-group">
        <label for="password">Password</label>
        <input type="password" class="form-control" id="password" v-model="user.MATKHAU" :required="!isEdit" />
      </div>
      <button type="submit" class="btn btn-primary">{{ isEdit ? "Update" : "Create" }}</button>
    </form>
  </div>
</template>

<script>
import AdminService from "../../services/admin.service";

export default {
  name: "UserForm",
  props: {
    id: {
      type: String,
      default: null,
    },
  },
  data() {
    return {
      user: {
        HOLOT: "",
        TEN: "",
        DIENTHOAI: "",
        MATKHAU: "",
      },
      isEdit: false,
    };
  },
  created() {
    if (this.id) {
      this.isEdit = true;
      AdminService.getUsers().then((response) => {
        this.user = response.data.find((user) => user._id === this.id);
      });
    }
  },
  methods: {
    handleSubmit() {
      if (this.isEdit) {
        AdminService.updateUser(this.user).then(() => {
          this.$router.push("/admin/users");
        });
      } else {
        AdminService.createUser(this.user).then(() => {
          this.$router.push("/admin/users");
        });
      }
    },
  },
};
</script>
