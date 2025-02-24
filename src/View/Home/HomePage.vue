<template>
  <div class="home-page">
    <Sidebar class="sidebar" @menu-click="changePage($event)" />
    <main class="main">
      <Dashboard v-if="activePage == 'dashboard'" />
      <Backery v-if="activePage == 'workers'" />
      <Settings v-if="activePage == 'settings'" />
      <TypeOfBreadVue v-if="activePage == 'typeOfBread'" />
      <DeliveryVue v-if="activePage == 'delivery'" />
      <MagazineVue v-if="activePage == 'magazine'" />
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
import MagazineVue from '@/Pages/Magazine/magazine.vue';
export default {
  name: "HomePage",
  components: {
    Sidebar,
    Dashboard,
    Backery,
    ErrorPage,
    Settings,
    TypeOfBreadVue,
    DeliveryVue,
    MagazineVue
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