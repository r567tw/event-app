<template>
  <div class="container">
    <div class="row justify-content-center">
      <div class="col-md-6">
        <div class="mt-5">
          <div class="card shadow">
            <div class="card-body p-4">
              <h1 class="card-title text-center mb-4">登入</h1>
              <form @submit.prevent="login">
                <div class="mb-3">
                  <label for="email" class="form-label">電子郵件</label>
                  <input
                    type="email"
                    class="form-control"
                    id="email"
                    v-model="form.email"
                    required
                    placeholder="請輸入電子郵件"
                  />
                </div>
                <div class="mb-3">
                  <label for="password" class="form-label">密碼</label>
                  <input
                    type="password"
                    class="form-control"
                    id="password"
                    v-model="form.password"
                    required
                    placeholder="請輸入密碼"
                  />
                </div>
                <div class="d-grid">
                  <button type="submit" class="btn btn-primary btn-lg">
                    登入
                  </button>
                </div>
              </form>
              <div v-if="error" class="alert alert-danger mt-3" role="alert">
                {{ error }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, inject } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();
const loginSuccess = inject<() => void>("loginSuccess");
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
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(form.value),
    });
    if (response.ok) {
      const data = await response.json();
      localStorage.setItem("token", data.token);
      // Clear the form after successful login
      form.value.email = "";
      form.value.password = "";
      error.value = "";
      if (loginSuccess) {
        loginSuccess();
      }
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
