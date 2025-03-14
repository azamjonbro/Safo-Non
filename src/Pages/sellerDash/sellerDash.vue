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
        
        >
          <Icons :name="'allIncr'" />
          <span class="info-item">
            <h3>Foyda</h3>
            <b>{{ formatPrice(statics?.benefit || 0) }}</b>
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
            console.log(data)
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
  },
  mounted() {
    this.getStatics();
  },
};
</script>
<style>
</style>
