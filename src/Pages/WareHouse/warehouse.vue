<template>
  <div class="page">
    <div class="d-flex a-center j-between">
      <h3>Omborxona</h3>
      <button class="create-button" @click="createModalVisible = true">
        Mahsulot yaratish
      </button>
    </div>
    <div class="scroll page-bottom p-24">
      <div>
        <div class="table-header">
          <div class="row">
            <div class="cell">№</div>
            <div class="cell">Nomi</div>
            <div class="cell">Narxi</div>
            <div class="cell">Soni</div>
            <div class="cell">Umumiy summa</div>
            <div class="cell"></div>
          </div>
        </div>
        <div class="table-body">
          <div v-for="(data, index) in warehouses" :key="index">
            <div class="row-items">
              <div class="top">
                <div class="cell">{{ index + 1 }}</div>
                <div class="cell">{{ data?.name ? data?.name : "id" }}</div>
                <div class="cell">{{ data?.price ? data?.price : 0 }}</div>
                <div class="cell">
                  {{ data?.quantity ? data?.quantity : 0 }}
                </div>
                <div class="cell">
                  {{ formatPrice(data.totalPrice || 0) }} sum
                </div>
                <div class="cell d-flex a-center j-end gap12">
                  <Icons
                    name="create"
                    class="info icon"
                    @click="openWarehouseType(data?._id)"
                  />
                  <Icons
                    name="setting"
                    title="sozlama"
                    class="icon info setting"
                    @click="
                      openUpdateModal({
                        name: data?.name,
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
                  <Icons
                    name="bottomArrow"
                    class="icon"
                    @click="toggleHistory(data?._id)"
                    :class="{ rotated: expanedId === data?._id }"
                  />
                </div>
              </div>
              <div v-if="expanedId === data?._id" class="history">
                <div class="history-header">
                  <div class="row-top">
                    <div class="cell">Sana</div>
                    <div class="cell">Sonni</div>
                    <div class="cell">Narxi</div>
                    <div class="cell">Turi</div>
                    <div class="cell"></div>
                  </div>
                </div>
                <div class="history-body">
                  <div
                    class="row"
                    v-for="(item, index) in data?.history"
                    :key="index"
                  >
                    <div class="cell">{{ formatDate(item?.createdAt) }}</div>
                    <div class="cell">{{ item?.quantity }}</div>
                    <div class="cell">{{ item?.price }}</div>
                    <div class="cell">{{ item?.type }}</div>
                    <div class="cell d-flex j-end">
                      <Icons
                        name="deleted"
                        title="o'chirish"
                        class="icon danger"
                        @click="openDeleteWareHouseType(item?._id)"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <p class="text16 d-flex j-center p-24" v-if="!warehouses.length">
          Hozircha omborxona mavjud emas
        </p>
      </div>
    </div>
  </div>
  <WarehouseModalVue
    v-if="createModalVisible"
    @close="closeCreateModal"
    @status="handleStatus($event)"
  />
  <WarehouseModalVue
    :update="update"
    v-if="updateModalVisible"
    @close="closeUpdateModal"
    @status="handleStatus($event)"
  />
  <WarehouseAddModelVue
    v-if="addWarehouseTypeVisible"
    @close="closeWarehouseType"
    :id="warehouseId"
    @status="handleStatus($event)"
  />
  <RequiredModalVue
    :isVisible="deleteModalVisible"
    @response="closeDeleteModal($event)"
  />
  <RequiredModalVue
    :isVisible="deleteWareHouseTypeVisible"
    @response="closeDeleteWareHouseType($event)"
  />
  <ToastiffVue :toastOptions="toastOptions" />
</template>

<script>
import api from "@/Utils/axios";
import Icons from "@/components/Template/Icons.vue";
import RequiredModalVue from "@/components/Modals/requiredModal.vue";
import WarehouseModalVue from "./warehouseModal.vue";
import ToastiffVue from "@/Utils/Toastiff.vue";
import WarehouseAddModelVue from "./warehouseAddModel.vue";
export default {
  components: {
    Icons,
    RequiredModalVue,
    WarehouseModalVue,
    ToastiffVue,
    WarehouseAddModelVue,
  },
  data() {
    return {
      warehouses: [],
      createModalVisible: false,
      deleteModalVisible: false,
      updateModalVisible: false,
      selectedItem: null,
      addWarehouseTypeVisible: false,
      deleteWareHouseTypeVisible: false,
      expanedId: "",
      update: {
        isUpdate: false,
      },
      warehouseId: "",
      toastOptions: {
        open: false,
        type: "",
        text: "",
        style: { background: "#4CAF50" },
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
    toggleHistory(id) {
      if (this.expanedId == id) {
        this.expanedId = null;
        return;
      }
      this.expanedId = id;
    },
    formatDate(date1) {
      const date = new Date(date1);
      const day = String(date.getDate()).padStart(2, "0");
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const year = date.getFullYear();

      return `${day}.${month}.${year}`;
    },
    formatPrice(price) {
      return new Intl.NumberFormat("ru-RU").format(price);
    },
    openDeleteWareHouseType(id) {
      this.selectedItem = id;
      this.deleteWareHouseTypeVisible = true;
    },
    closeDeleteWareHouseType(emit) {
      console.log(emit);

      if (emit) {
        this.deleteWareHouseType(this.selectedItem);
      }
      this.selectedItem = null;
      this.deleteWareHouseTypeVisible = false;
      this.getWareHouses();
    },
    openWarehouseType(id) {
      this.warehouseId = id;
      this.addWarehouseTypeVisible = true;
    },
    closeWarehouseType(emit) {
      this.selectedItem = null;
      this.addWarehouseTypeVisible = false;
      this.getWareHouses();
    },
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
        .get("/api/typeOfWareHouses", {
          headers: {
            authorization: token,
          },
        })
        .then(({ data, status }) => {
          if (status === 200) {
            this.warehouses = data?.typeOfWareHouses;
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
        .delete("/api/typeOfWareHouse/" + id, {
          headers: {
            authorization: token,
          },
        })
        .then(({ status }) => {
          if (status === 200) {
            this.toastOptions = {
              open: true,
              type: "success",
              text: "Omborxona o`chirildi",
            };
            this.getWareHouses();
          } else {
            this.toastOptions = {
              open: true,
              type: "error",
              text: "Omborxona o`chirilishida hatolik yuz berdi",
            };
          }
        })
        .catch((error) => {
          console.error(error);
        });
    },
    deleteWareHouseType(id) {
      api
        .delete("/api/warehouse/" + id)
        .then(({ status }) => {
          if (status === 200) {
            this.toastOptions = {
              open: true,
              type: "success",
              text: "Omborxona turi o`chirildi",
            };
            this.getWareHouses();
          } else {
            this.toastOptions = {
              open: true,
              type: "error",
              text: "Omborxona turi o`chirilishida hatolik yuz berdi",
            };
          }
        })
        .catch((error) => {
          console.error(error);
          this.toastOptions = {
            oepn: true,
            type: "error",
            text: "Xatolik yuz berdi",
          };
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