<template>
  <div>
    <h1>新增活動</h1>
    <form @submit.prevent="createEvent">
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
          type="datetime-local"
          v-model="form.start_time"
          required
        />
      </div>
      <div>
        <label for="end_time">結束時間:</label>
        <input
          id="end_time"
          type="datetime-local"
          v-model="form.end_time"
          required
        />
      </div>
      <button type="submit">新增</button>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();
const form = ref({
  name: "",
  description: "",
  start_time: "",
  end_time: "",
});

const createEvent = async () => {
  const token = localStorage.getItem("token");
  try {
    const response = await fetch("https://project.r567tw.cc/api/events", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(form.value),
    });
    if (response.ok) {
      router.push("/");
    }
  } catch (error) {
    console.error("Error creating event:", error);
  }
};
</script>

<style scoped>
/* Add styles here */
</style>
