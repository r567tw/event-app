<template>
  <div class="container py-4">
    <div class="row">
      <div class="col-lg-8 mx-auto">
        <div class="mb-3">
          <router-link
            :to="`/events/${$route.params.id}`"
            class="btn btn-outline-secondary"
          >
            <i class="bi bi-arrow-left me-2"></i>返回活動詳情
          </router-link>
        </div>

        <div class="card shadow">
          <div class="card-header bg-warning text-dark">
            <h1 class="card-title h3 mb-0">
              <i class="bi bi-pencil-square me-2"></i>編輯活動
            </h1>
          </div>
          <div class="card-body">
            <div v-if="loading" class="text-center py-4">
              <div class="spinner-border text-warning" role="status">
                <span class="visually-hidden">載入中...</span>
              </div>
              <p class="mt-2 text-muted">正在載入活動資料...</p>
            </div>

            <form v-else @submit.prevent="updateEvent">
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
                <router-link
                  :to="`/events/${$route.params.id}`"
                  class="btn btn-secondary"
                >
                  <i class="bi bi-x-circle me-2"></i>取消
                </router-link>
                <button
                  type="submit"
                  class="btn btn-warning"
                  :disabled="submitting"
                >
                  <span
                    v-if="submitting"
                    class="spinner-border spinner-border-sm me-2"
                    role="status"
                  ></span>
                  <i v-else class="bi bi-check-circle me-2"></i>
                  {{ submitting ? "更新中..." : "更新活動" }}
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
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";

interface Event {
  id: number;
  name: string;
  description: string;
  start_time: string;
  end_time: string;
}

const route = useRoute();
const router = useRouter();
const form = ref({
  name: "",
  description: "",
  start_time: "",
  end_time: "",
});
const loading = ref(true);
const submitting = ref(false);
const error = ref("");
const success = ref("");

const formatDateTimeForInput = (dateString: string) => {
  // 將 "2025-08-26 01:33:34" 轉換為 "2025-08-26T01:33"
  return dateString.replace(" ", "T").substring(0, 16);
};

const fetchEvent = async () => {
  try {
    loading.value = true;
    error.value = "";
    const response = await fetch(
      `https://project.r567tw.cc/api/events/${route.params.id}`
    );
    if (response.ok) {
      const data = await response.json();
      const event: Event = data.data || data;
      form.value = {
        name: event.name,
        description: event.description,
        start_time: formatDateTimeForInput(event.start_time),
        end_time: formatDateTimeForInput(event.end_time),
      };
    } else {
      error.value = "載入活動資料失敗";
    }
  } catch (err) {
    console.error("Error fetching event:", err);
    error.value = "網路錯誤，請稍後再試";
  } finally {
    loading.value = false;
  }
};

const updateEvent = async () => {
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

    const response = await fetch(
      `https://project.r567tw.cc/api/events/${route.params.id}`,
      {
        method: "PATCH",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(submitData),
      }
    );

    if (response.ok) {
      success.value = "活動更新成功！";
      setTimeout(() => {
        router.push(`/events/${route.params.id}`);
      }, 1500);
    } else {
      error.value = "更新失敗，請檢查資料是否正確";
    }
  } catch (err) {
    console.error("Error updating event:", err);
    error.value = "網路錯誤，請稍後再試";
  } finally {
    submitting.value = false;
  }
};

onMounted(fetchEvent);
</script>

<style scoped>
/* Add styles here */
</style>
