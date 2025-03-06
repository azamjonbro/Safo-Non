<template>
  <div class="home-page">
    <Sidebar class="sidebar" @menu-click="changePage($event)" />
    <main class="main">
      <Dashboard v-if="activePage == 'dashboard'" />
      <Managers v-if="activePage=='managers'"/>
      <Backery v-if="activePage == 'workers'" />
      <Settings v-if="activePage == 'settings'" />
      <TypeOfBreadVue v-if="activePage == 'typeOfBread'" />
      <DeliveryVue v-if="activePage == 'delivery'" />
      <MagazineVue v-if="activePage == 'magazine'" />
      <DebtVue v-if="activePage == 'debt'" />
      <WarehouseVue v-if="activePage == 'warehouse'" />
      <SellerShopVue v-if="activePage == 'sellerShop'" />
      <SellerNonVue v-if="activePage == 'sellerNon'" />
      <SellerDebtVue v-if="activePage == 'sellerDebt'" />
      <!-- <ErrorPage v-else/> -->
    </main>
  </div>
</template>

<script>
import Sidebar from "@/components/Template/Sidebar.vue";
import Dashboard from "@/Pages/Dashboard/dashboard.vue";
import ErrorPage from "@/components/Template/404.vue";
import Backery from "@/Pages/Backery/backery.vue";
import Settings from "@/Pages/Settings/settings.vue";
import TypeOfBreadVue from "@/Pages/typeOfBread/typeOfBread.vue";
import DeliveryVue from "@/Pages/Delivery/delivery.vue";
import MagazineVue from "@/Pages/Magazine/magazine.vue";
import DebtVue from "@/Pages/Debt/debt.vue";
import WarehouseVue from "@/Pages/WareHouse/warehouse.vue";
import SellerShopVue from "@/Pages/SellerShop/sellerShop.vue";
import SellerNonVue from '@/Pages/sellerNon/sellerNon.vue';
import Managers from "@/Pages/Managers/managers.vue";
import SellerDebtVue from '@/Pages/SellerDebt/sellerDebt.vue';
export default {
  name: "HomePage",
  components: {
    Sidebar,
    Dashboard,
    Managers,
    Backery,
    ErrorPage,
    Settings,
    TypeOfBreadVue,
    DeliveryVue,
    MagazineVue,
    DebtVue,
    WarehouseVue,
    SellerShopVue,
    SellerNonVue,
    SellerDebtVue
  },
  data() {
    return {
      activePage: "dashboard",
    };
  },
  methods: {
    changePage(page) {
      this.activePage = page;
    },
  },
};
</script>

<style></style>