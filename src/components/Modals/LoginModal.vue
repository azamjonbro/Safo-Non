<template>
  <div
    class="modal-overlay"
    v-if="isVisible"
    @click.self="handleResponse(false)"
  >
    <div class="return-content">
      <h2><p class="text16 gray">Username:</p>{{ username }}</h2>
      <h2><p class="text16 gray">Password:</p>{{ password }}</h2>
      <div class="modal-buttons">
        <button @click="handleResponse()" class="btn btn-yes">Yopish</button>
      </div>
    </div>
  </div>
</template>

<script>
import api from "@/Utils/axios";
export default {
  name: "ConfirmModal",
  props: {
    message: {
      type: String,
      default: "Login",
    },
    isVisible: {
      type: Boolean,
      default: false,
    },
    loginSturckture: {
      type: Object,
    },
  },
  data() {
    return {
      username: "",
      password: "",
    };
  },
  methods: {
    handleResponse() {
      this.$emit("response");
    },
    getUserNameAndPassowrd() {
      api
        .get(
          `/api/auth/${this?.loginSturckture?.id}/password`
        )
        .then(({ data }) => {
          this.username = data?.username;
          this.password = data?.password;
        })
        .catch((error) => {
          console.error(error);
        });
    },
  },
  mounted() {
    this.getUserNameAndPassowrd();
  },
};
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.return-content {
  min-width: 500px;
  padding: 24px;
  max-width: 90vw;
  word-break: break-all;
  min-height: 250px;
  height: auto;

  background: white;
  border-radius: 8px;
  text-align: center;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
}

.modal-buttons {
  margin-top: 20px;
  display: flex;
  justify-content: center;
  gap: 10px;
}

.btn {
  padding: 10px 60px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
}

.btn-yes {
  background-color: #5565ff;
  color: white;
}

.btn-no {
  background-color: #f30300;
  color: white;
}
</style>