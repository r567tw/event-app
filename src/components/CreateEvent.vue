<template>
  <div class="container py-4">
    <div class="row">
      <div class="col-lg-8 mx-auto">
        <div class="mb-3">
          <router-link to="/" class="btn btn-outline-secondary">
            <i class="bi bi-arrow-left me-2"></i>返回活動清單
          </router-link>
        </div>

        <div class="card shadow">
          <div class="card-header bg-success text-white">
            <h1 class="card-title h3 mb-0">
              <i class="bi bi-plus-circle me-2"></i>新增活動
            </h1>
          </div>
          <div class="card-body">
            <form @submit.prevent="createEvent">
              <div class="mb-3">
                <label for="name" class="form-label"
                  >活動名稱 <span class="text-danger">*</span></label
                >
                <input
                  type="text"
                  class="form-control"
                  id="name"
                  v-model="form.name"
                  required
                  placeholder="請輸入活動名稱"
                />
              </div>

              <div class="mb-3">
                <label for="description" class="form-label"
                  >活動描述 <span class="text-danger">*</span></label
                >
                <textarea
                  class="form-control"
                  id="description"
                  v-model="form.description"
                  required
                  rows="4"
                  placeholder="請描述活動內容"
                ></textarea>
              </div>

              <div class="row">
                <div class="col-md-6 mb-3">
                  <label for="start_time" class="form-label"
                    >開始時間 <span class="text-danger">*</span></label
                  >
                  <input
                    type="datetime-local"
                    class="form-control"
                    id="start_time"
                    v-model="form.start_time"
                    required
                  />
                </div>
                <div class="col-md-6 mb-3">
                  <label for="end_time" class="form-label"
                    >結束時間 <span class="text-danger">*</span></label
                  >
                  <input
                    type="datetime-local"
                    class="form-control"
                    id="end_time"
                    v-model="form.end_time"
                    required
                  />
                </div>
              </div>

              <div v-if="error" class="alert alert-danger" role="alert">
                <i class="bi bi-exclamation-triangle me-2"></i>{{ error }}
              </div>

              <div v-if="success" class="alert alert-success" role="alert">
                <i class="bi bi-check-circle me-2"></i>{{ success }}
              </div>

              <div class="d-flex gap-2 justify-content-end">
                <router-link to="/" class="btn btn-secondary">
                  <i class="bi bi-x-circle me-2"></i>取消
                </router-link>
                <button
                  type="submit"
                  class="btn btn-success"
                  :disabled="submitting"
                >
                  <span
                    v-if="submitting"
                    class="spinner-border spinner-border-sm me-2"
                    role="status"
                  ></span>
                  <i v-else class="bi bi-plus-circle me-2"></i>
                  {{ submitting ? "新增中..." : "新增活動" }}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import { API_BASE_URL } from "../config";

const router = useRouter();
const form = ref({
  name: "",
  description: "",
  start_time: "",
  end_time: "",
});
const submitting = ref(false);
const error = ref("");
const success = ref("");

const createEvent = async () => {
  const token = localStorage.getItem("token");
  if (!token) {
    error.value = "請先登入";
    return;
  }

  try {
    submitting.value = true;
    error.value = "";
    success.value = "";

    // 將 datetime-local 格式轉換為 API 期望的格式
    const submitData = {
      ...form.value,
      start_time: form.value.start_time.replace("T", " "),
      end_time: form.value.end_time.replace("T", " "),
    };

    const response = await fetch(`${API_BASE_URL}/api/events`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(submitData),
    });

    if (response.ok) {
      success.value = "活動新增成功！";
      // Clear form
      form.value = {
        name: "",
        description: "",
        start_time: "",
        end_time: "",
      };
      setTimeout(() => {
        router.push("/");
      }, 1500);
    } else if (response.status === 401) {
      error.value = "認證失敗，請重新登入";
    } else {
      error.value = "新增失敗，請檢查資料是否正確";
    }
  } catch (err) {
    console.error("Error creating event:", err);
    error.value = "網路錯誤，請稍後再試";
  } finally {
    submitting.value = false;
  }
};
</script>

<style scoped>
/* Add styles here */
</style>
