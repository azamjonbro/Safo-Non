<template>
  <div class="page">
    <div class="d-flex a-center j-between">
      <h3>Nonvoy tarixi</h3>
    </div>
    <div class="scroll pt-24 page-bottom">
      <div class="table">
        <div class="table-header">
          <div class="row">
            <div class="cell">№</div>
            <div class="cell">Sana</div>
            <div class="cell">Summa</div>
            <div class="cell">Turi</div>
            <div class="cell">Tavsif</div>
          </div>
        </div>
        <div class="table-body">
          <div
            class="row"
            v-for="(data, index) in sellerHistories"
            :key="index"
          >
            <div class="cell">{{ index + 1 }}</div>
            <div class="cell">{{ formatDate(new Date(data.createdAt)) }}</div>
            <div class="cell">{{ formatPrice(data.price) }}</div>
            <div class="cell">{{ data.type }}</div>
            <div class="cell">{{ data.comment }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import api from "@/Utils/axios";
// summa => totalPrice
// turie => typeOf
export default {
  data() {
    return {
      sellerHistories: [],
    };
  },
  methods: {
    getAllSellerHistories() {
      api
        .get("/api//history/seller")
        .then(({ status, data }) => {
          if (status === 200) {
            this.sellerHistories = data.history;
          }
        })
        .catch((error) => {
          console.error(error);
        });
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
  },
  mounted() {
    this.getAllSellerHistories();
  },
};
</script>

<style>
</style>