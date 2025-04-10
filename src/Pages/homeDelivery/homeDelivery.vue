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
            <h3>Sotgan nonlar narxi</h3>
            <b>{{ formatPrice(statics?.soldBread?.totalPrice || 0) }}</b>
          </span>
        </div>
        <div
          class="card"
          @click="
            openModalPage({
              history: statics?.debt?.history,
              type: 'deliverydebt',
            })
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
              type: 'soldBread2',
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
      <div class="infobox d-flex wrap" style="margin-top: 15px">
        <div
          class="card"
          @click="
            openModalPage({
              history: orderWithDeliveries,
              type: 'orderwithdelivery',
            })
          "
        >
          <Icons :name="'dayIncr'" />
          <span class="info-item">
            <h3>Nonlar soni</h3>
            <b>{{
              formatPrice(
                orderWithDeliveries.reduce(
                  (a, b) => a + (b.totalQuantity2 || 0),
                  0
                ) || 0
              )
            }}</b>
          </span>
        </div>
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
            <h3>Sotilgan Nonlar soni</h3>
            <b>{{
              formatPrice(
                statics?.soldBread?.history?.reduce((a, b) => {
                  return a + b.quantity;
                }, 0) || 0
              )
            }}</b>
          </span>
        </div>

        <div class="card">
          <Icons :name="'dayIncr'" />
          <span class="info-item">
            <h3>Qoldiq</h3>
            <b>{{
              formatPrice(
                orderWithDeliveries.reduce(
                  (a, b) => a + (b.totalQuantity2 || 0),
                  0
                ) -
                  statics?.soldBread?.history?.reduce((a, b) => {
                    return a + b.quantity;
                  }, 0) >
                  0
                  ? orderWithDeliveries.reduce(
                      (a, b) => a + (b.totalQuantity2 || 0),
                      0
                    ) -
                      statics?.soldBread?.history?.reduce((a, b) => {
                        return a + b.quantity;
                      }, 0)
                  : statics?.soldBread?.history?.reduce((a, b) => {
                      return a + b.quantity;
                    }, 0) -
                      orderWithDeliveries.reduce(
                        (a, b) => a + (b.totalQuantity2 || 0),
                        0
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
      orderWithDeliveries: [],
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
        })
        .catch((error) => {
          console.error("Error fetching statistics:", error);
        });
    },
    getOrderWithDeliveries() {
      api
        .get("/api/orderWithDeliveries")
        .then(({ data, status }) => {
          if (status === 200) {
            this.orderWithDeliveries = data?.orderWithDeliveries.reduce(
              (acc, item) => {
                item.typeOfBreadIds.forEach((breadItem) => {
                  const _id = breadItem.breadId._id;

                  if (!acc[_id]) {
                    acc[_id] = {
                      title: breadItem.breadId.title,
                      totalQuantity: 0,
                      totalQuantity2: item.totalQuantity2,
                    };
                  }

                  acc[_id].totalQuantity += breadItem.quantity;
                });

                return acc;
              },
              {}
            );
            this.orderWithDeliveries = Object.values(this.orderWithDeliveries);
            console.log(this.orderWithDeliveries);
          }
        })
        .catch((error) => {
          console.error(error);
        });
    },
  },
  mounted() {
    this.getStatics();
    this.getOrderWithDeliveries();
  },
};
</script>
<style>
</style>
