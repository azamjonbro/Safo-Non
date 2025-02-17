<template>
    <div class="navbar">
        <div class="overlay" v-if="isOpen" @click="closeSidebar"></div>
        <div class="menu-container navbar-box d-flex column j-between" :class="{ open: isOpen }">
            <div class="navbar-logo relative">
                <svg class="sidebar-logo" width="240" height="40" viewBox="0 0 487 39" fill="none"
                    xmlns="http://www.w3.org/2000/svg">
                    <path
                        d="M35.08 32.536C37.9387 32.536 39.368 30.9147 39.368 27.672C39.368 24.4293 37.9387 22.808 35.08 22.808H34.504V16.408C38.2587 16.408 41.096 17.1547 43.016 18.648C44.936 20.1413 45.896 22.488 45.896 25.688V29.464C45.896 32.664 45 35.0533 43.208 36.632C41.416 38.2107 38.5787 39 34.696 39H0.648V32.536H35.08ZM11.464 6.68C8.60533 6.68 7.176 8.30133 7.176 11.544C7.176 14.7867 8.60533 16.408 11.464 16.408H12.04V22.808C4.44533 22.808 0.648 19.7147 0.648 13.528V9.752C0.648 3.39467 4.40267 0.216 11.912 0.216H45.896V6.68H11.464ZM80.1545 11.992H86.6185V39H80.1545V11.992ZM105.882 11.416C105.882 9.92267 105.37 8.77067 104.347 7.96C103.365 7.10667 102.213 6.68 100.891 6.68H60.9545V39H54.4905V0.216H100.379C104.005 0.216 106.885 1.09067 109.019 2.84C111.195 4.58933 112.283 6.95733 112.283 9.944V39H105.882V11.416ZM160.769 32.6L145.665 8.28H145.537L130.369 32.6H160.769ZM152.321 6.68L172.289 39H118.977L138.881 6.68C140.161 4.58933 141.398 2.98933 142.593 1.88C143.788 0.770665 144.577 0.216 144.961 0.216H146.241C146.497 0.216 146.796 0.301332 147.137 0.471996C147.478 0.642663 147.884 0.983997 148.353 1.496C148.822 1.96533 149.377 2.62666 150.017 3.48C150.7 4.29067 151.468 5.35733 152.321 6.68ZM210.729 6.68H176.425V0.216H210.537C212.415 0.216 214.057 0.471999 215.465 0.983997C216.873 1.496 218.025 2.2 218.921 3.096C219.86 3.94933 220.564 4.97333 221.033 6.168C221.503 7.36267 221.737 8.62133 221.737 9.944V13.208C221.737 14.4453 221.503 15.64 221.033 16.792C220.564 17.944 219.86 18.968 218.921 19.864C218.025 20.76 216.873 21.4853 215.465 22.04C214.057 22.5947 212.415 22.872 210.537 22.872H190.121L221.737 39H208.041L176.425 22.936V16.472H210.729C212.137 16.472 213.247 16.0453 214.057 15.192C214.868 14.3387 215.273 13.1013 215.273 11.48C215.273 9.85867 214.868 8.664 214.057 7.896C213.247 7.08533 212.137 6.68 210.729 6.68ZM230.455 0.216H275.703V6.68H256.311V39H249.847V6.68H230.455V0.216ZM327.292 27.8C327.335 29.2933 327.804 30.4667 328.7 31.32C329.639 32.1307 330.769 32.536 332.092 32.536H366.076V39H332.732C329.105 39 326.204 38.1253 324.028 36.376C321.895 34.6267 320.828 32.2587 320.828 29.272V9.944C320.828 6.95733 321.895 4.58933 324.028 2.84C326.204 1.09067 329.105 0.216 332.732 0.216H366.076V9.944H359.612V6.68H332.092C330.769 6.68 329.639 7.10667 328.7 7.96C327.761 8.77067 327.292 9.92267 327.292 11.416V27.8ZM408.974 6.68H374.67V0.216H408.782C410.66 0.216 412.302 0.471999 413.71 0.983997C415.118 1.496 416.27 2.2 417.166 3.096C418.105 3.94933 418.809 4.97333 419.278 6.168C419.748 7.36267 419.982 8.62133 419.982 9.944V13.208C419.982 14.4453 419.748 15.64 419.278 16.792C418.809 17.944 418.105 18.968 417.166 19.864C416.27 20.76 415.118 21.4853 413.71 22.04C412.302 22.5947 410.66 22.872 408.782 22.872H388.366L419.982 39H406.286L374.67 22.936V16.472H408.974C410.382 16.472 411.492 16.0453 412.302 15.192C413.113 14.3387 413.518 13.1013 413.518 11.48C413.518 9.85867 413.113 8.664 412.302 7.896C411.492 7.08533 410.382 6.68 408.974 6.68ZM454.364 11.992H460.828V39H454.364V11.992ZM480.092 11.416C480.092 9.92267 479.58 8.77067 478.556 7.96C477.575 7.10667 476.423 6.68 475.1 6.68H435.164V39H428.7V0.216H474.588C478.215 0.216 481.095 1.09067 483.228 2.84C485.404 4.58933 486.492 6.95733 486.492 9.944V39H480.092V11.416Z"
                        fill="#5565FF" />
                </svg>
            </div>
            <ul class="navbar-menu d-flex column gap12">
                <li :class="activePage === 'dashboard' ? 'active' : 'left-item'" class="d-flex gap12"
                    @click="setActive('dashboard')">
                    <Icons name="home" />
                    <router-link to="/">Asosiy</router-link>
                </li>
                <li :class="activePage === 'kassa' ? 'active' : 'left-item'" class="d-flex" @click="setActive('kassa')">
                    <Icons name="workers" />
                    <router-link to="/">Nonvoylar</router-link>
                </li>
                <li :class="activePage === 'delivery' ? 'active' : 'left-item'" class="d-flex" @click="setActive('delivery')">
                    <Icons name="delivery" />
                    <router-link to="/">Yetkazuvchilar</router-link>
                </li>
                <li :class="activePage === 'product' ? 'active' : 'left-item'" class="d-flex"
                    @click="setActive('product')">
                    <Icons name="product" />
                    <router-link to="/">Do'konlar</router-link>
                </li>
                <li :class="activePage === 'rasxod' ? 'active' : 'left-item'" class="d-flex"
                    @click="setActive('rasxod')">
                    <Icons name="rasxod" />
                    <router-link to="/">Chiqimlar</router-link>
                </li>
                
                <li :class="activePage === 'firma' ? 'active' : 'left-item'" class="d-flex gap12"
                    @click="setActive('firma')">
                    <Icons name="firma" />
                    <router-link to="/">Omborxona</router-link>
                </li>
                
                <li :class="activePage === 'settings' ? 'active' : 'left-item'" class="d-flex" @click="setActive('settings')">
                    <Icons name="setting" />
                    <router-link to="/">Sozlamalar</router-link>
                </li>
            </ul>
            <div class="navbar-buttonbox">
                <div class="nav-name">{{ userName?.role }}</div>
                <Icons @click="exitLogin" name="exit" />
            </div>
        </div>
        <div class="burgericon" >
            <Icons name="openmenu" @click="handleOpenMenu"/>
        </div>
    </div>
</template>

<script>
import { defineAsyncComponent } from 'vue';

export default {
    components: {
        Icons:defineAsyncComponent(() => import('./Icons.vue'))
    },
    data() {
        return {
            activePage: 'dashboard',
            userName: JSON.parse(localStorage.getItem('user')),
            isOpen: false
        };
    },
    methods: {
        setActive(page) {
            this.activePage = page;
            this.$emit('menu-click', page);
            this.closeSidebar();
        },
        exitLogin() {
            localStorage.removeItem('user');
            this.$router.push('/login');
        },
        handleOpenMenu() {
            this.isOpen = true;
        },
        closeSidebar() {
            this.isOpen = false;
        }
    }
}
</script>

<style>
.navbar {
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 1% 0% 1% 1%;
}

.navbar-box {
    width: 100%;
    height: 98%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
    background: white;
    border: 1px solid #919191;
    border-radius: 10px;
    padding: 24px;
}

.navbar-menu {
    width: 100%;
    height: 80%;
    display: flex;
    flex-direction: column;
}

.navbar-logo {
    font-size: 33px;
}

.nav-name {
    width: 80%;
    display: flex;
    justify-content: center;
    align-items: center;
    text-transform: capitalize;
}

.left-item,
.active {
    width: 100%;
    color: #000;
    font-size: 16px;
    text-align: center;
    position: relative;
    list-style: none;
    padding-bottom: 5px;
    cursor: pointer;
    padding: 8px 12px;
    border-radius: 8px;
    gap: 12px;
}

.navbar-menu>li.active  {
    color: #fff;
    background: #6598f7;
    box-shadow: 0px 2px 4px 0px rgba(0, 0, 0, 0.20);
}
.navbar-menu>li.active>a{
    color: #fff;
    font-weight: 400;
    font-style: normal;

}

li.active div svg path {
    stroke: #fff;
}

.left-item:hover {
    background: #DCE8FF;
    color: #5565FF;
}

.navbar-buttonbox {
    width: 100%;
    display: flex;
    justify-content: center;
}

.navbar-buttonbox {
    width: 100%;
    height: 48px;
    display: flex;
    justify-content: space-around;
    padding: 0px 12px;
    background: #fff;
    border-radius: 10px;
    color: #000;
    border: 1px solid #919191;
}

.navbar-buttonbox> :first-child {
    flex: 1;
}


@media screen and (max-width: 768px) {
    .navbar-box {
        position: fixed;
        top: 0;
        left: -100%;
        width: 60%;
        height: 100vh;
        background: white;
        transition: left 0.3s ease-in-out;
        z-index: 1001;
    }

    .navbar-box.open {
        left: 0;
    }

    .overlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100vh;
        background: rgba(0, 0, 0, 0.5);
        z-index: 1000;
    }

    .burgericon {
        display: block;
        cursor: pointer;
    }
    
}
@media (max-width:580px){
    .navbar-box{
        padding: 12px;
    }
}

</style>
