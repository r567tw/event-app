<script setup lang="ts">
import { ref, onMounted } from "vue";
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

onMounted(checkLogin);
</script>

<template>
  <div id="app">
    <nav>
      <router-link to="/">活動清單</router-link>
      <span v-if="isLoggedIn">
        <router-link to="/create">新增活動</router-link>
        <button @click="logout">登出</button>
      </span>
      <span v-else>
        <router-link to="/login">登入</router-link>
      </span>
    </nav>
    <router-view />
  </div>
</template>

<style scoped>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

nav {
  margin-bottom: 20px;
}

nav a {
  margin: 0 10px;
}
</style>
