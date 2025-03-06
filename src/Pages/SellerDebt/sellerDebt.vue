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
            <div class="cell">Narxi</div>
            <div class="cell">Tasnifi</div>
            <div class="cell">Sababi</div>
            <div class="cell">date</div>
            <div class="cell"></div>
          </div>
        </div>
        <div class="table-body">
          <div class="row" v-for="(data, index) in sellerDebts" :key="index">
            <div class="cell">{{ index + 1 }}</div>
            <div class="cell">{{ data.omborxonaProId.name }}</div>
            <div class="cell">{{ data.quantity }}</div>
            <div class="cell">{{ formatPrice(data.price) }}</div>
            <div class="cell">{{ data.description }}</div>
            <div class="cell">{{ data.reason }}</div>
            <div class="cell">{{ formatDate(new Date(data.createdAt)) }}</div>
            <div class="cell d-flex j-end gap12">
              <Icons name="setting" title="sozlama" class="icon info setting" />
              <Icons name="deleted" title="o'chirish" class="icon danger" />
            </div>
          </div>
        </div>
        <p class="text16 d-flex j-center p-24" v-if="!sellerDebts.length">
          Hozircha chiqimlar mavjud emas
        </p>
      </div>
    </div>
  </div>
  <SellerDebtModalVue v-if="createModalVisible" @close="closeCreateModal" />
</template>

<script>
import api from "@/Utils/axios";
import Icons from "@/components/Template/Icons.vue";
import SellerDebtModalVue from "./sellerDebtModal.vue";
export default {
  components: {
    Icons,
    SellerDebtModalVue,
  },
  data() {
    return {
      createModalVisible: false,
      sellerDebts: [],
    };
  },
  methods: {
    closeCreateModal() {
      (this.createModalVisible = false), this.getSellerDebts();
    },
    formatDate(date) {
      const day = String(date.getDate()).padStart(2, "0");
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const year = date.getFullYear();

      return `${day}.${month}.${year}`;
    },
    formatPrice(price) {
      return new Intl.NumberFormat("ru-RU").format(price);
    },
    getSellerDebts() {
      api
        .get("/api/debt2s")
        .then(({ status, data }) => {
          if (status === 200) {
            this.sellerDebts = data?.debt2s;
          }
        })
        .catch((error) => {
          console.error(error);
        });
    },
  },
  mounted() {
    this.getSellerDebts();
  },
};
</script>

<style>
</style>