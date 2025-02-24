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
              <Icons
                name="setting"
                title="sozlama"
                class="icon info setting"
                @click="
                  openUpdateModal({
                    username: data?.username,
                    phone: data?.phone,
                    price: data?.price,
                    password: data?.password,
                    id: data?._id,
                  })
                "
              />
              <Icons
                name="deleted"
                title="o'chirish"
                class="icon danger"
                @click="openDeleteModal(data?._id)"
              />
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
  <RequiredModalVue
    :isVisible="deleteVisible"
    @response="closeDeleteModal($event)"
  />
  <DeliveryModelVue v-if="openModal" @close="handleClose" />
  <DeliveryModelVue
    :update="update"
    v-if="updateVisible"
    @close="handleUpdateClose"
  />
  <ToastiffVue :toastOptions="toastOptions" />
</template>

<script>
import api from "@/Utils/axios";
import Icons from "@/components/Template/Icons.vue";
import DeliveryModelVue from "./deliveryModel.vue";
import ToastiffVue from "@/Utils/Toastiff.vue";
import RequiredModalVue from "@/components/Modals/requiredModal.vue";
export default {
  components: {
    Icons,
    DeliveryModelVue,
    ToastiffVue,
    RequiredModalVue,
  },
  data() {
    return {
      allDelivery: [],
      openModal: false,
      deleteVisible: false,
      updateVisible: false,
      update: {
        isUpdate: false,
      },
      toastOptions: {
        open: false,
        text: "",
        style: { background: "#4CAF50" },
      },
    };
  },
  methods: {
    closeDeleteModal(emit) {
      if (emit) {
        this.deleteDelivery(this.selectedItem);
      }
      this.deleteVisible = false;
    },
    openDeleteModal(item) {
      this.selectedItem = item;
      this.deleteVisible = true;
    },
    openUpdateModal(item) {
      this.update = Object.assign(item, { isUpdate: true });
      this.updateVisible = true;
    },
    handleClose() {
      this.openModal = false;
      this.getDeliveries();
    },
    handleUpdateClose(){
      this.updateVisible = false
      this.update = {isUpdate:false}
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
              type: "success",
              style: { background: "#4CAF50" },
            };
            e;
          }
        })
        .catch((error) => {
          console.error(error);
          // this.toastOptions = {
          //   open: true,
          //   text: "Xatolik yuz berdi",
          //   type: "error",
          // };
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
            this.toastOptions = {
              open: true,
              type: "warning",
              text: "Yetkazuvchilar o`chdi",
              style: { background: "#4CAF50" },
            };
          }
        })
        .catch((error) => {
          console.error(error);
          this.toastOptions = {
            open: true,
            text: "Xatolik yuz berdi",
            type: "error",
          };
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
