<template>
  <div>
    <h1>{{ event?.name }}</h1>
    <p>{{ event?.description }}</p>
    <p>開始時間: {{ event?.start_time }}</p>
    <p>結束時間: {{ event?.end_time }}</p>
    <router-link :to="`/events/${$route.params.id}/edit`">編輯</router-link>
    <button @click="deleteEvent">刪除</button>
    <router-link :to="`/events/${$route.params.id}/attendees`"
      >查看參加者</router-link
    >
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

const fetchEvent = async () => {
  try {
    const response = await fetch(
      `https://project.r567tw.cc/api/events/${route.params.id}`
    );
    if (response.ok) {
      const data = await response.json();
      event.value = data.data || data;
    }
  } catch (error) {
    console.error("Error fetching event:", error);
  }
};

const deleteEvent = async () => {
  const token = localStorage.getItem("token"); // 假設 token 存在 localStorage
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
      router.push("/");
    }
  } catch (error) {
    console.error("Error deleting event:", error);
  }
};

onMounted(fetchEvent);
</script>

<style scoped>
/* Add styles here */
</style>
