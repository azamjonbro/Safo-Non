<template>
  <div class="page">
    <div class="d-flex a-center j-between">
      <h3>Nonxona</h3>
      <button class="create-button">Non yaratish</button>
    </div>
    <div class="scroll pt-24 page-bottom">
      <div class="table">
        <div class="table-header">
          <div class="row">
            <div class="cell">№</div>
            <div class="cell">Narxi</div>
            <div class="cell">Name</div>
            <div class="cell">TandirId</div>
            <div class="cell">quantity</div>
            <div class="cell">time</div>
            <div class="cell"></div>
          </div>
        </div>
        <div class="table-body"></div>
      </div>
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
        type: "success",
        text: "",
      },
    };
  },
  methods: {
    getSellerNon() {
      api
        .get("/api/sellerBreads")
        .then(({ status }) => {
          if (status === 200) {
            this.toastOptions = {
              open: true,
              type: "success",
              text: "Nonvoy nonlari keldi",
            };
          } else {
            this.toastOptions = {
              open: true,
              type: "error",
              text: "Nonvoy nonlari kelayotganda xatolik yuz berdi",
            };
          }
        })
        .catch((error) => {
          console.error(error);
          this.toastOptions = {
            open: true,
            type: "error",
            text: "Xatolik yuzberdi",
          };
        });
    },
  },
  mounted() {
    this.getSellerNon()
  },
};
</script>

<style>
</style>