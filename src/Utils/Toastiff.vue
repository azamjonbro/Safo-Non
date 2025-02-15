<template>
  <div v-if="toastOptions.open"></div>
</template>

<script>
import Toastify from "toastify-js";
import "toastify-js/src/toastify.css";

export default {
  name: "ToastComponent",
  props: {
    toastOptions: {
      type: Object,
      required: true,
      default: () => ({
        open: false,
        text: "Default Toast Message",
        type: "success", // success yoki error
        style: {
          background: "#4CAF50",
          width: "400px",
          display: "flex",
          alignItems: "center",
          borderRadius: "8px",
          padding: "12px",
        },
      }),
    },
  },
  watch: {
    toastOptions: {
      handler(newVal) {
        if (newVal.open) {
          this.showToast(newVal);
        }
      },
      deep: true,
    },
  },
  methods: {
    showToast({ text, type, style }) {
      const icon = type === "success" 
        ? "✅" 
        : "❌"; // Success uchun yashil, error uchun qizil

      Toastify({
        text: `<span style="display:flex; align-items:center; gap:10px">
                <strong style="font-size:20px">${icon}</strong> ${text}
               </span>`,
        duration: 3000,
        close: true,
        gravity: "top",
        position: "right",
        escapeMarkup: false, // HTML ni qo‘llab-quvvatlash uchun
        style,
      }).showToast();
    },
  },
};
</script>

<style scoped></style>
