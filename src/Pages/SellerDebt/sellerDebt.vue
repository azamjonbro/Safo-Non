<template>
  <div class="page d-flex column gap24">
    <div class="page-top d-flex a-center j-between">
      <h3>Chiqimlar</h3>
      <div class="d-flex a-center gap12">
        <button class="create-button" @click="createModal2Visible = true">
          Chiqimlar 2 yaratish
        </button>
        <button class="create-button" @click="createModalVisible = true">
          Chiqimlar yaratish
        </button>
      </div>
    </div>
    <div class="border9 radius1 p12">
      <div class="d-flex gap12 tabbar">
        <button
          :class="{ active: activePage === 'debt2' }"
          @click="changeTab('debt2')"
        >
          Chiqimlar 1
        </button>
        <button
          :class="{ active: activePage === 'debt1' }"
          @click="changeTab('debt1')"
        >
          Chiqimlar 1
        </button>
      </div>
    </div>
    <div class="scroll page-bottom p-24">
      <div class="table" v-if="activePage === 'debt2'">
        <div class="table-header">
          <div class="row">
            <div class="cell">№</div>
            <div class="cell">Sana</div>
            <div class="cell">Nomi</div>
            <div class="cell">Soni (Dona)</div>
            <div class="cell">Narxi</div>
            <div class="cell">Tasnifi Yoki sababi</div>
            <div class="cell"></div>
          </div>
        </div>
        <div class="table-body">
          <div class="row" v-for="(data, index) in sellerDebts" :key="index">
            <div class="cell">{{ index + 1 }}</div>
            <div class="cell">{{ formatDate(new Date(data.createdAt)) }}</div>
            <div class="cell">
              {{ data.omborxonaProId?.name || data?.title || "" }}
            </div>
            <div class="cell">{{ data.quantity || 0 }}</div>
            <div class="cell">
              {{ formatPrice(data.omborxonaProId?.price || 0) }}
            </div>
            <div class="cell">{{ data.description }}</div>
            <div class="cell d-flex j-end gap12">
              <Icons
                name="setting"
                title="sozlama"
                class="icon info setting"
                @click="
                  (update = {
                    omborxonaProId: data?.omborxonaProId,
                    quantity: data?.quantity,
                    description: data?.description,
                    price: data.omborxonaProId.price,
                    id: data._id,
                    isUpdate: true,
                  }),
                    (updateModal2Visible = true)
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
        <p class="text16 d-flex j-center p-24" v-if="!sellerDebts.length">
          Hozircha chiqimlar mavjud emas
        </p>
      </div>
      <div class="table" v-if="activePage === 'debt1'">
        <div class="table-header">
          <div class="row">
            <div class="cell">№</div>
            <div class="cell">Sana</div>
            <div class="cell">Nomi</div>
            <div class="cell">Soni (Dona)</div>
            <div class="cell">Narxi</div>
            <div class="cell">sababi</div>
            <div class="cell"></div>
          </div>
        </div>
        <div class="table-body">
          <div class="row" v-for="(data, index) in sellerDebts2" :key="index">
            <div class="cell">{{ index + 1 }}</div>
            <div class="cell">{{ formatDate(new Date(data.createdAt)) }}</div>
            <div class="cell">
              {{ data?.title || "" }}
            </div>
            <div class="cell">{{ data.quantity || 0 }}</div>
            <div class="cell">
              {{ formatPrice(data?.price || 0) }}
            </div>
            <div class="cell">{{ data?.reason }}</div>
            <div class="cell d-flex j-end gap12">
              <Icons
                name="setting"
                title="sozlama"
                class="icon info setting"
                @click="
                  (update2 = {
                    title: data.title,
                    quantity: data.quantity,
                    price: data.price,
                    id: data._id,
                    reason: data.reason,
                    isUpdate: true,
                  }),
                    (updateModalVisible = true)
                "
              />
              <Icons
                name="deleted"
                title="o'chirish"
                class="icon danger"
                @click="openDelete2Modal(data?._id)"
              />
            </div>
          </div>
        </div>
        <p class="text16 d-flex j-center p-24" v-if="!sellerDebts.length">
          Hozircha chiqimlar mavjud emas
        </p>
      </div>
    </div>
  </div>
  <SellerDebtModalVue
    v-if="createModalVisible"
    @close="closeCreateModal"
    @status="handleStatus($event)"
  />
  <SellerDebtModalVue
    v-if="updateModalVisible"
    :update="update2"
    @close="closeUpdateModal"
    @status="handleStatus($event)"
  />
  <RequiredModalVue
    :isVisible="deleteModalVisible"
    @response="closeDeleteModal($event)"
  />
  <ToastiffVue :toastOptions="toastOptions" />
  <SellerDebt2ModalVue
    v-if="createModal2Visible"
    @close="(createModal2Visible = false), getSellerDebts()"
    @status="handleStatus($event)"
  />
  <SellerDebt2ModalVue
    v-if="updateModal2Visible"
    @close="(updateModal2Visible = false), getSellerDebts()"
    :update="update"
    @status="handleStatus($event)"
  />
  <RequiredModalVue
    :isVisible="delete2ModalVisible"
    @response="closeDelete2Modal($event)"
  />
</template>

<script>
import api from "@/Utils/axios";
import Icons from "@/components/Template/Icons.vue";
import SellerDebtModalVue from "./sellerDebtModal.vue";
import ToastiffVue from "@/Utils/Toastiff.vue";
import RequiredModalVue from "@/components/Modals/requiredModal.vue";
import SellerDebt2ModalVue from "./sellerDebt2Modal.vue";
export default {
  components: {
    Icons,
    SellerDebtModalVue,
    RequiredModalVue,
    ToastiffVue,
    SellerDebt2ModalVue,
  },
  data() {
    return {
      createModalVisible: false,
      createModal2Visible: false,
      sellerDebts: [],
      sellerDebts2: [],
      deleteModalVisible: false,
      selectedItem: null,
      toastOptions: {
        open: false,
        text: "",
      },
      update: {
        isUpdate: false,
      },
      update2: {
        isUpdate: false,
      },
      updateModalVisible: false,
      activePage: "debt2",
      delete2ModalVisible: false,
      updateModal2Visible: false,
    };
  },
  methods: {
    openDelete2Modal(id) {
      this.selectedItem = id;
      this.delete2ModalVisible = true;
    },
    closeDelete2Modal(emit) {
      if (emit) {
        this.deleteDebt(this.selectedItem, "debt1");
      }
      this.delete2ModalVisible = false;
      this.selectedItem = null;
      this.getSellerDebts2()
    },
    changeTab(tab) {
      this.activePage = tab;
    },
    closeDeleteModal(emit) {
      if (emit) {
        this.deleteDebt(this.selectedItem, "debt2");
      }
      this.deleteModalVisible = false;
      this.selectedItem = null;
      this.getSellerDebts();
    },
    handleStatus(data) {
      this.toastOptions = {
        open: true,
        text: data?.message,
        type: data?.status,
      };
    },
    closeCreateModal() {
      (this.createModalVisible = false), this.getSellerDebts2();
    },
    closeUpdateModal() {
      (this.updateModalVisible = false), this.getSellerDebts2();
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
    getSellerDebts() {
      api
        .get("/api/debt2s")
        .then(({ status, data }) => {
          if (status === 200) {
            this.sellerDebts = data?.debt2s;
          }
        })
        .catch((error) => {
          console.error(error);
        });
    },
    getSellerDebts2() {
      api
        .get("/api/debt1s")
        .then(({ status, data }) => {
          if (status === 200) {
            this.sellerDebts2 = data?.debt1s;
          }
        })
        .catch((error) => {
          console.error(error);
        });
    },
    deleteDebt(id, path) {
      api
        .delete(`/api/${path}/` + id)
        .then(({ status }) => {
          if (status === 200) {
            this.toastOptions = {
              open: true,
              text: "Chiqim o`chirilib keti",
              type: "success",
            };
            path === "debt2" ? this.getSellerDebts() : this.getSellerDebts2();
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
    this.getSellerDebts();
    this.getSellerDebts2();
  },
};
</script>

<style>
.header {
  font-weight: bold;
  border-bottom: 1px solid #ddd;
  padding-bottom: 8px;
  margin-bottom: 12px;
}

.items {
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 6px;
}

.archive {
  width: 100%;
  max-height: 300px;
  background: #f9f9f9;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-sizing: border-box;
}

.icon.active {
  transform: rotate(180deg);
  transition: transform 0.3s;
}

.flexbox > .flex1 {
  flex: 1;
  text-align: start;
}

.tabbar > button {
  border: 1px solid #919191;
  font-size: 16px;
  padding: 10px 12px;
  cursor: pointer;
  width: 50%;
}

.tabbar > button.active {
  background-color: #007bff;
  color: #fff;
  border: 1px solid #007bff;
}
</style>
