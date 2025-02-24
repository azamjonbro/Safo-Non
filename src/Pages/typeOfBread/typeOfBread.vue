<template>
  <div class="page">
    <div class="page-top d-flex a-center j-between">
      <h3>Non turlari</h3>
      <button class="create-button" @click="openModal = true">
        Non turini yaratish
      </button>
    </div>
    <div class="scroll page-bottom p-24">
      <table>
        <thead>
          <tr>
            <th>№</th>
            <th>Nomi</th>
            <th>Narxi</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(data, index) in allTypeOfBread" :key="index">
            <td>{{ index + 1 }}</td>
            <td>{{ data?.title ? data?.title : "" }}</td>
            <td>{{ data?.price ? data?.price : 0 }}</td>
            <td class="d-flex a-center j-end gap12">
              <Icons name="setting" title="sozlama" class="icon info setting" @click="openUpdateModal({title:data?.title,price:data?.price,id:data?._id})" />
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
  <TypeOfBreadModalVue v-if="openModal" @close="handleClose" />
  <TypeOfBreadModalVue :update="update" v-if="updateModalVisible" @close="closeUpdateModal" />
  <ToastiffVue :toastOptions="toastOptions" />
  <RequiredModalVue
    :isVisible="deleteModalVisible"
    @response="closeDeleteModal($event)"
  />
</template>

<script>
import Icons from "@/components/Template/Icons.vue";
import TypeOfBreadModalVue from "./typeOfBreadModal.vue";
import api from "@/Utils/axios";
import ToastiffVue from "@/Utils/Toastiff.vue";
import RequiredModalVue from "@/components/Modals/requiredModal.vue";
export default {
  components: {
    TypeOfBreadModalVue,
    Icons,
    ToastiffVue,
    RequiredModalVue,
  },
  data() {
    return {
      openModal: false,
      allTypeOfBread: [],
      deleteModalVisible: false,
      updateModalVisible: false,
      selectedItem: null,
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
        this.deleteTypeOfBread(this.selectedItem);
      }
      this.deleteModalVisible = false;
    },
    openDeleteModal(item) {
      this.selectedItem = item;
      this.deleteModalVisible = true;
    },
    openUpdateModal(item) {
      this.updateModalVisible = true;
      this.update = Object.assign(item, { isUpdate: true });
    },
    closeUpdateModal(){
      this.updateModalVisible = false
      this.update = {isUpdate:false}
      this.getallTypeOfBread()
    },
    handleClose() {
      this.openModal = false;
      this.getallTypeOfBread();
    },
    getallTypeOfBread() {
      const token = localStorage.getItem("user")
        ? JSON.parse(localStorage.getItem("user"))?.accessToken
        : "";

      api
        .get("/api/typeOfBreads", {
          headers: {
            authorization: token,
          },
        })
        .then(({ data, status }) => {
          if (status === 200) {
            this.allTypeOfBread = data?.typeOfBreads;
            this.toastOptions = {
              open: true,
              type:"success",
              text: "Non turlari keldi",
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
    deleteTypeOfBread(id) {
      const token = localStorage.getItem("user")
        ? JSON.parse(localStorage.getItem("user"))?.accessToken
        : "";
      api
        .delete("/api/typeOfBread/" + id, {
          headers: {
            authorization: token,
          },
        })
        .then(({ status }) => {
          if (status === 200) {
            this.getallTypeOfBread();
            this.toastOptions = {
              open: true,
              text: "Non turi o`chirib tashlandi",
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
    this.getallTypeOfBread();
  },
};
</script>

<style></style>