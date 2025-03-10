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
      </div>
    </div>
  </div>
</template>

<script>
import Icons from "@/components/Template/Icons.vue";
export default {
  components: {
    Icons,
  },
  methods: {
    formatPrice(price) {
      return new Intl.NumberFormat("ru-RU").format(price);
    },
  },
};
</script>
<style>
</style>
