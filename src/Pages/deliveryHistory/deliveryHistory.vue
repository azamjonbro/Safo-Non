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
            <div class="cell">Summa</div>
            <div class="cell">Description</div>
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
            <div class="cell">{{ data.type }}</div>
            <div class="cell">
              {{
                formatPrice(
                  data.price
                    ? data.price
                    : data.typeOfBreadIds
                    ? data.typeOfBreadIds.reduce(
                        (a, b) =>
                          a +
                          b.breadId.typeOfBreadId.reduce(
                            (c, d) => c + d.bread.price,
                            0
                          ),0
                      )
                    : 0
                )
              }}
            </div>
            <div class="cell">{{ data.description || "-----" }}</div>
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