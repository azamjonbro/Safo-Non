import { createRouter, createWebHashHistory } from 'vue-router';
import LoginPage from '@/Pages/Login/LoginPage.vue';
import HomePage from '@/Pages/Home/HomePage.vue';

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
        beforeEnter: (to, from, next) => {
            const token = localStorage.getItem('user'); 
            if (!token) {
                next('/login'); 
            } else {
                next(); 
            }
        }
    }
];

const router = createRouter({
    history:  createWebHashHistory(),
    routes
});

export default router;
