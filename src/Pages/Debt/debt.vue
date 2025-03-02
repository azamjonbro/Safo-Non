<template>
  <div class="page">
    <div class="d-flex a-center j-between">
      <h3>Chiqimlar</h3>
     <div class="d-flex gap12">
      <button class="create-button"  @click="debtModalVisible = true">
        Chiqim yaratish
      </button>
     </div>
    </div>
    <div class="page-bottom scroll p-24">
      <table>
        <thead>
          <tr>
            <th>№</th>
            <th>Title</th>
            <th>quantity</th>
            <th>description</th>
            <th>sellerId</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(data, index) in debts" :key="index">
            <td>{{ index + 1 }}</td>
            <td>{{ data.title  }}</td>
            <!-- <td>{{ data?.reason ? data?.reason : "" }}</td> -->
            <td>{{ data?.quantity ? data?.quantity : 0 }}</td>
            <td>{{ data?.description ? data?.description.slice(0,40) : "" }}</td>
            <td>{{ data?.sellerId ? data?.sellerId?.username : "id" }}</td>
            <td class="d-flex a-center j-end gap12">
              <Icons
                name="setting"
                title="sozlama"
                class="icon info setting"
                @click="
                  openUpdateModal({
                    title: data?.title,
                    quantity: data?.quantity,
                    description: data?.description,
                    reason: data?.reason,
                    sellerId: data?.sellerId._id,
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
    deleteDebt(id) {
      const token = localStorage.getItem("user")
        ? JSON.parse(localStorage.getItem("user"))?.accessToken
        : "";
      api
        .delete("/api/debt2/" + id, {
          headers: {
            authorization: token,
          },
        })
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