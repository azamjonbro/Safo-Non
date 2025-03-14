<template>
  <transition name="slide-modal">
    <div class="modal" @click.self="$emit('close')">
      <div class="modal-content relative">
        <Icons name="xIcon" class="xIcon" @click="closeModal" />
        <h2>Chiqim yaratish</h2>

        <form>
          <div class="modal-form">
            <div class="form-group">
              <label for="omborxonaProId">Rasxod turi</label>
              <CustomSelectVue
                @blur="validateField('omborxonaProId')"
                @input="sellectDebtId($event)"
                :search="true"
                :options="
                  debtIds.map((item) => {
                    return { text: item.name, value: item };
                  })
                "
                :placeholder="'Rasxod turini  tanlang'"
                :selected="debt.omborxonaProId"
              />
              <p v-if="errors.debtId" class="error-text">{{ errors.debtId }}</p>
            </div>
            <div class="form-group">
              <label for="price">Narxi</label>
              <input
                id="price"
                type="number"
                placeholder="Rasxod narxini kiriting"
                v-model="debt.price"
                readonly
                @blur="validateField('price')"
              />
              <p v-if="errors.price" class="error-text">
                {{ errors.price }}
              </p>
            </div>
            <div class="form-group">
              <label for="sellerId">Seller Id</label>
              <CustomSelectVue
                :search="true"
                :options="sellerIds"
                @input="sellectSellerId($event)"
                :placeholder="'Rasxod sellerIdni tanlang'"
                @blur="validateField('sellerId')"
                :selected="debt.sellerId"
              />
              <p v-if="errors.sellerId" class="error-text">
                {{ errors.sellerId }}
              </p>
            </div>
            <div class="form-group">
              <label for="quantity">Soni (Dona)</label>
              <input
                id="quantity"
                type="number"
                placeholder="Rasxod sonini kiriting"
                v-model="debt.quantity"
                @blur="validateField('quantity')"
              />
              <p v-if="errors.quantity" class="error-text">
                {{ errors.quantity }}
              </p>
            </div>
            <div class="form-group">
              <label for="description">Tavsif</label>
              <input
                id="description"
                type="text"
                placeholder="Chiqim uchun tavsif kiriting"
                v-model="debt.description"
                @blur="validateField('description')"
              />
              <p v-if="errors.description" class="error-text">
                {{ errors.description }}
              </p>
            </div>

            <!-- <div class="form-group">
              <label for="reason">Reason</label>
              <input
                id="reason"
                type="text"
                placeholder="Rasxod reaSoni (Dona) kiriting"
                v-model="debt.reason"
                @blur="validateField('reason')"
              />
              <p v-if="errors.reason" class="error-text">
                {{ errors.reason }}
              </p>
            </div> -->
          </div>
        </form>

        <div class="modal-buttons d-flex j-end a-center gap24">
          <button type="button" class="action-button" @click="closeModal">
            Chiqish
          </button>
          <button
            type="submit"
            @click="submitForm"
            class="action-button"
            :disabled="isSubmitting"
          >
            {{
              !isUpdate
                ? isSubmitting
                  ? "Yaratilmoqda..."
                  : "Yaratish"
                : isSubmitting
                ? "Yangilanmoqda..."
                : "Yangilash"
            }}
          </button>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
import Icons from "@/components/Template/Icons.vue";
import api from "@/Utils/axios";
import CustomSelectVue from "@/components/Template/customSelect.vue";
export default {
  components: {
    Icons,
    CustomSelectVue,
  },
  data() {
    return {
      isUpdate: false,
      isSubmitting: false,
      debt: {
        omborxonaProId: "",
        quantity: 0,
        description: "",
        sellerId: "",
        price: 0,
      },
      errors: {},
      debtIds: [],
      sellerIds: [],
    };
  },
  props: {
    update: {
      type: Object,
      required: true,
    },
  },
  methods: {
    closeModal() {
      this.$emit("close");
      this.isUpdate = false;
    },
    getDebtIds() {
      api
        .get("/api/typeOfWareHouses")
        .then(({ data, status }) => {
          if (status === 200) {
            this.debtIds = data.typeOfWareHouses;
          }
        })
        .catch((error) => {
          console.error(error);
        });
    },
    getSellerIds() {
      const token = localStorage.getItem("user")
        ? JSON.parse(localStorage.getItem("user"))?.accessToken
        : "";
      api
        .get("/api/sellers", {
          headers: {
            authorization: token,
          },
        })
        .then(({ data, status }) => {
          if (status === 200) {
            this.sellerIds = data.sellers.map((item) => {
              return { text: item.username, value: item._id };
            });
          }
        })
        .catch((error) => {
          console.error(error);
        });
    },
    sellectDebtId(id) {
      this.debt.omborxonaProId = id._id;
      this.debt.price = id.price;
    },
    sellectSellerId(id) {
      this.debt.sellerId = id;
    },
    validateField(field) {
      this.errors[field] = "";
      if (field === "sellerId" && !this.debt.sellerId.trim()) {
        this.errors.sellerId = "Rasxodni rasxod turi  bo'sh bo'lmasligi kerak";
      }
      if (field === "omborxonaProId" && !this.debt.omborxonaProId.trim()) {
        this.errors.omborxonaProId =
          "Rasxodni rasxod turi  bo'sh bo'lmasligi kerak";
      }

      if (field === "description" && !this.debt.description.trim()) {
        this.errors.description =
          "Rasxodni description bo'sh bo'lmasligi kerak";
      }

      if (
        field === "quantity" &&
        (!this.debt.quantity ||
          isNaN(this.debt.quantity) ||
          this.debt.quantity <= 0)
      ) {
        this.errors.quantity = "Soni (Dona) musbat son bo‘lishi kerak";
      }
      if (
        field === "price" &&
        (!this.debt.price || isNaN(this.debt.price) || this.debt.price <= 0)
      ) {
        this.errors.price = "Soni (Dona) musbat son bo‘lishi kerak";
      }
    },
    submitForm() {
      this.validateField("description");
      this.validateField("quantity");
      this.validateField("omborxonaProId");
      this.validateField("sellerId");

      for (const error in this.errors) {
        if (this.errors[error] !== "") {
          return;
        }
      }
      this.isSubmitting = true;
      if (!this.isUpdate) {
        api
          .post("/api/debt2", this.debt)
          .then(({ status }) => {
            if (status === 201) {
              this.$emit("status", {
                status: "success",
                message: "Rasxod yaratildi",
              });
              this.closeModal();
              this.isSubmitting = false;
            } else {
              this.$emit("error", {
                status: "error",
                message: "Rasxod qo`shishda hatolik",
              });
            }
          })
          .catch((error) => {
            console.error(error);
            this.isSubmitting = false;
            this.$emit("status", {
              status: "error",
              message: error.response.data.message || "Xatolik yuz berdi",
            });
          });
      } else {
        api
          .put("/api/debt2/" + this?.update?.id, this.debt)
          .then(({ status }) => {
            if (status === 200) {
              this.$emit("status", {
                status: "success",
                message: "Rasxod yangilandi",
              });
              this.closeModal();
              this.isSubmitting = false;
            } else {
              this.$emit("status", {
                status: "error",
                message: "Rasxod yangilanishida",
              });
            }
          })
          .catch((error) => {
            this.isSubmitting = false;
            console.error(error);
            this.$emit("status", {
              status: "error",
              message: "Xatolik yuz berdi" || error.message,
            });
          });
      }
    },
  },
  mounted() {
    this.getDebtIds();
    this.getSellerIds();
    if (this?.update?.isUpdate) {
      this.debt = {
        omborxonaProId: this?.update?.omborxonaProId?._id,
        quantity: this?.update?.quantity,
        description: this?.update?.description,
        reason: this?.update?.reason,
        price: this?.update?.omborxonaProId?.price,
        sellerId: this?.update?.sellerId,
      };
      this.isUpdate = true;
    }
  },
};
</script>

<style></style>
