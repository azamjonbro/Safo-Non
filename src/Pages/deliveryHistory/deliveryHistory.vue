<template>
  <div class="page">
    <div class="page-top d-flex a-center j-between">
      <h3>Yetkazuvchi tarixi</h3>
    </div>
    <div class="scroll page-bottom p-24">
      <div class="table">
        <div class="table-header">
          <div class="row">
            <div class="cell">№</div>
            <div class="cell">Sana</div>
            <div class="cell">Status</div>
            <div class="cell">Soni</div>
            <div class="cell">Summa</div>
            <div class="cell">Umumiy summa</div>
            <div class="cell">Non nomi</div>
            <div class="cell">Do`kon nomi</div>

          </div>
        </div>
        <div class="table-body">
          <div
            class="row"
            v-for="(data, index) in deliveryHistory"
            :key="index"
          >
            <div class="cell">{{ index + 1 }}</div>
            <div class="cell">{{ formatDate(new Date(data.createdAt)) }}</div>
            <div class="cell">{{ data.type || "-----"}}</div>
            <div class="cell">
              {{ formatPrice(data.quantity ||  0) }}
            </div>
            <div class="cell">
              {{ formatPrice(data.price || data.money || 0) }}
            </div>
            <div class="cell">
              {{ formatPrice(data?.totalPrice || 0) }}
            </div>
            <div class="cell">{{ data?.breadId?.title || "-----" }}</div>
            <div class="cell">{{ data?.magazineId?.title || "-----" }}</div>
          </div>
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
      deliveryHistory: [],
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
    getDeliveryHistory() {
      api
        .get("/api/history/delivery")
        .then(({ status, data }) => {
          if (status === 200) {
            this.deliveryHistory = data.data;
          }
        })
        .catch((error) => {
          console.error(error);
        });
    },
  },
  mounted() {
    this.getDeliveryHistory();
  },
};
</script>

<style>
</style>