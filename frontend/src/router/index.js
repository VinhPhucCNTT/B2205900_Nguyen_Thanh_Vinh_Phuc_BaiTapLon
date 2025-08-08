import { createRouter, createWebHistory } from "vue-router";
import Login from "../views/Login.vue";
import UserDashboard from "../views/UserDashboard.vue";
import AdminDashboard from "../views/AdminDashboard.vue";
import NotFound from "../views/NotFound.vue";
import AdminRequests from "../views/admin/AdminRequests.vue";
import AdminHistory from "../views/admin/AdminHistory.vue";
import AdminUsers from "../views/admin/AdminUsers.vue";
import AdminAdmins from "../views/admin/AdminAdmins.vue";
import AdminBooks from "../views/admin/AdminBooks.vue";
import UserForm from "../views/admin/UserForm.vue";
import AdminForm from "../views/admin/AdminForm.vue";
import BookForm from "../views/admin/BookForm.vue";

const routes = [
  {
    path: "/login",
    name: "Login",
    component: Login,
  },
  {
    path: "/user",
    name: "UserDashboard",
    component: UserDashboard,
  },
  {
    path: "/admin",
    component: AdminDashboard,
    children: [
      {
        path: "",
        name: "AdminRequests",
        component: AdminRequests,
      },
      {
        path: "history",
        name: "AdminHistory",
        component: AdminHistory,
      },
      {
        path: "users",
        name: "AdminUsers",
        component: AdminUsers,
      },
      {
        path: "users/add",
        name: "UserAdd",
        component: UserForm,
      },
      {
        path: "users/edit/:id",
        name: "UserEdit",
        component: UserForm,
        props: true,
      },
      {
        path: "admins",
        name: "AdminAdmins",
        component: AdminAdmins,
      },
      {
        path: "admins/add",
        name: "AdminAdd",
        component: AdminForm,
      },
      {
        path: "admins/edit/:id",
        name: "AdminEdit",
        component: AdminForm,
        props: true,
      },
      {
        path: "books",
        name: "AdminBooks",
        component: AdminBooks,
      },
      {
        path: "books/add",
        name: "BookAdd",
        component: BookForm,
      },
      {
        path: "books/edit/:id",
        name: "BookEdit",
        component: BookForm,
        props: true,
      },
    ],
  },
  {
    path: "/:pathMatch(.*)*",
    name: "NotFound",
    component: NotFound,
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

router.beforeEach((to, from, next) => {
  const publicPages = ["/login"];
  const authRequired = !publicPages.includes(to.path);
  const loggedIn = localStorage.getItem("user");

  if (authRequired && !loggedIn) {
    return next("/login");
  }

  if (loggedIn) {
    const user = JSON.parse(loggedIn);
    if (to.path.startsWith("/admin") && user.role !== "admin") {
      return next("/user");
    }
    if (to.path.startsWith("/user") && user.role !== "user") {
      return next("/admin");
    }
  }

  next();
});

export default router;
