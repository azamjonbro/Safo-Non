<template>
  <div class="page">
    <div class="page-top d-flex a-center j-between">
      <h3>Yaroqsiz Nonlar</h3>
    </div>
    <div class="scroll page-bottom p-24">
      <div class="table">
        <div class="table-header">
          <div class="row">
            <div class="cell">№</div>
            <div class="cell">Umumiy hisob</div>
            <div class="cell">Tavsifi</div>
            <div class="cell">Soni</div>
            <div class="cell">Sana</div>
            <div class="cell"></div>
          </div>
        </div>
        <div class="table-body">
          <div class="row" v-for="(data, index) in InvalidPro" :key="index">
            <div class="cell">{{ index + 1 }}</div>
            <div class="cell">
              {{ formatPrice(data?.totalPrice) || 0 }} so`m
            </div>
            <div class="cell">{{ data?.order.description || "" }}</div>
            <div class="cell">
              {{ data?.order.totalQuantity || 0 }}
            </div>
            <div class="cell">
              {{ formatDate(new Date(data.order.createdAt)) }}
            </div>   
            <div
              class="cell d-flex a-center j-end gap12"
            >
              <Icons
                name="delivery"
                class="icon info setting"
                @click="openModal2(data)"
              />
            </div>
          </div>
        </div>
        <p class="text16 d-flex j-center p-24" v-if="!InvalidPro.length">
          Yaroqsiz nonlar hozir mavjud emas
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import Icons from "@/components/Template/Icons.vue";
import api from "@/Utils/axios";
export default {
  components: {
    Icons,
  },
  data() {
    return {
      InvalidPro: [],
    };
  },
  methods: {
    getInvalidPros() {
      api
        .get("/api/InvalidPros")
        .then(({ status, data }) => {
          if (status === 200) {
            this.InvalidPro = data?.InvalidPro
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
    this.getInvalidPros();
  },
};
</script>

<style>
</style>