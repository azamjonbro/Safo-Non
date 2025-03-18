<template>
  <div class="page">
    <div class="page-top d-flex j-between a-center">
      <h3 style="padding: 12px 0px">Dashboard</h3>
    </div>
    <div class="page-bottom scroll">
      <div class="infobox d-flex wrap">
        <div
          class="card"
          @click="
            openModalPage({
              history: statics?.prixod?.history,
              type: 'prixod',
              role: 'seller',
            })
          "
        >
          <Icons :name="'dayIncr'" />
          <span class="info-item">
            <h3>Kirimlar</h3>
            <b>{{ formatPrice(statics?.prixod?.totalPrice || 0) }}</b>
          </span>
        </div>
        <div
          class="card"
          @click="
            openModalPage({
              history: statics?.debt?.history,
              type: 'debt',
              role: 'seller',
            })
          "
        >
          <Icons :name="'wallet'" />
          <span class="info-item">
            <h3>Chiqim</h3>
            <b>{{ formatPrice(statics?.debt?.totalPrice || 0) }}</b>
          </span>
        </div>
        <div class="card">
          <Icons :name="'allIncr'" />
          <span class="info-item">
            <h3>Foyda</h3>
            <b>{{ formatPrice(statics?.benefit || 0) }}</b>
          </span>
        </div>
      </div>

      <h2 style="margin-top: 150px">Nonvoy hisobot</h2>
      <div class="infobox d-flex wrap">
        <div class="card">
          <Icons :name="'dayIncr'" />
          <span class="info-item">
            <h3>Nonlar soni</h3>
            <b>{{ sellerBreads.length }}</b>
          </span>
        </div>
        <div class="card">
          <Icons :name="'wallet'" />
          <span class="info-item">
            <h3>Sotilgan nonlar soni</h3>
            <b>{{ orderWithDelivery.length }}</b>
          </span>
        </div>
        <div class="card">
          <Icons :name="'allIncr'" />
          <span class="info-item">
            <h3>Qoldiq nonlar soni</h3>
            <b>{{
              orderWithDelivery.length > sellerBreads.length
                ? orderWithDelivery.length - sellerBreads.length
                : sellerBreads.length - orderWithDelivery.length
            }}</b>
          </span>
        </div>
      </div>
    </div>
  </div>
  <HistoryModalVue
    v-if="openModal"
    :history="historyItem"
    @close="(openModal = false), (historyItem = null)"
  />
</template>

<script>
import Icons from "@/components/Template/Icons.vue";
import api from "@/Utils/axios";
import HistoryModalVue from "@/components/Modals/HistoryModal.vue";
export default {
  components: {
    Icons,
    HistoryModalVue,
  },
  data() {
    return {
      openModal: false,
      statics: {},
      historyItem: null,
      sellerBreads: [],
      orderWithDelivery: [],
    };
  },
  methods: {
    openModalPage(history) {
      if (this.historyItem) {
        this.historyItem = null;
      }
      this.historyItem = history;
      this.openModal = true;
    },
    getStatics() {
      api
        .get("/api/statics")
        .then(({ status, data }) => {
          if (status === 200) {
            console.log(data);
            this.statics = data;
          }
        })
        .catch((error) => {
          console.error("Error fetching statistics:", error);
        });
    },
    formatPrice(price) {
      return new Intl.NumberFormat("ru-RU").format(price);
    },
    getSellerBreads() {
      api
        .get("/api/sellerBreads")
        .then(({ status, data }) => {
          if (status === 200) {
            this.sellerBreads = data?.sellerBreads;
          }
        })
        .catch((error) => {
          console.error(error);
        });
    },
    getOrderWithDelivery() {
      api
        .get("/api/orderWithDeliveries")
        .then(({ status, data }) => {
          if (status === 200) {
            console.log(data);
            this.orderWithDelivery = data?.orderWithDeliveries;
          }
        })
        .catch((error) => {
          console.error(error);
        });
    },
  },
  mounted() {
    this.getStatics();
    this.getSellerBreads();
    this.getOrderWithDelivery();
  },
};
</script>
<style>
</style>
