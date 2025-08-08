<template>
  <div>
    <h2>{{ isEdit ? "Edit" : "Add" }} Book</h2>
    <form @submit.prevent="handleSubmit">
      <div class="form-group">
        <label for="tensach">Title</label>
        <input type="text" class="form-control" id="tensach" v-model="book.TenSach" required />
      </div>
      <div class="form-group">
        <label for="dongia">Price</label>
        <input type="number" class="form-control" id="dongia" v-model="book.DonGia" required />
      </div>
      <div class="form-group">
        <label for="soquyen">Quantity</label>
        <input type="number" class="form-control" id="soquyen" v-model="book.SoQuyen" required />
      </div>
      <div class="form-group">
        <label for="namxuatban">Year</label>
        <input type="text" class="form-control" id="namxuatban" v-model="book.NamXuatBan" required />
      </div>
      <div class="form-group">
        <label for="manxb">Publisher ID</label>
        <input type="text" class="form-control" id="manxb" v-model="book.MaNXB" required />
      </div>
      <div class="form-group">
        <label for="tacgia">Author</label>
        <input type="text" class="form-control" id="tacgia" v-model="book.TacGia" required />
      </div>
      <button type="submit" class="btn btn-primary">{{ isEdit ? "Update" : "Create" }}</button>
    </form>
  </div>
</template>

<script>
import AdminService from "../../services/admin.service";

export default {
  name: "BookForm",
  props: {
    id: {
      type: String,
      default: null,
    },
  },
  data() {
    return {
      book: {
        TenSach: "",
        DonGia: 0,
        SoQuyen: 0,
        NamXuatBan: "",
        MaNXB: "",
        TacGia: "",
      },
      isEdit: false,
    };
  },
  created() {
    if (this.id) {
      this.isEdit = true;
      AdminService.getBooks().then((response) => {
        this.book = response.data.find((book) => book._id === this.id);
      });
    }
  },
  methods: {
    handleSubmit() {
      if (this.isEdit) {
        AdminService.updateBook(this.book).then(() => {
          this.$router.push("/admin/books");
        });
      } else {
        AdminService.createBook(this.book).then(() => {
          this.$router.push("/admin/books");
        });
      }
    },
  },
};
</script>
