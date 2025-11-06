<template>
  <div class="container py-4">
    <div class="row">
      <div class="col-12">
        <div class="mb-3">
          <router-link :to="`/`" class="me-2 btn btn-outline-secondary">
            <i class="bi bi-arrow-left me-2"></i>返回活動列表
          </router-link>

          <router-link
            :to="`/events/${$route.params.id}`"
            class="btn btn-outline-secondary"
          >
            <i class="bi bi-arrow-left me-2"></i>返回活動詳情
          </router-link>
        </div>

        <div class="row">
          <!-- 參加者列表 -->
          <div class="col-lg-8 mb-4">
            <div class="card shadow">
              <div class="card-header bg-info text-white">
                <h2 class="card-title h4 mb-0">
                  <i class="bi bi-people-fill me-2"></i>參加者列表
                  <span class="badge bg-light text-dark ms-2">{{
                    attendees.length
                  }}</span>
                </h2>
              </div>
              <div class="card-body">
                <div v-if="loading" class="text-center py-4">
                  <div class="spinner-border text-info" role="status">
                    <span class="visually-hidden">載入中...</span>
                  </div>
                  <p class="mt-2 text-muted">正在載入參加者...</p>
                </div>

                <div v-else-if="!isLoggedIn" class="text-center py-4">
                  <i class="bi bi-shield-lock display-1 text-muted mb-3"></i>
                  <h5 class="text-muted">請先登入以查看參加者名單</h5>
                </div>

                <div
                  v-else-if="attendees.length === 0"
                  class="text-center py-4"
                >
                  <i class="bi bi-people display-1 text-muted mb-3"></i>
                  <h5 class="text-muted">目前沒有參加者</h5>
                  <p class="text-muted">鼓勵朋友們來參加這個活動！</p>
                </div>

                <div v-else>
                  <div class="list-group list-group-flush">
                    <div
                      v-for="attendee in attendees"
                      :key="attendee.id"
                      class="list-group-item d-flex justify-content-between align-items-center"
                    >
                      <div>
                        <strong>{{ attendee.name }}</strong>
                        <br />
                        <small class="text-muted">{{ attendee.email }}</small>
                      </div>
                      <div class="btn-group btn-group-sm" role="group">
                        <button
                          @click="editAttendee(attendee)"
                          class="btn btn-outline-primary"
                          title="編輯參加者"
                        >
                          <i class="bi bi-pencil"></i>
                          編輯
                        </button>
                        <button
                          @click="showDeleteModal(attendee)"
                          class="btn btn-outline-danger"
                          title="移除參加者"
                        >
                          <i class="bi bi-trash"></i>
                          取消報名
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- 參加活動表單 -->
          <div class="col-lg-4">
            <div class="card shadow">
              <div class="card-header bg-success text-white">
                <h2 class="card-title h4 mb-0">
                  <i class="bi bi-person-plus me-2"></i>參加活動
                </h2>
              </div>
              <div class="card-body">
                <form @submit.prevent="joinEvent">
                  <div class="mb-3">
                    <label for="name" class="form-label"
                      >姓名 <span class="text-danger">*</span></label
                    >
                    <input
                      type="text"
                      class="form-control"
                      id="name"
                      v-model="joinForm.name"
                      required
                      placeholder="請輸入您的姓名"
                    />
                  </div>
                  <div class="mb-3">
                    <label for="email" class="form-label"
                      >電子郵件 <span class="text-danger">*</span></label
                    >
                    <input
                      type="email"
                      class="form-control"
                      id="email"
                      v-model="joinForm.email"
                      required
                      placeholder="請輸入您的電子郵件"
                    />
                  </div>

                  <div
                    v-if="joinError"
                    class="alert alert-danger py-2"
                    role="alert"
                  >
                    <small
                      ><i class="bi bi-exclamation-triangle me-1"></i
                      >{{ joinError }}</small
                    >
                  </div>

                  <div
                    v-if="joinSuccess"
                    class="alert alert-success py-2"
                    role="alert"
                  >
                    <small
                      ><i class="bi bi-check-circle me-1"></i
                      >{{ joinSuccess }}</small
                    >
                  </div>

                  <button
                    type="submit"
                    class="btn btn-success w-100"
                    :disabled="joining"
                  >
                    <span
                      v-if="joining"
                      class="spinner-border spinner-border-sm me-2"
                      role="status"
                    ></span>
                    <i v-else class="bi bi-person-plus me-2"></i>
                    {{ joining ? "參加中..." : "參加活動" }}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 刪除確認模態框 -->
    <div
      v-if="deleteModal.show"
      class="modal fade show d-block"
      tabindex="-1"
      style="background-color: rgba(0, 0, 0, 0.5)"
    >
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">確認移除</h5>
            <button
              type="button"
              class="btn-close"
              @click="deleteModal.show = false"
            ></button>
          </div>
          <div class="modal-body">
            <p>您確定要移除參加者「{{ deleteModal.attendee?.name }}」嗎？</p>
          </div>
          <div class="modal-footer">
            <button
              type="button"
              class="btn btn-secondary"
              @click="deleteModal.show = false"
            >
              取消
            </button>
            <button type="button" class="btn btn-danger" @click="confirmDelete">
              <span
                v-if="deleting"
                class="spinner-border spinner-border-sm me-2"
                role="status"
              ></span>
              確認移除
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import { API_BASE_URL } from "../config";

interface Attendee {
  id: number;
  name: string;
  email: string;
}

const route = useRoute();
const attendees = ref<Attendee[]>([]);
const loading = ref(true);
const joining = ref(false);
const deleting = ref(false);
const joinError = ref("");
const joinSuccess = ref("");
const deleteModal = ref({
  show: false,
  attendee: null as Attendee | null,
});
const joinForm = ref({
  name: "",
  email: "",
});
const isLoggedIn = ref(!!localStorage.getItem("token"));

const fetchAttendees = async () => {
  const token = localStorage.getItem("token");
  try {
    loading.value = true;
    const response = await fetch(
      `${API_BASE_URL}/api/events/${route.params.id}/attendees`,
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
  } finally {
    loading.value = false;
  }
};

const joinEvent = async () => {
  // const token = localStorage.getItem("token");
  // if (!token) {
  //   joinError.value = "請先登入";
  //   return;
  // }

  try {
    joining.value = true;
    joinError.value = "";
    joinSuccess.value = "";

    const response = await fetch(
      `${API_BASE_URL}/api/events/${route.params.id}/attendees`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // Authorization: `Bearer ${token}`, // ignore auth
        },
        body: JSON.stringify(joinForm.value),
      }
    );

    if (response.ok) {
      joinSuccess.value = "成功參加活動！";
      joinForm.value = { name: "", email: "" };
      fetchAttendees();
      setTimeout(() => {
        joinSuccess.value = "";
      }, 3000);
    } else if (response.status === 409) {
      joinError.value = "此電子郵件已被使用";
    } else {
      joinError.value = "參加失敗，請稍後再試";
    }
  } catch (error) {
    console.error("Error joining event:", error);
    joinError.value = "網路錯誤，請稍後再試";
  } finally {
    joining.value = false;
  }
};

const showDeleteModal = (attendee: Attendee) => {
  deleteModal.value = {
    show: true,
    attendee,
  };
};

const confirmDelete = async () => {
  if (!deleteModal.value.attendee) return;

  const token = localStorage.getItem("token");
  try {
    deleting.value = true;
    const response = await fetch(
      `${API_BASE_URL}/api/events/${route.params.id}/attendees/${deleteModal.value.attendee.id}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    if (response.ok) {
      deleteModal.value.show = false;
      fetchAttendees();
    } else {
      alert("移除失敗");
    }
  } catch (error) {
    console.error("Error deleting attendee:", error);
    alert("移除失敗");
  } finally {
    deleting.value = false;
  }
};

const editAttendee = (attendee: Attendee) => {
  // TODO: 實現編輯功能
  alert(`編輯 ${attendee.name} 的功能尚未實現`);
};

onMounted(fetchAttendees);
</script>

<style scoped>
/* Add styles here */
</style>
