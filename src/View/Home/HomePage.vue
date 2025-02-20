<template>
    <div class="home-page">
        <Sidebar class="sidebar" @menu-click="changePage($event)"/>
        <main class="main">
            <Dashboard v-if="activePage=='dashboard'"/>
            <Backery v-if="activePage=='workers'"/>
            <!-- <ErrorPage v-else/> -->

        </main>
    </div>
</template>

<script>
import Sidebar from '@/components/Template/Sidebar.vue';
import Dashboard from '@/Pages/Dashboard/dashboard.vue';
import ErrorPage from '@/components/Template/404.vue'
import Backery from '@/Pages/Backery/backery.vue';
export default {
    name: 'HomePage',
    components: {
        Sidebar,
        Dashboard,
        Backery,
        ErrorPage
    },
    data() {
        return {
            activePage:'dashboard'
        };
    },
    methods: {
        changePage(page) {
            this.activePage = page;
            console.log(page);
            
        }
    }
    
};
</script>

<style></style>