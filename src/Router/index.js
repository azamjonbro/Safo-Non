import { createRouter, createWebHistory } from 'vue-router';
import LoginPage from '@/View/Login/LoginPage.vue';
import HomePage from '@/View/Home/HomePage.vue';

const routes = [
    {
        path: '/login',
        name: 'Login',
        component: LoginPage
    },
    {
        path: '/',
        name: 'Home',
        component: HomePage,
    }
];

const router = createRouter({
    history:  createWebHistory(),
    routes
});

export default router;
