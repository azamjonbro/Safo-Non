<template>
  <div class="page">
    <div class="page-top d-flex j-between a-center">
      <h3 style="padding: 12px 0px">Dashboard</h3>
    </div>
    <div class="page-bottom scroll">
      <div class="infobox d-flex wrap">
        <div class="card" @click="openModalPage(statics?.prixod?.history)">
          <Icons :name="'dayIncr'" />
          <span class="info-item">
            <h3>Kirimlar</h3>
            <b>{{ formatPrice(statics?.prixod?.totalPrice || 0) }}</b>
          </span>
        </div>
        <div class="card" @click="openModalPage(statics?.debt?.history)">
          <Icons :name="'wallet'" />
          <span class="info-item">
            <h3>Chiqim</h3>
            <b>{{ formatPrice(statics?.debt?.totalPrice || 0) }}</b>
          </span>
        </div>
        <div class="card" @click="openModalPage(statics?.pending?.history)">
          <Icons :name="'allIncr'" />
          <span class="info-item">
            <h3>Kutilayotgan</h3>
            <b>{{ formatPrice(statics?.pending?.totalPrice || 0) }}</b>
          </span>
        </div>
        <div
          class="card"
          v-for="(data, index) in manager"
          :key="index"
          @click="openModal = true"
        >
          <Icons :name="data?.iconname" />
          <span class="info-item">
            <h3>{{ data.title }}</h3>
            <b>{{ formatPrice(data.price || 0) }}</b>
          </span>
        </div>
      </div>
    </div>
    <HistoryModal v-if="openModal" :history="historyItem" @close="closeModal" />
  </div>
</template>

<script>
import HistoryModal from "@/components/Modals/HistoryModal.vue";
import Icons from "@/components/Template/Icons.vue";
import Api from "@/Utils/axios.js";
export default {
  components: {
    Icons,
    HistoryModal,
  },
  data() {
    return {
      openModal: false,
      statics: {},
      historyItem: null,
      manager: [],
    };
  },
  methods: {
    async openModalPage(history) {
      this.openModal = true;
      if (this.historyItem) {
        this.historyItem = null;
      }
      this.historyItem = history;
    },
    formatPrice(price) {
      return new Intl.NumberFormat("ru-RU").format(price);
    },
    closeModal() {
      this.openModal = false;
    },
    gretAllStatistics() {
      const user = JSON.parse(localStorage.getItem("user"));
      const hashtoken = user?.accessToken;

      if (hashtoken) {
        Api.get("/api/statics")
          .then((response) => {
            this.statics = response.data.statics;
            this.manager = [
              ...response.data.managerStatics.debt?.history.map((item) => {
                return { ...item, iconname: "dayIncr" };
              }),
              ...response.data.managerStatics.prixod?.history.map((item) => {
                return { ...item, iconname: "allIncr" };
              }),
              ...response.data.managerStatics.pending?.history.map((item) => {
                return { ...item, iconname: "allIncr" };
              }),
            ];
          })
          .catch((error) => {
            console.error("Error fetching statistics:", error);
          });
      } else {
        console.error("Access token not found");
      }
    },
  },
  mounted() {
    this.gretAllStatistics();
  },
};
</script>
<style>
.infobox {
  display: flex;
  justify-content: space-between;
  gap: 24px;
}

.card {
  background: #6a8ffd;
  width: 32%;
  min-width: 365px;
  height: 120px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  padding-left: 24px;
  gap: 12px;
}

.card > div > svg > path,
.card > span {
  stroke: #fff;
  color: #fff;
}

.card > span > h3 {
  font-weight: 300;
  color: #ffffff9d;
  font-size: 13px;
}

.card > span > b {
  font-size: 24px;
}

@media (max-width: 1140px) {
  .infobox {
    display: flex;
    justify-content: center;
  }

  .infobox > .card {
    min-width: 95%;
  }
}
</style>
