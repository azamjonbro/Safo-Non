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
              history: statics?.soldBread?.history,
              type: 'soldBread',
            })
          "
        >
          <Icons :name="'dayIncr'" />
          <span class="info-item">
            <h3>Sotgan nonlar sonni</h3>
            <b>{{ formatPrice(statics?.soldBread?.totalPrice || 0) }}</b>
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
              type: 'soldBread',
            })
          "
        >
          <Icons :name="'allIncr'" />
          <span class="info-item">
            <h3>Qoldiq</h3>
            <b>{{ formatPrice(statics?.pending?.totalPrice || 0) }}</b>
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
    };
  },
  methods: {
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
    getStatics() {
      api
        .get("/api/statics")
        .then((response) => {
          this.statics = response.data;
          console.log(this.statics);
        })
        .catch((error) => {
          console.error("Error fetching statistics:", error);
        });
    },
  },
  mounted() {
    this.getStatics();
  },
};
</script>
<style>
</style>
