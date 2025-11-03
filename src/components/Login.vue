<template>
  <div>
    <h1>登入</h1>
    <form @submit.prevent="login">
      <div>
        <label for="email">電子郵件:</label>
        <input id="email" v-model="form.email" required />
      </div>
      <div>
        <label for="password">密碼:</label>
        <input id="password" type="password" v-model="form.password" required />
      </div>
      <button type="submit">登入</button>
    </form>
    <p v-if="error">{{ error }}</p>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();
const form = ref({
  email: "",
  password: "",
});
const error = ref("");

const login = async () => {
  try {
    const response = await fetch("https://project.r567tw.cc/api/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(form.value),
    });
    if (response.ok) {
      const data = await response.json();
      localStorage.setItem("token", data.token);
      router.push("/");
    } else {
      error.value = "登入失敗";
    }
  } catch (err) {
    error.value = "網路錯誤";
  }
};
</script>

<style scoped>
/* Add styles here */
</style>
