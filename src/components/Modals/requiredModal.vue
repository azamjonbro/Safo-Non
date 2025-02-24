<template>
  <div class="modal-overlay" v-if="isVisible">
    <div class="return-content">
      <h2>{{ message }}</h2>
      <div class="modal-buttons">
        <button @click="handleResponse(true)" class="btn btn-yes">Ha</button>
        <button @click="handleResponse(false)" class="btn btn-no">
          Yoq
        </button>
      </div>
    </div>
  </div>
</template>
  <script>
export default {
  name: "ConfirmModal",
  props: {
    message: {
      type: String,
      default: "Вы уверены, что хотите удалить это?",
    },
    isVisible: {
      type: Boolean,
      default: false,
    },
  },
  methods: {
    handleResponse(response) {
      this.$emit("response", response);
    },
  },
};
</script>
<style>
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
  width: 700px;
  height: 150px;
  background: white;
  padding: 20px;
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
