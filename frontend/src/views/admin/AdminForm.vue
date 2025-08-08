<template>
  <div>
    <h2>{{ isEdit ? "Edit" : "Add" }} Admin</h2>
    <form @submit.prevent="handleSubmit">
      <div class="form-group">
        <label for="hoten">Name</label>
        <input type="text" class="form-control" id="hoten" v-model="admin.HoTen" required />
      </div>
      <div class="form-group">
        <label for="sodienthoai">Phone</label>
        <input type="text" class="form-control" id="sodienthoai" v-model="admin.SoDienThoai" required />
      </div>
      <div class="form-group">
        <label for="password">Password</label>
        <input type="password" class="form-control" id="password" v-model="admin.Password" :required="!isEdit" />
      </div>
      <button type="submit" class="btn btn-primary">{{ isEdit ? "Update" : "Create" }}</button>
    </form>
  </div>
</template>

<script>
import AdminService from "../../services/admin.service";

export default {
  name: "AdminForm",
  props: {
    id: {
      type: String,
      default: null,
    },
  },
  data() {
    return {
      admin: {
        HoTen: "",
        SoDienThoai: "",
        Password: "",
      },
      isEdit: false,
    };
  },
  created() {
    if (this.id) {
      this.isEdit = true;
      AdminService.getAdmins().then((response) => {
        this.admin = response.data.find((admin) => admin._id === this.id);
      });
    }
  },
  methods: {
    handleSubmit() {
      if (this.isEdit) {
        AdminService.updateAdmin(this.admin).then(() => {
          this.$router.push("/admin/admins");
        });
      } else {
        AdminService.createAdmin(this.admin).then(() => {
          this.$router.push("/admin/admins");
        });
      }
    },
  },
};
</script>
