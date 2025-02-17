<template>
    <div class="page">
      <div class="page-top d-flex j-between a-center">
        <b>Dashboard</b>
      </div>
      <div class="page-bottom scroll">
        <div class="infobox d-flex wrap">
          <div class="card" v-for="(data, index) in manager" :key="index" @click="openModal = true">
            <Icons :name="data?.iconname" />
            <span class="info-item">
              <h3>{{ data.title }}</h3>
              <b>{{ formatPrice(data.price || 0) }}</b>
            </span>
          </div>
        </div>
      </div>
      <HistoryModal v-if="openModal" @close="closeModal"/>
    </div>
  </template>
  
  <script>
  import HistoryModal from '@/components/Modals/HistoryModal.vue';
  import Icons from '@/components/Template/Icons.vue';
  
  export default {
    components: {
      Icons,
      HistoryModal
    },
    data() {
      return {
        openModal: false,
        manager: [
          { iconname: "allIncr", title: "Umumiy kirim", price: 450000 },
          { iconname: "dayIncr", title: "Kunlik kirim", price: 300000 },
          { iconname: "wallet", title: "Hamyon", price: 200000 },
          { iconname: "allIncr", title: "Umumiy chiqim", price: 500000 },
          { iconname: "dayIncr", title: "Kunlik chiqim", price: 150000 },
          { iconname: "dayIncr", title: "Kunlik chiqim", price: 150000 },
          { iconname: "dayIncr", title: "Kunlik chiqim", price: 150000 },
          { iconname: "dayIncr", title: "Kunlik chiqim", price: 150000 },
          { iconname: "dayIncr", title: "Kunlik chiqim", price: 150000 },

        ]
      };
    },
    methods: {
      formatPrice(price) {
        return new Intl.NumberFormat('ru-RU').format(price);
      },
      closeModal() {
        this.openModal = false;
      }
    }
  };
  </script>
  <style>
  .infobox {
    display: flex;
    justify-content: space-between;
    gap: 24px;
  }
  .card {
      background: #5565ff;
      width: 32%;
      min-width: 365px;
      height: 120px;
      border-radius: 10px;
      display: flex;
      align-items: center;
      padding: 12px;
      gap: 12px;
  }
  .card>div>svg>path,.card>span{
      stroke: #fff;
      color: #fff;
  }
  .card>span>h3{
      font-weight: 300;
      color: #ffffff9d;
      font-size: 13px;
  }
  .card>span>b{
      font-size: 22px;
  }
  .card:nth-child(3n+2){
      background: red;
  }
  .card:nth-child(3n+3){
      background: #874BFF;
  }
  @media (max-width:1140px){
      .infobox{
          display: flex;
          justify-content: center;
      }
      .infobox>.card{
          min-width: 95%;
      }
  }
  </style>