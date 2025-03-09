<template>
  <div class="page">
    <div class="page-top d-flex a-center j-between">
      <h3>Non turlari</h3>
      <button class="create-button" @click="openModal = true">
        Non turini yaratish
      </button>
    </div>
    <div class="scroll page-bottom p-24">
      <div class="table">
        <div class="table-header">
          <div class="row">
            <div class="cell">№</div>
            <div class="cell">Nomi</div>
            <div class="cell">Narxi</div>
            <div class="cell"></div>
          </div>
        </div>
        <div class="table-body">
          <div v-for="(data, index) in allTypeOfBread" :key="index" class="row">
            <div class="cell">{{ index + 1 }}</div>
            <div class="cell">{{ data?.title ? data?.title : "" }}</div>
            <div class="cell">{{ data?.price ? data?.price : 0 }}</div>
            <div class="cell d-flex a-center j-end gap12">
              <Icons
                name="setting"
                title="sozlama"
                class="icon info setting"
                @click="
                  openUpdateModal({
                    title: data?.title,
                    price: data?.price,
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
            </div>
          </div>
        </div>
        <p class="text16 d-flex j-center p-24" v-if="!allTypeOfBread.length">
          Hozircha non turlari mavjud emas
        </p>
      </div>
    </div>
  </div>
  <TypeOfBreadModalVue
    v-if="openModal"
    @close="handleClose"
    @status="handleStatus($event)"
  />
  <TypeOfBreadModalVue
    :update="update"
    v-if="updateModalVisible"
    @close="closeUpdateModal"
    @status="handleStatus($event)"
  />
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
        // isupdate uchun 
      },
    };
  },
  methods: {
    handleStatus(data) {
      this.toastOptions = {
        open: true,
        text: data?.message,
        type: data?.status,
      };
    },
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
    closeUpdateModal() {
      this.updateModalVisible = false;
      this.update = { isUpdate: false };
      this.getallTypeOfBread();
    },
    handleClose() {
      this.openModal = false;
      this.getallTypeOfBread();
    },
    getallTypeOfBread() {
      const token = localStorage.getItem("user")

      api
        .get("/api/typeOfBreads")
        .then(({ data, status }) => {
          if (status === 200) {
            this.allTypeOfBread = data?.typeOfBreads;
          }
        })
        .catch((error) => {
          console.error(error);
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
            this.toastOptions = {
              open: true,
              type: "success",
              text: "Non turi o`chirilib tashlandi",
            };
            this.getallTypeOfBread();
          } else {
            this.toastOptions = {
              open: true,
              type: "error",
              text: "Non turi o`chirilib tashlanishida hatolkik yuz berdi",
            };
          }
        })
        .catch((error) => {
          console.error(error);
        });
    },
  },
  mounted() {
    this.getallTypeOfBread();
  },
};
</script>

<style></style>