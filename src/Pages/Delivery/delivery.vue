<template>
  <div class="page">
    <div class="page-top d-flex a-center j-between">
      <h3>Yetkazuvchilar</h3>
      <button class="create-button" @click="openModal = true">
        Yetkazuvchi yaratish
      </button>
    </div>
    <div class="scroll page-bottom p-24">
      <table>
        <thead>
          <tr>
            <th>№</th>
            <th>username</th>
            <th>phone</th>
            <th>password</th>
            <th>price</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(data, index) in allDelivery" :key="index">
            <td>{{ index + 1 }}</td>
            <td>{{ data?.username ? data?.username : "" }}</td>
            <td>{{ data?.phone ? data?.phone : "" }}</td>
            <td>---------</td>
            <td>{{ data?.price ? data?.price : "" }}</td>
            <td class="d-flex a-center j-end gap12">
              <Icons name="setting" title="sozlama" class="icon info setting" />
              <Icons
                name="deleted"
                title="o'chirish"
                class="icon danger"
                @click="deleteDelivery(data?._id)"
              />
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
  <DeliveryModelVue v-if="openModal" @close="handleClose" />
  <ToastiffVue :toastOptions="toastOptions" />
</template>

<script>
import api from "@/Utils/axios";
import Icons from "@/components/Template/Icons.vue";
import DeliveryModelVue from "./deliveryModel.vue";
import ToastiffVue from "@/Utils/Toastiff.vue";
export default {
  components: {
    Icons,
    DeliveryModelVue,
    ToastiffVue,
  },
  data() {
    return {
      allDelivery: [],
      openModal: false,
      toastOptions: {
        open: false,
        text: "",
        style: { background: "#4CAF50" },
      },
    };
  },
  methods: {
    handleClose() {
      this.openModal = false;
      this.getDeliveries();
    },
    getDeliveries() {
      const token = localStorage.getItem("user")
        ? JSON.parse(localStorage.getItem("user"))?.accessToken
        : "";

      api
        .get("/api/deliveries", {
          headers: {
            authorization: token,
          },
        })
        .then(({ data, status }) => {
          if (status === 200) {
            this.allDelivery = data?.deliveries;
            this.toastOptions = {
              open: true,
              text: "Yetkazuvchilar keldi",
              style: { background: "#4CAF50" },
            };
          }
        });
    },
    deleteDelivery(id) {
      const token = localStorage.getItem("user")
        ? JSON.parse(localStorage.getItem("user"))?.accessToken
        : "";
      api
        .delete("/api/delivery/" + id, {
          headers: {
            authorization: token,
          },
        })
        .then(({ status }) => {
          if (status === 200) {
            this.getDeliveries();
          }
        });
    },
  },
  mounted() {
    this.getDeliveries();
  },
};
</script>

<style>
</style>
