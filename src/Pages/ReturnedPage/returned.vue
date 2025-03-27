<template>
  <div class="page">
    <div class="page-top d-flex a-center j-between">
      <h3>Qaytarilganlar</h3>
      <button
        class="create-button"
        @click="openModal = true"
        v-if="role === 'delivery'"
      >
        Qaytarish
      </button>
    </div>
    <div class="scroll page-bottom p-24">
      <div class="table">
        <div class="table-header">
          <div class="row">
            <div class="cell">№</div>
            <div class="cell">Umumiy hisob</div>
            <div class="cell">Tavsifi</div>
            <div class="cell">Soni</div>
            <div class="cell">Sana</div>
            <div class="cell" v-if="role == 'manager'"></div>
          </div>
        </div>
        <div class="table-body">
          <div class="row" v-for="(data, index) in returnedPro" :key="index">
            <div class="cell">{{ index + 1 }}</div>
            <div class="cell">
              {{ formatPrice(data?.totalPrice) || 0 }} so`m
            </div>
            <div class="cell">{{ data?.order.description || "" }}</div>
            <div class="cell">
              {{ data?.order.totalQuantity || 0 }}
            </div>
            <div class="cell">
              {{ formatDate(new Date(data.order.createdAt)) }}
            </div>
            <div
              class="cell d-flex a-center j-end gap12"
              v-if="role == 'manager'"
            >
              <Icons
                name="delivery"
                class="icon info setting"
                @click="openModal2(data)"
              />

              <Icons
                name="invalidPro"
                class="icon info setting"
                @click="openModal2(data)"
              />
            </div>
          </div>
        </div>
        <p class="text16 d-flex j-center p-24" v-if="!returnedPro.length">
          Qaytarilgan nonlar hozir mavjud emas
        </p>
      </div>
    </div>
  </div>
  <ReturnedModalVue
    v-if="openModal"
    @close="(openModal = false), getAllReturned()"
    @status="handleStatus($event)"
  />
  <ToastiffVue :toastOptions="toastOptions" />
  <Returned2ModalVue
    v-if="open2Modal"
    @close="(open2Modal = false), getAllReturned()"
    :datas="datas"
    @status="handleStatus($event)"
  />
</template>


<script>
import api from "@/Utils/axios";
import ReturnedModalVue from "./returnedModal.vue";
import ToastiffVue from "@/Utils/Toastiff.vue";
import Icons from "@/components/Template/Icons.vue";
import Returned2ModalVue from "./returnedModal2.vue";
export default {
  components: { ReturnedModalVue, ToastiffVue, Icons, Returned2ModalVue },
  data() {
    return {
      openModal: false,
      role: JSON.parse(localStorage.getItem("user"))?.role || "",
      returnedPro: [],
      toastOptions: {
        open: false,
        text: "",
        style: { background: "#4CAF50" },
      },
      open2Modal: false,
      datas: [],
    };
  },
  methods: {
    openModal2(data) {
      this.datas = data;
      this.open2Modal = true;
    },
    formatDate(date) {
      const day = String(date.getDate()).padStart(2, "0");
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const year = date.getFullYear();

      return `${day}.${month}.${year}`;
    },
    formatPrice(price) {
      return new Intl.NumberFormat("ru-RU").format(price);
    },
    handleStatus(data) {
      this.toastOptions = {
        open: true,
        text: data?.message,
        type: data?.status,
      };
    },
    getAllReturned() {
      api
        .get("/api/returnedPros")
        .then(({ status, data }) => {
          if (status === 200) {
            this.returnedPro = data.returnedPro;
          }
        })
        .catch((error) => {
          console.error(error);
        });
    },
  },
  mounted() {
    this.getAllReturned();
  },
};
</script>

<style>
</style>