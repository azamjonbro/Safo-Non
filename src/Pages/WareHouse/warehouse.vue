<template>
  <div class="page">
    <div class="d-flex a-center j-between">
      <h3>Omborxonalar</h3>
      <button class="create-button" @click="createModalVisible = true">
        Omborxona yaratish
      </button>
    </div>
    <div class="scroll page-bottom p-24">
      <table>
        <thead>
          <tr>
            <th>№</th>
            <th>typeId</th>
            <th>price</th>
            <th>quantity</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(data, index) in warehouses" :key="index">
            <td>{{ index + 1 }}</td>
            <td>{{ data?.typeId ? data?.typeId?.name : "id" }}</td>
            <td>{{ data?.price ? data?.price : 0 }}</td>
            <td>{{ data?.quantity ? data?.quantity : 0 }}</td>
            <td class="d-flex a-center j-end gap12">
              <Icons
                name="setting"
                title="sozlama"
                class="icon info setting"
                @click="
                  openUpdateModal({
                    typeId: data?.typeId,
                    price: data?.price,
                    quantity: data?.quantity,
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
  <WarehouseModalVue v-if="createModalVisible" @close="closeCreateModal" />
  <WarehouseModalVue
    :update="update"
    v-if="updateModalVisible"
    @close="closeUpdateModal"
  />
  <RequiredModalVue
    :isVisible="deleteModalVisible"
    @response="closeDeleteModal($event)"
  />
</template>

<script>
import api from "@/Utils/axios";
import Icons from "@/components/Template/Icons.vue";
import RequiredModalVue from "@/components/Modals/requiredModal.vue";
import WarehouseModalVue from "./warehouseModal.vue";
export default {
  components: {
    Icons,
    RequiredModalVue,
    WarehouseModalVue,
  },
  data() {
    return {
      warehouses: [],
      createModalVisible: false,
      deleteModalVisible: false,
      updateModalVisible: false,
      selectedItem: null,
      update: {
        isUpdate: false,
      },
    };
  },
  methods: {
    openUpdateModal(item) {
      this.updateModalVisible = true;
      this.update = Object.assign(item, { isUpdate: true });
    },
    closeUpdateModal() {
      this.updateModalVisible = false;
      this.update = { isUpdate: false };
      this.getWareHouses();
    },
    openDeleteModal(item) {
      this.selectedItem = item;
      this.deleteModalVisible = true;
    },
    closeDeleteModal(emit) {
      if (emit) {
        this.deleteWareHouse(this.selectedItem);
      }
      this.deleteModalVisible = false;
    },
    closeCreateModal() {
      (this.createModalVisible = false), this.getWareHouses();
    },
    getWareHouses() {
      const token = localStorage.getItem("user")
        ? JSON.parse(localStorage.getItem("user")).token
        : "";
      api
        .get("/api/warehouses", {
          headers: {
            authorization: token,
          },
        })
        .then(({ data, status }) => {
          if (status === 200) {
            this.warehouses = data?.warehouses;
          }
        })
        .catch((error) => {
          console.error(error);
        });
    },
    deleteWareHouse(id) {
      const token = localStorage.getItem("user")
        ? JSON.parse(localStorage.getItem("user")).token
        : "";
      api
        .delete("/api/warehouse/" + id, {
          headers: {
            authorization: token,
          },
        })
        .then(({ status }) => {
          if (status === 200) {
            this.getWareHouses();
          }
        })
        .catch((error) => {
          console.error(error);
        });
    },
  },
  mounted() {
    this.getWareHouses();
  },
};
</script>

<style>
</style>