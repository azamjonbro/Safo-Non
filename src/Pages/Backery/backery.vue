<template>
    <div class="page d-flex column gap24">
        <div class="page-top d-flex a-center j-between">
            <h3>Nonvoylar</h3>
            <button class="create-button" @click="openModal = true">Nonvoy yaratish</button>
        </div>
        <div class="scroll page-bottom p-24">
            <table>
                <thead>
                    <tr>
                        <th>No</th>
                        <th>Ismi</th>
                        <th>Raqami</th>
                        <th>Maoshi</th>
                        <th>Summa</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="data in allWorkers" :key="data.ovenId">
                        <td>{{ data?.ovenId ? data.ovenId : '-----------' }}</td>
                        <td>{{ data?.username }}</td>
                        <td>{{ data?.phone }}</td>
                        <td>{{ formatPrice(data?.price || 0) }} sum</td>
                        <td>{{ formatPrice(data.totalPrice || 0) }} sum</td>
                        <td class="d-flex a-center j-end gap12">
                            <Icons name="payed" title="To'lov" class="icon info setting" />
                            <Icons name="setting" title="sozlama" class="icon info setting" />
                            <Icons name="deleted" title="o'chirish" class="icon danger" />
                            <Icons name="bottomArrow" />
                        </td>
                    </tr>
                </tbody>
            </table>
            <p class="text16 d-flex j-center p-24" v-if="!allWorkers">Hozircha nonvoy mavjud emas</p>
        </div>
    </div>
    <BackeryModal v-if="openModal" @close="openModal = false" @status="handleStatus($event)" />
    <Toastiff :toastOptions="toastOptions" />

</template>
<script>
import Icons from '@/components/Template/Icons.vue';
import api from '@/Utils/axios';
import BackeryModal from './BackeryModal.vue';
import Toastiff from '@/Utils/Toastiff.vue';

export default {
    components: {
        Icons,
        BackeryModal,
        Toastiff
    },
    data() {
        return {
            allWorkers: [],
            openModal: false,
            toastOptions: {
                open: false,
                text: "",
            },
        }
    },
    methods: {
        formatDate(date) {
            const day = String(date.getDate()).padStart(2, '0');
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const year = date.getFullYear();

            return `${day}.${month}.${year}`;
        },
        formatPrice(price) {
            return new Intl.NumberFormat('ru-RU').format(price);
        },
       async handleStatus(data) {      
            this.toastOptions = {
                open: true,
                text: data?.message,
                type: data?.status
            }
            this.openModal=false
            await this.getAllWorker()
        },
        async getAllWorker() {
            api.get('/api/sellers')
                .then((response) => {
                    this.allWorkers = response?.data?.sellers
                    console.log(response);

                })

        }
    },
    mounted() {
        this.getAllWorker()
    }
}
</script>
<style>
.setting>svg>path {
    stroke: #fff
}
</style>