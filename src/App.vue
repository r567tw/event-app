<script setup lang="ts">
import { ref, onMounted, provide } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();
const isLoggedIn = ref(false);

const checkLogin = () => {
  isLoggedIn.value = !!localStorage.getItem("token");
};

const logout = () => {
  localStorage.removeItem("token");
  isLoggedIn.value = false;
  router.push("/login");
};

const loginSuccess = () => {
  isLoggedIn.value = true;
};

provide("loginSuccess", loginSuccess);

onMounted(checkLogin);
</script>

<template>
  <div id="app">
    <nav class="navbar navbar-expand-lg navbar-dark bg-primary">
      <div class="container">
        <router-link to="/" class="navbar-brand">活動管理系統</router-link>

        <div class="navbar-nav ms-auto">
          <span v-if="isLoggedIn">
            <router-link to="/" class="nav-link d-inline-block"
              >活動清單</router-link
            >
            <router-link to="/create" class="nav-link d-inline-block"
              >新增活動</router-link
            >
            <button @click="logout" class="btn btn-outline-light ms-2">
              登出
            </button>
          </span>
          <span v-else>
            <router-link to="/login" class="btn btn-outline-light"
              >登入</router-link
            >
          </span>
        </div>
      </div>
    </nav>

    <main class="container mt-4">
      <router-view />
    </main>
  </div>
</template>

<style scoped>
#app {
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  min-height: 100vh;
}

.router-link-active {
  font-weight: bold;
}
</style>
