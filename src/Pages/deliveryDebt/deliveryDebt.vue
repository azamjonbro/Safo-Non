<template>
  <div class="page">
    <div class="page-top d-flex a-center j-between">
      <h3>Chiqimlar</h3>
      
      <button class="create-button" @click="createModalVisible = true">
        Chiqimlar yaratish
      </button>
    </div>
    <div class="scroll page-bottom p-24">
      <div class="table">
        <div class="table-header">
          <div class="row">
            <div class="cell">№</div>
            <div class="cell">Sana</div>
            <div class="cell">Nomi</div>
            <div class="cell">Narxi</div>
            <div class="cell">Tavsif</div>
            <div class="cell"></div>.
          </div>
        </div>
        <div class="table-body">
          <div class="row" v-for="(data, index) in deliveryDebts" :key="index">
            <div class="cell">{{ index + 1 }}</div>
            <div class="cell">{{ data.title }}</div>
            <div class="cell">{{ data.description }}</div>
            <div class="cell">{{ formatPrice(data.price) }}</div>
            <div class="cell">{{ formatDate(new Date(data.createdAt)) }}</div>
            <div class="cell d-flex a-center gap12 j-end">
              <Icons
                name="setting"
                title="sozlama"
                class="icon info setting"
                @click="
                  openUpdateModal({
                    description: data?.description,
                    price: data?.price,
                    id: data?._id,
                  })
                "
              />
              <Icons
                name="deleted"
                title="o'chirish"
                class="icon danger"
                @click="(selectedItem = data?._id), (deleteModalVisible = true)"
              />
            </div>
          </div>
        </div>
      </div>
      <p class="text16 d-flex j-center p-24" v-if="!deliveryDebts.length">
        Hozircha Chqimlar mavjud emas
      </p>
    </div>
  </div>
  <DeliveryDebtModalVue
    v-if="createModalVisible"
    @close="(createModalVisible = false), getDeliveryDebts()"
    @status="handleStatus"
  />
  <ToastiffVue :toastOptions="toastOptions" />
  <RequiredModalVue
    :isVisible="deleteModalVisible"
    @response="closeDeleteModal($event)"
  />
    <DeliveryDebtModalVue
    v-if="updateModalVisible"
    @close="(updateModalVisible = false), getDeliveryDebts()"
    @status="handleStatus"
    :update="update"
  />
</template>


<script>
import api from "@/Utils/axios";
import Icons from "@/components/Template/Icons.vue";
import DeliveryDebtModalVue from "./deliveryDebtModal.vue";
import ToastiffVue from "@/Utils/Toastiff.vue";
import RequiredModalVue from "@/components/Modals/requiredModal.vue";
export default {
  components: {
    DeliveryDebtModalVue,
    ToastiffVue,
    Icons,
    RequiredModalVue,
  },
  data() {
    return {
      deliveryDebts: [],
      toastOptions: {
        open: false,
        text: "",
        style: { background: "#4CAF50" },
      },
      createModalVisible: false,
      selectedItem: null,
      deleteModalVisible: false,
      update:{
        isUpdate:false
      },
      updateModalVisible:false,
    };
  },
  methods: {
    openUpdateModal(item){
        this.update = {
            isUpdate:true,
            ...item
        }
        this.updateModalVisible = true
    },
    closeDeleteModal(emit) {
      if (emit) {
        this.deleteDeliveryDebt(this.selectedItem);
      }
      this.deleteModalVisible = false;
      this.selectedItem = null;
    },
    handleStatus(data) {
      this.toastOptions = {
        open: true,
        text: data?.message,
        type: data?.status,
      };
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
    getDeliveryDebts() {
      api
        .get("/api/deliveryDebts")
        .then(({ status, data }) => {
          if (status === 200) {
            this.deliveryDebts = data?.deliveryDebts;
          }
        })
        .catch((error) => {
          console.error(error);
        });
    },
    deleteDeliveryDebt(id) {
      api
        .delete("/api/deliveryDebt/" + id)
        .then(({ status }) => {
          if (status === 200) {
            this.toastOptions = {
              open: true,
              type: "success",
              text: "Chiqim o`chirildi",
            };
            this.getDeliveryDebts();
          }
        })
        .catch((error) => {
          console.error(error);
        });
    },
  },
  mounted() {
    this.getDeliveryDebts();
  },
};
</script>

<style>
</style>