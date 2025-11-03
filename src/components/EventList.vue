<template>
  <div>
    <h1>活動清單</h1>
    <router-link to="/create">新增活動</router-link>
    <ul>
      <li v-for="event in events" :key="event.id">
        <router-link :to="`/events/${event.id}`">{{ event.name }}</router-link>
      </li>
    </ul>
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

const fetchEvents = async () => {
  try {
    const response = await fetch("https://project.r567tw.cc/api/events");
    if (response.ok) {
      const data = await response.json();
      events.value = data.data || data;
    }
  } catch (error) {
    console.error("Error fetching events:", error);
  }
};

onMounted(fetchEvents);
</script>

<style scoped>
/* Add styles here */
</style>
