<template>
  <div>
    <AppHeader />
    <div class="container-fluid">
      <div class="row">
        <div class="col-md-8">
          <h2>Available Books</h2>
          <div class="list-group">
            <div
              v-for="book in books"
              :key="book._id"
              class="list-group-item list-group-item-action"
            >
              <div class="d-flex w-100 justify-content-between">
                <h5 class="mb-1">{{ book.TenSach }}</h5>
                <small>By {{ book.TacGia }}</small>
              </div>
              <p class="mb-1">
                {{ book.SoQuyen - book.SoLuongDaMuon }} available
              </p>
              <button
                class="btn btn-primary"
                @click="borrowBook(book._id)"
                :disabled="book.SoQuyen - book.SoLuongDaMuon <= 0"
              >
                Borrow
              </button>
            </div>
          </div>
        </div>
        <div class="col-md-4">
          <h2>User Information</h2>
          <ul class="list-group">
            <li class="list-group-item">
              <strong>First Name:</strong> {{ userInfo.HOLOT }}
            </li>
            <li class="list-group-item">
              <strong>Last Name:</strong> {{ userInfo.TEN }}
            </li>
            <li class="list-group-item">
              <strong>Phone:</strong> {{ userInfo.DIENTHOAI }}
            </li>
          </ul>
          <h2 class="mt-3">Borrowing History</h2>
          <ul class="list-group">
            <li
              v-for="item in history"
              :key="item._id"
              class="list-group-item"
            >
              <strong>{{ item.TenSach }}</strong>
              <br />
              Borrowed on: {{ new Date(item.NgayMuon).toLocaleDateString() }}
              <br />
              Returned on:
              {{
                item.NgayTra
                  ? new Date(item.NgayTra).toLocaleDateString()
                  : "Not returned"
              }}
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import AppHeader from "../components/AppHeader.vue";
import UserService from "../services/user.service";

export default {
  name: "UserDashboard",
  components: {
    AppHeader,
  },
  data() {
    return {
      books: [],
      history: [],
      userInfo: {},
    };
  },
  created() {
    this.loadData();
  },
  methods: {
    loadData() {
      UserService.getBooks().then((response) => {
        this.books = response.data;
      });
      UserService.getHistory().then((response) => {
        this.history = response.data;
      });
      UserService.getUserInfo().then((response) => {
        this.userInfo = response.data;
      });
    },
    borrowBook(bookId) {
      UserService.borrowBook(bookId).then(
        () => {
          this.loadData();
        },
        (error) => {
          alert(error.response.data.message);
        }
      );
    },
  },
};
</script>
