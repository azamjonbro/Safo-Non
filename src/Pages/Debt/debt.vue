<template>
  <div class="page">
    <div class="d-flex a-center j-between">
      <h3>Chiqimlar</h3>
      <button class="create-button" @click="debtModalVisible = true">
        Chiqim yaratish
      </button>
    </div>
    <div class="page-bottom scroll p-24">
      <table>
        <thead>
          <tr>
            <th>№</th>
            <th>Rasxod id</th>
            <th>quantity</th>
            <th>description</th>
            <th>reason</th>
            <th>sellerId</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(data, index) in debts" :key="index">
            <td>{{ index + 1 }}</td>
            <td>{{ data?.debtId ? data?.debtId?.title : "id" }}</td>
            <td>{{ data?.quantity ? data?.quantity : 0 }}</td>
            <td>{{ data?.description ? data?.description : "" }}</td>
            <td>{{ data?.reason ? data?.reason : "" }}</td>
            <td>{{ data?.sellerId ? data?.sellerId?.username : "id" }}</td>
            <td class="d-flex a-center j-end gap12">
              <Icons
                name="setting"
                title="sozlama"
                class="icon info setting"
                @click="
                  openUpdateModal({
                    debtId: data?.debtId,
                    quantity: data?.quantity,
                    description: data?.description,
                    reason: data?.reason,
                    sellerId: data?.sellerId,
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
  <DebtModelVue v-if="debtModalVisible" @close="handleClose" />
  <DebtModelVue :update="update" v-if="updateModalVisible" @close="closeUpdateModal" />
  <RequiredModalVue
    :isVisible="deleteModalVisible"
    @response="closeDeleteModal($event)"
  />
</template>
<script>
import api from "@/Utils/axios";
import Icons from "@/components/Template/Icons.vue";
import DebtModelVue from "./debtModel.vue";
import RequiredModalVue from "@/components/Modals/requiredModal.vue";
export default {
  components: {
    Icons,
    DebtModelVue,
    RequiredModalVue,
  },
  data() {
    return {
      debts: [],
      debtModalVisible: false,
      deleteModalVisible: false,
      selectedItem: null,
      updateModalVisible: false,
      update: {
        isUpdate: false,
      },
    };
  },
  methods: {
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
    closeUpdateModal(){
      this.updateModalVisible = false,
      this.getDebts()
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
            this.getDebts();
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