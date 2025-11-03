<template>
  <div>
    <h1>參加者</h1>
    <ul>
      <li v-for="attendee in attendees" :key="attendee.id">
        {{ attendee.name }} - {{ attendee.email }}
        <button @click="editAttendee(attendee)">編輯</button>
        <button @click="deleteAttendee(attendee.id)">刪除</button>
      </li>
    </ul>
    <h2>參加活動</h2>
    <form @submit.prevent="joinEvent">
      <div>
        <label for="name">名稱:</label>
        <input id="name" v-model="joinForm.name" required />
      </div>
      <div>
        <label for="email">Email:</label>
        <input id="email" type="email" v-model="joinForm.email" required />
      </div>
      <button type="submit">參加</button>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";

interface Attendee {
  id: number;
  name: string;
  email: string;
}

const route = useRoute();
const attendees = ref<Attendee[]>([]);
const joinForm = ref({
  name: "",
  email: "",
});

const fetchAttendees = async () => {
  const token = localStorage.getItem("token");
  try {
    const response = await fetch(
      `https://project.r567tw.cc/api/events/${route.params.id}/attendees`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    if (response.ok) {
      const result = await response.json();
      attendees.value = result.data || result;
    }
  } catch (error) {
    console.error("Error fetching attendees:", error);
  }
};

const joinEvent = async () => {
  const token = localStorage.getItem("token");
  try {
    const response = await fetch(
      `https://project.r567tw.cc/api/events/${route.params.id}/attendees`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(joinForm.value),
      }
    );
    if (response.ok) {
      fetchAttendees();
      joinForm.value = { name: "", email: "" };
    }
  } catch (error) {
    console.error("Error joining event:", error);
  }
};

const deleteAttendee = async (attendeeId: number) => {
  const token = localStorage.getItem("token");
  try {
    const response = await fetch(
      `https://project.r567tw.cc/api/events/${route.params.id}/attendees/${attendeeId}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    if (response.ok) {
      fetchAttendees();
    }
  } catch (error) {
    console.error("Error deleting attendee:", error);
  }
};

const editAttendee = (attendee: Attendee) => {
  // todo : 編輯功能待實現
  alert(`編輯 ${attendee.name}`);
};

onMounted(fetchAttendees);
</script>

<style scoped>
/* Add styles here */
</style>
