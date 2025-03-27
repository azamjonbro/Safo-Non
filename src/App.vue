<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
import api from "./Utils/axios";
export default {
  mounted() {
    window.addEventListener("pageshow", this.handlePageShow);
  },
  beforeUnmount() {
    window.removeEventListener("pageshow", this.handlePageShow);
  },
  methods: {
    handlePageShow(event) {
      if (event.persisted) {
        window.location.reload();
      }
    },
    getUserBytoken() {
      api
        .get("/api/token")
        .then(({ status, data }) => {
          if (status !== 200) {
            localStorage.removeItem("user");
            this.$router.push("/login");
          }
        })
        .catch((error) => {
          if (error.status !== 200) {
            localStorage.removeItem("user");
            this.$router.push("/login");
          }
          console.error(error);
        });
    },
  },
  mounted() {
    const token = JSON.parse(localStorage.getItem("user")) || "";
    this.getUserBytoken();
    if (!token) {
      this.$router.push("/login");
    } else {
      this.$router.push("/");
      this.getUserBytoken();
    }
  },
};
</script>
