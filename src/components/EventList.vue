<template>
  <div class="container py-4">
    <div class="row">
      <div class="col-12">
        <div class="d-flex justify-content-between align-items-center mb-4">
          <h1 class="h2 mb-0">活動清單</h1>
          <router-link to="/create" class="btn btn-primary">
            <i class="bi bi-plus-circle me-2"></i>新增活動
          </router-link>
        </div>

        <div v-if="loading" class="text-center py-5">
          <div class="spinner-border text-primary" role="status">
            <span class="visually-hidden">載入中...</span>
          </div>
          <p class="mt-2 text-muted">正在載入活動...</p>
        </div>

        <div v-else-if="events.length === 0" class="text-center py-5">
          <i class="bi bi-calendar-x display-1 text-muted mb-3"></i>
          <h3 class="text-muted">目前沒有活動</h3>
          <p class="text-muted">點擊上方按鈕來新增第一個活動</p>
        </div>

        <div v-else class="row">
          <div
            v-for="event in events"
            :key="event.id"
            class="col-md-6 col-lg-4 mb-4"
          >
            <div class="card h-100 shadow-sm">
              <div class="card-body d-flex flex-column">
                <h5 class="card-title">{{ event.name }}</h5>
                <p class="card-text text-muted flex-grow-1">
                  {{ event.description }}
                </p>
                <div class="mt-auto">
                  <small class="text-muted d-block">
                    <i class="bi bi-calendar-event me-1"></i>
                    開始: {{ formatDate(event.start_time) }}
                  </small>
                  <small class="text-muted d-block">
                    <i class="bi bi-calendar-check me-1"></i>
                    結束: {{ formatDate(event.end_time) }}
                  </small>
                </div>
                <div class="mt-3">
                  <router-link
                    :to="`/events/${event.id}`"
                    class="btn btn-outline-primary btn-sm me-2"
                  >
                    查看
                  </router-link>
                  <router-link
                    :to="`/events/${event.id}/attendees`"
                    class="btn btn-outline-secondary btn-sm"
                  >
                    參加者
                  </router-link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";

interface Event {
  id: number;
  name: string;
  description: string;
  start_time: string;
  end_time: string;
}

const events = ref<Event[]>([]);
const loading = ref(true);

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleString("zh-TW", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const fetchEvents = async () => {
  try {
    loading.value = true;
    const response = await fetch("https://project.r567tw.cc/api/events");
    if (response.ok) {
      const data = await response.json();
      events.value = data.data || data;
    }
  } catch (error) {
    console.error("Error fetching events:", error);
  } finally {
    loading.value = false;
  }
};

onMounted(fetchEvents);
</script>

<style scoped>
/* Add styles here */
</style>
