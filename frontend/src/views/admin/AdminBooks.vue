<template>
  <div>
    <h2>Manage Books</h2>
    <router-link to="/admin/books/add" class="btn btn-primary mb-3">Add Book</router-link>
    <table class="table">
      <thead>
        <tr>
          <th>Title</th>
          <th>Author</th>
          <th>Quantity</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="book in books" :key="book._id">
          <td>{{ book.TenSach }}</td>
          <td>{{ book.TacGia }}</td>
          <td>{{ book.SoQuyen }}</td>
          <td>
            <router-link :to="'/admin/books/edit/' + book._id" class="btn btn-warning btn-sm">Edit</router-link>
            <button class="btn btn-danger btn-sm" @click="deleteBook(book._id)">Delete</button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import AdminService from "../../services/admin.service";

export default {
  name: "AdminBooks",
  data() {
    return {
      books: [],
    };
  },
  created() {
    this.loadBooks();
  },
  methods: {
    loadBooks() {
      AdminService.getBooks().then((response) => {
        this.books = response.data;
      });
    },
    deleteBook(bookId) {
      if (confirm("Are you sure you want to delete this book?")) {
        AdminService.deleteBook(bookId).then(() => {
          this.loadBooks();
        });
      }
    },
  },
};
</script>
