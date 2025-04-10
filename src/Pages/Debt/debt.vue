<template>
  <div class="page">
    <div class="d-flex a-center j-between">
      <h3>Chiqimlar</h3>
      <div class="d-flex gap12">
        <button class="create-button" @click="debtModalVisible = true">
          Chiqim yaratish
        </button>
      </div>
    </div>
    <div class="page-bottom scroll p-24">
      <div class="table">
        <div class="table-header">
          <div class="row">
            <div class="cell">№</div>
            <div class="cell">Nomi</div>
            <div class="cell">Soni</div>
            <div class="cell">Narxi</div>
            <div class="cell">Tavsif</div>
            <div class="cell">Kimdan</div>
            <!-- <div class="cell">Boshqaruvchi</div> -->
            <div class="cell"></div>
          </div>
        </div>
        <div class="table-body">
          <div v-for="(data, index) in debts" :key="index" class="row">
            <div class="cell">{{ index + 1 }}</div>
            <div class="cell">
              {{ data.title || data.omborxonaProId?.name || "----" }}
            </div>
            <!-- <div>{{ data?.reason ? data?.reason : "" }}</div> -->
            <div class="cell">{{ data?.quantity ? data?.quantity : 0 }}</div>
            <div class="cell">
              {{ formatPrice(data?.omborxonaProId ? data?.omborxonaProId.price : data?.price || 0) }}
            </div>
            <div class="cell">
              {{ data?.description?.slice(0, 40) || data?.reason || "" }}
            </div>
            <div class="cell">
              {{ data?.sellerId?.username || data?.deliveryId?.username || data?.role ||  "" }}
            </div>
            <!-- <div class="cell">
              {{ data?.role || "" }}
            </div> -->
            <div class="cell d-flex a-center j-end gap12">
              <Icons
                @click="
                  openUpdateModal({
                    omborxonaProId: data.omborxonaProId,
                    quantity: data.quantity,
                    description: data.description,
                    sellerId: data.sellerId,
                    id: data._id,
                  })
                "
                name="setting"
                class="icon info setting"
              />
              <Icons
                name="deleted"
                title="o'chirish"
                class="icon danger"
                @click="openDeleteModal(data)"
              />
            </div>
          </div>
        </div>
      </div>
      <p class="text16 d-flex j-center p-24" v-if="!debts.length">
        Hozircha chiqimlar mavjud emas
      </p>
    </div>
  </div>
  <DebtModelVue
    v-if="debtModalVisible"
    @close="handleClose"
    @status="handleStatus($event)"
  />
  <DebtModelVue
    :update="update"
    v-if="updateModalVisible"
    @close="closeUpdateModal"
    @status="handleStatus($event)"
  />
  <TypeOfDebtModalVue
    v-if="typeOfDebtModalVisible"
    @close="closeTypeOfDebtModal"
    @status="handleStatus($event)"
  />
  <RequiredModalVue
    :isVisible="deleteModalVisible"
    @response="closeDeleteModal($event)"
  />
  <ToastiffVue :toastOptions="toastOptions" />
</template>
<script>
import api from "@/Utils/axios";
import Icons from "@/components/Template/Icons.vue";
import DebtModelVue from "./debtModel.vue";
import RequiredModalVue from "@/components/Modals/requiredModal.vue";
import ToastiffVue from "@/Utils/Toastiff.vue";
import TypeOfDebtModalVue from "./typeOfDebtModal.vue";
export default {
  components: {
    Icons,
    DebtModelVue,
    RequiredModalVue,
    ToastiffVue,
    TypeOfDebtModalVue,
    Icons,
  },
  data() {
    return {
      debts: [],
      debtModalVisible: false,
      deleteModalVisible: false,
      selectedItem: null,
      updateModalVisible: false,
      typeOfDebtModalVisible: false,
      update: {
        isUpdate: false,
      },
      toastOptions: {
        open: false,
        text: "",
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
    closeTypeOfDebtModal() {
      this.typeOfDebtModalVisible = false;
    },
    closeDeleteModal(emit) {
      if (emit) {
        this.deleteDebt(this.selectedItem);
      }
      this.deleteModalVisible = false;
      this.selectedItem = null;
    },
    openDeleteModal(item) {
      this.selectedItem = item;
      this.deleteModalVisible = true;
    },
    openUpdateModal(item) {
      this.updateModalVisible = true;
      this.update = Object.assign(item, { isUpdate: true });
    },
    handleClose() {
      this.debtModalVisible = false;
      this.getDebts();
    },
    closeUpdateModal() {
      (this.updateModalVisible = false), this.getDebts();
    },
    getDebts() {
      const token = localStorage.getItem("user")
        ? JSON.parse(localStorage.getItem("user")).token
        : "";
      api
        .get("/api/debt2s", {
          headers: {
            authorization: token,
          },
        })
        .then(({ data, status }) => {
          if (status === 200) {
            this.debts = data?.debt2s;
          }
        });
    },
    deleteDebt(data) {
      api
        .delete(
          `/api/${
            data?.role === "seller" && data?.title
              ? "debt1"
              : data?.role === "seller" && data?.omborxonaProId
              ? "debt2"
              : data?.role === "delivery" && data.description
              ? "deliveryDebt"
              : "debt2"
          }/${data._id}`
        )
        .then(({ status }) => {
          if (status === 200) {
            this.toastOptions = {
              open: true,
              text: "Chiqim o`chirilib keti",
              type: "success",
            };
            this.getDebts();
          } else {
            this.toastOptions = {
              open: true,
              text: "Chiqim o`chirilib ketishda hatolik yuz berdi",
              type: "error",
            };
          }
        })
        .catch((error) => {
          console.error(error);
        });
    },
  },
  mounted() {
    this.getDebts();
  },
};
</script>

<style>
</style>