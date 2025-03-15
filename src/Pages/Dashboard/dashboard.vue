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
            openModalPage({ history: statics?.prixod?.history, type: 'prixod' })
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
            openModalPage({ history: statics?.debt?.history, type: 'debt' })
          "
        >
          <Icons :name="'wallet'" />
          <span class="info-item">
            <h3>Chiqim</h3>
            <b>{{ formatPrice(statics?.debt?.totalPrice || 0) }}</b>
          </span>
        </div>
        <div
          class="card"
          @click="
            openModalPage({
              history: statics?.pending?.history,
              type: 'pending',
            })
          "
        >
          <Icons :name="'allIncr'" />
          <span class="info-item">
            <h3>Kutilayotgan</h3>
            <b>{{ formatPrice(statics?.pending?.totalPrice || 0) }}</b>
          </span>
        </div>
      </div>
      <div
        v-for="(data, index) in manager"
        :key="index"
        style="margin-top: 15px"
      >
        <div class="infobox d-flex wrap">
          <div class="card">
            <Icons :name="'dayIncr'" />
            <span class="info-item">
              <h3>{{ data?.username }}</h3>
              <b>{{ formatPrice(data.prixod.totalPrice || 0) }}</b>
            </span>
          </div>

          <div class="card">
            <Icons :name="'wallet'" />
            <span class="info-item">
              <h3>{{ data?.username }}</h3>
              <b>{{ formatPrice(data.debt.totalPrice || 0) }}</b>
            </span>
          </div>

          <div class="card">
            <Icons :name="'allIncr'" />
            <span class="info-item">
              <h3>{{ data?.username }}</h3>
              <b>{{ formatPrice(data.pending.totalPrice || 0) }}</b>
            </span>
          </div>
        </div>
      </div>
      <div class="infobox d-flex wrap" style="margin-top: 40px">
        <div class="card">
          <Icons :name="'dayIncr'" />
          <span class="info-item">
            <h3>Kirimlar Soni</h3>
            <b>{{ warehouseTotal.length || 0 }}</b>
          </span>
        </div>
        <div class="card">
          <Icons :name="'wallet'" />
          <span class="info-item">
            <h3>Omborxonadagi Summasi</h3>
            <b>{{
              formatPrice(warehouseTotal.reduce((a, b) => a + b?.totalPrice, 0))
            }}</b>
          </span>
        </div>
        <div class="card">
          <Icons :name="'allIncr'" />
          <span class="info-item">
            <h3>Novoy rasxodlar</h3>
            <b>{{ debt2Total }}</b>
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
      warehouseTotal: [],
      debt2Total: 0,
    };
  },
  methods: {
    getDebt2() {
      Api.get("/api/debt2s")
        .then(({ status, data }) => {
          if (status === 200) {
            this.debt2Total = data?.debt2s.length;
          }
        })
        .catch((error) => {
          console.error("Error fetching statistics:", error);
        });
    },
    getWarehouses() {
      Api.get("/api/typeOfWareHouses")
        .then(({ status, data }) => {
          if (status === 200) {
            this.warehouseTotal = data?.typeOfWareHouses;
            console.log(this.warehouseTotal);
          }
        })
        .catch((error) => {
          console.error("Error fetching statistics:", error);
        });
    },
    openModalPage(history) {
      if (this.historyItem) {
        this.historyItem = null;
      }
      this.historyItem = history;
      this.openModal = true;
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

            this.manager = response.data.managerStatics;
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
    this.getDebt2();
    this.getWarehouses();
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
@media (max-width:1570px) {
  .infobox {
    gap: 5px;
  }
  .infobox > .card {
    min-width: 32%;
  }
}
@media (max-width: 1140px) {
  .infobox {
    display: flex;
    justify-content: center;
    gap: 24px;
  }

  .infobox > .card {
    min-width: 95%;
  }
}
</style>
