<template>
  <div class="page">
    <div class="page-top d-flex a-center j-between">
      <h3>Sotuv</h3>
      <!-- <button
        class="create-button"
      >
        Qaytarish
      </button> -->
    </div>
    <div class="scroll page-bottom p-24">
   
    </div>
  </div>

  <ToastiffVue :toastOptions="toastOptions" />
</template>


<script>
import api from "@/Utils/axios";
import ToastiffVue from "@/Utils/Toastiff.vue";
export default {
  components: { ToastiffVue },
  data() {
    return {
      toastOptions: {
        open: false,
        text: "",
        style: { background: "#4CAF50" },
      },
    };
  },
  methods: {
    formatDate(date) {
      const day = String(date.getDate()).padStart(2, "0");
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const year = date.getFullYear();

      return `${day}.${month}.${year}`;
    },
    formatPrice(price) {
      return new Intl.NumberFormat("ru-RU").format(price);
    },
    handleStatus(data) {
      this.toastOptions = {
        open: true,
        text: data?.message,
        type: data?.status,
      };
    },
 
  },
  mounted() {
  },
};
</script>

<style>
</style>