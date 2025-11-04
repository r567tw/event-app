<template>
  <div class="container py-4">
    <div v-if="loading" class="text-center py-5">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">載入中...</span>
      </div>
      <p class="mt-2 text-muted">正在載入活動詳情...</p>
    </div>

    <div v-else-if="event" class="row">
      <div class="col-lg-8 mx-auto">
        <div class="mb-3">
          <router-link to="/" class="btn btn-outline-secondary">
            <i class="bi bi-arrow-left me-2"></i>返回活動清單
          </router-link>
        </div>

        <div class="card shadow">
          <div class="card-header bg-primary text-white">
            <h1 class="card-title h3 mb-0">{{ event.name }}</h1>
          </div>
          <div class="card-body">
            <div class="mb-4">
              <h5 class="text-muted mb-3">
                <i class="bi bi-info-circle me-2"></i>活動描述
              </h5>
              <p class="lead">{{ event.description }}</p>
            </div>

            <div class="row mb-4">
              <div class="col-md-6">
                <div class="d-flex align-items-center mb-3">
                  <i class="bi bi-calendar-event text-primary me-3 fs-4"></i>
                  <div>
                    <strong>開始時間</strong><br />
                    <span class="text-muted">{{
                      formatDate(event.start_time)
                    }}</span>
                  </div>
                </div>
              </div>
              <div class="col-md-6">
                <div class="d-flex align-items-center mb-3">
                  <i class="bi bi-calendar-check text-success me-3 fs-4"></i>
                  <div>
                    <strong>結束時間</strong><br />
                    <span class="text-muted">{{
                      formatDate(event.end_time)
                    }}</span>
                  </div>
                </div>
              </div>
            </div>

            <div class="d-flex gap-2 flex-wrap">
              <router-link
                :to="`/events/${$route.params.id}/edit`"
                class="btn btn-warning"
              >
                <i class="bi bi-pencil-square me-2"></i>編輯活動
              </router-link>
              <button @click="showDeleteModal = true" class="btn btn-danger">
                <i class="bi bi-trash me-2"></i>刪除活動
              </button>
              <router-link
                :to="`/events/${$route.params.id}/attendees`"
                class="btn btn-info"
              >
                <i class="bi bi-people me-2"></i>查看參加者
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-else class="text-center py-5">
      <i class="bi bi-exclamation-triangle display-1 text-warning mb-3"></i>
      <h3 class="text-muted">找不到活動</h3>
      <p class="text-muted">該活動可能已被刪除或不存在</p>
      <router-link to="/" class="btn btn-primary">返回活動清單</router-link>
    </div>

    <!-- 刪除確認模態框 -->
    <div
      v-if="showDeleteModal"
      class="modal fade show d-block"
      tabindex="-1"
      style="background-color: rgba(0, 0, 0, 0.5)"
    >
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">確認刪除</h5>
            <button
              type="button"
              class="btn-close"
              @click="showDeleteModal = false"
            ></button>
          </div>
          <div class="modal-body">
            <p>您確定要刪除活動「{{ event?.name }}」嗎？此操作無法撤銷。</p>
          </div>
          <div class="modal-footer">
            <button
              type="button"
              class="btn btn-secondary"
              @click="showDeleteModal = false"
            >
              取消
            </button>
            <button type="button" class="btn btn-danger" @click="confirmDelete">
              確認刪除
            </button>
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
const event = ref<Event | null>(null);
const loading = ref(true);
const showDeleteModal = ref(false);

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleString("zh-TW", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const fetchEvent = async () => {
  try {
    loading.value = true;
    const response = await fetch(
      `https://project.r567tw.cc/api/events/${route.params.id}`
    );
    if (response.ok) {
      const data = await response.json();
      event.value = data.data || data;
    } else if (response.status === 404) {
      event.value = null;
    }
  } catch (error) {
    console.error("Error fetching event:", error);
    event.value = null;
  } finally {
    loading.value = false;
  }
};

const confirmDelete = async () => {
  const token = localStorage.getItem("token");
  if (!token) {
    alert("請先登入");
    return;
  }

  try {
    const response = await fetch(
      `https://project.r567tw.cc/api/events/${route.params.id}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    if (response.ok) {
      showDeleteModal.value = false;
      router.push("/");
    } else {
      alert("刪除失敗");
    }
  } catch (error) {
    console.error("Error deleting event:", error);
    alert("刪除失敗");
  }
};

onMounted(fetchEvent);
</script>

<style scoped>
/* Add styles here */
</style>
