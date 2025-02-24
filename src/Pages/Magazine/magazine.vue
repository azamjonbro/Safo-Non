<template>
  <div class="page">
    <div class="d-flex a-center j-between">
      <h3>Magazinlar</h3>
      <button class="create-button" @click="openModal = true">
        Do`kon yaratish
      </button>
    </div>
    <div class="scroll pt-24 page-bottom">
      <table>
        <thead>
          <tr>
            <th>№</th>
            <th>Nomi</th>
            <th>telefon raqami</th>
            <th>address</th>
            <th>pending</th>
            <th>remainprice</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(data, index) in allMagazine" :key="index">
            <td>{{ index + 1 }}</td>
            <td>{{ data?.title ? data?.title : "" }}</td>
            <td>{{ data?.phone ? data?.phone : "" }}</td>
            <td>{{ data?.address ? data?.address : "" }}</td>
            <td>{{ data?.pending ? data?.pending : "" }}</td>
            <td>{{ data?.remainprice ? data?.remainprice : "" }}</td>
            <td class="d-flex a-center j-end gap12">
              <Icons name="setting" title="sozlama" class="icon info setting" @click="openUpdateModal({title:data?.title,phone:data?.phone,address:data?.address,pending:data?.pending,remainprice:data?.remainprice,id:data?._id})" />
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
  <ToastiffVue :toastOptions="toastOptions" />
  <MagazineModalVue v-if="openModal" @close="handleClose" />
  <MagazineModalVue v-if="updateVisible" :update="update" @close="closeUpdateModal" />
</template>

<script>
import Icons from "@/components/Template/Icons.vue";
import api from "@/Utils/axios";
import MagazineModalVue from "./magazineModal.vue";
import RequiredModalVue from "@/components/Modals/requiredModal.vue";
import ToastiffVue from "@/Utils/Toastiff.vue";
export default {
  components: {
    Icons,
    MagazineModalVue,
    RequiredModalVue,
    ToastiffVue,
  },
  data() {
    return {
      openModal: false,
      allMagazine: [],
      deleteVisible: false,
      selectedItem: null,
      updateVisible: false,
      toastOptions: {
        open: false,
        text: "",
        style: { background: "#4CAF50" },
      },
      update: {
        isUpdate: false,
      },
    };
  },
  methods: {
    closeDeleteModal(emit) {
      if (emit) {
        this.deleteMagzine(this.selectedItem);
      }
      this.deleteVisible = false;
    },
    openDeleteModal(item) {
      this.selectedItem = item;
      this.deleteVisible = true;
    },
    handleClose() {
      this.openModal = false;
      this.getMagazine();
    },
    closeUpdateModal() {
      this.updateVisible = false;
      this.update = {isUpdate:false}
      this.getMagazine();
    },
    openUpdateModal(item) {
      this.update = Object.assign(item, { isUpdate: true });
      this.updateVisible = true;
    },
    getMagazine() {
      const token = localStorage.getItem("user")
        ? JSON.parse(localStorage.getItem("user"))?.accessToken
        : "";

      api
        .get("/api/magazines", {
          headers: {
            authorization: token,
          },
        })
        .then(({ data, status }) => {
          if (status === 200) {
            this.allMagazine = data?.magazines;
            this.toastOptions = {
              open: true,
              type:"success",
              text: "Do`konlar keldi",
              style: { background: "#4CAF50" },
            };
          }
        })
        .catch((error) => {
          console.error(error);
          this.toastOptions = {
            open: true,
            type: "error",
            text: "Xatolik yuzberdi",
          };
        });
    },
    deleteMagzine(id) {
      const token = localStorage.getItem("user")
        ? JSON.parse(localStorage.getItem("user"))?.accessToken
        : "";
      api
        .delete("/api/magazine/" + id, {
          headers: {
            authorization: token,
          },
        })
        .then(({ status }) => {
          if (status === 200) {
            this.getMagazine();
            this.toastOptions = {
              open: true,
              text: "Do`kon o`chib keti",
              style: { background: "#4CAF50" },
            };
          }
        })
        .catch((error) => {
          console.error(error);
          this.toastOptions = {
            open: true,
            type: "error",
            text: "Xatolik yuzberdi",
          };
        });
    },
  },
  mounted() {
    this.getMagazine();
  },
};
</script>

<style>
</style>