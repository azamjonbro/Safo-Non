<template>
  <div class="page d-flex column gap24">
    <div class="page-top d-flex a-center j-between">
      <h3>Chiqimlar</h3>
      <button class="create-button" @click="createModalVisible = true">
        Chiqimlar yaratish
      </button>
    </div>
    <div class="scroll page-bottom p-24">
      <div class="table">
        <div class="table-header">
          <div class="row">
            <div class="cell">№</div>
            <div class="cell">Nomi</div>
            <div class="cell">Sonni</div>
            <div class="cell">Tasnifi</div>
            <div class="cell">Sababi</div>
            <div class="cell"></div>
          </div>
        </div>
        <div class="table-body">
          <div class="row"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import api from "@/Utils/axios";
export default {
  data() {
    return {
      createModalVisible: false,
    };
  },
  methods: {
    getSellerDebts() {
      api
        .get("/api/debt2s")
        .then(({ status, data }) => {
          if (status === 200) {
            console.log(data);
          }
        })
        .catch((error) => {
          console.error(error);
        });
    },
  },
  mounted() {
    this.getSellerDebts()
  },
};
</script>

<style>
</style>