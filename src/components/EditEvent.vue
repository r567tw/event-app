<template>
  <div>
    <h1>編輯活動</h1>
    <form @submit.prevent="updateEvent">
      <div>
        <label for="name">名稱:</label>
        <input id="name" v-model="form.name" required />
      </div>
      <div>
        <label for="description">描述:</label>
        <textarea
          id="description"
          v-model="form.description"
          required
        ></textarea>
      </div>
      <div>
        <label for="start_time">開始時間:</label>
        <input
          id="start_time"
          type="datetime"
          v-model="form.start_time"
          required
        />
      </div>
      <div>
        <label for="end_time">結束時間:</label>
        <input id="end_time" type="datetime" v-model="form.end_time" required />
      </div>
      <button type="submit">更新</button>
    </form>
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

const fetchEvent = async () => {
  try {
    const response = await fetch(
      `https://project.r567tw.cc/api/events/${route.params.id}`
    );
    if (response.ok) {
      const data = await response.json();
      const event: Event = data.data || data;
      form.value = {
        name: event.name,
        description: event.description,
        start_time: event.start_time,
        end_time: event.end_time,
      };
    }
  } catch (error) {
    console.error("Error fetching event:", error);
  }
};

const updateEvent = async () => {
  const token = localStorage.getItem("token");
  try {
    const response = await fetch(
      `https://project.r567tw.cc/api/events/${route.params.id}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form.value),
      }
    );
    if (response.ok) {
      router.push(`/events/${route.params.id}`);
    }
  } catch (error) {
    console.error("Error updating event:", error);
  }
};

onMounted(fetchEvent);
</script>

<style scoped>
/* Add styles here */
</style>
