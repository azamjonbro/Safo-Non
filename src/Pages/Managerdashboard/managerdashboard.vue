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
              history: statics?.prixod.history,
              type: 'prixod',
              role: 'manager',
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
      <h2 style="margin-top: 150px">Nonlar hisobot</h2>
      <div class="infobox d-flex wrap" style="margin-top: 15px">
        <div
          class="card"
          @click="
            openModalPage({ history: sellerbreads, type: 'sellerbreads' })
          "
        >
          <Icons :name="'dayIncr'" />
          <span class="info-item">
            <h3>Nonlar sonni</h3>

            <b>{{
              formatPrice(
                sellerbreads?.reduce((a, i) => a + i.totalQuantity2, 0) || 0
              )
            }}</b>
          </span>
        </div>

        <div
          class="card"
          @click="
            openModalPage({ history: statics?.sellingBread?.history, type: 'sellingbread' })
          "
        >
          <Icons :name="'dayIncr'" />
          <span class="info-item">
            <h3>Sotilgan nonlar</h3>
            <b>{{ formatPrice(statics?.sellingBread?.totalQuantity || 0) }}</b>
          </span>
        </div>
        <div class="card">
          <Icons :name="'dayIncr'" />
          <span class="info-item">
            <h3>Qoldiq nonlar</h3>
            <b>{{
              formatPrice(
                Math.abs(
                  sellerbreads?.reduce((a, i) => a + i.totalQuantity2, 0) -
                    statics?.sellingBread?.totalQuantity
                ) || 0
              )
            }}</b>
          </span>
        </div>
      </div>
    </div>
  </div>
  <HistoryModalVue
    :history="historyItem"
    v-if="openModal"
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
      sellerbreads: [],
      sellingBreads: [],
    };
  },
  methods: {
    getStatics() {
      api
        .get("/api/statics")
        .then((response) => {
          this.statics = response.data.statics;
        })
        .catch((error) => {
          console.error("Error fetching statistics:", error);
        });
    },
    formatPrice(price) {
      return new Intl.NumberFormat("ru-RU").format(price);
    },
    openModalPage(history) {
      if (this.historyItem) {
        this.historyItem = null;
      }
      this.historyItem = history;
      this.openModal = true;
    },
    getSellerBread() {
      api
        .get("/api/manager's/warehouse")
        .then(({ status, data }) => {
          if (status === 200) {
            this.sellerbreads = data.datas;
          }
        })
        .catch((error) => {
          console.error("Error fetching statistics:", error);
        });
    },
  },
  mounted() {
    this.getStatics();
    this.getSellerBread();
  },
};
</script>
<style>
</style>
