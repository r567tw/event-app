import { createRouter, createWebHistory } from "vue-router";
import EventList from "./components/EventList.vue";
import EventDetail from "./components/EventDetail.vue";
import CreateEvent from "./components/CreateEvent.vue";
import EditEvent from "./components/EditEvent.vue";
import Attendees from "./components/Attendees.vue";
import Login from "./components/Login.vue";

const routes = [
  {
    path: "/",
    name: "EventList",
    component: EventList,
    meta: { requiresAuth: true },
  },
  {
    path: "/events/:id",
    name: "EventDetail",
    component: EventDetail,
    meta: { requiresAuth: true },
  },
  {
    path: "/create",
    name: "CreateEvent",
    component: CreateEvent,
    meta: { requiresAuth: true },
  },
  {
    path: "/events/:id/edit",
    name: "EditEvent",
    component: EditEvent,
    meta: { requiresAuth: true },
  },
  {
    path: "/events/:id/attendees",
    name: "Attendees",
    component: Attendees,
    meta: { requiresAuth: true },
  },
  { path: "/login", name: "Login", component: Login },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, _, next) => {
  const token = localStorage.getItem("token");
  if (to.meta.requiresAuth && !token) {
    next("/login");
  } else {
    next();
  }
});

export default router;
