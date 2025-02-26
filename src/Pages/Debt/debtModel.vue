<template>
  <transition name="slide-modal">
    <div class="modal" @click.self="$emit('close')">
      <div class="modal-content relative">
        <Icons name="xIcon" class="xIcon" @click="closeModal" />
        <h2>Chiqim yaratish</h2>

        <div class="modal-form">
          <div class="form-group">
            <label for="debtId">Rasxod turi</label>
            <CustomSelectVue
              @click="getDebtIds"
              @blur="validateField('debtId')"
              @input="sellectDebtId($event)"
              :options="debtIds"
              :placeholder="'Rasxod turini  tanlang'"
            />
            <p v-if="errors.debtId" class="error-text">{{ errors.debtId }}</p>
          </div>

          <div class="form-group">
            <label for="quantity">Sonni</label>
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
            <label for="description">Description</label>
            <input
              id="description"
              type="text"
              placeholder="Rasxod descriptionni kiriting"
              v-model="debt.description"
              @blur="validateField('description')"
            />
            <p v-if="errors.description" class="error-text">
              {{ errors.description }}
            </p>
          </div>

          <div class="form-group">
            <label for="reason">Reason</label>
            <input
              id="reason"
              type="text"
              placeholder="Rasxod reasonni kiriting"
              v-model="debt.reason"
              @blur="validateField('reason')"
            />
            <p v-if="errors.reason" class="error-text">
              {{ errors.reason }}
            </p>
          </div>

          <div class="form-group">
            <label for="sellerId">Seller Id</label>
            <CustomSelectVue
              :options="sellerIds"
              @input="sellectSellerId($event)"
              :placeholder="'Rasxod sellerIdni tanlang'"
              @blur="validateField('sellerId')"
              @click="getSellerIds"
            />
            <p v-if="errors.sellerId" class="error-text">
              {{ errors.sellerId }}
            </p>
          </div>
        </div>

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
        debtId: "",
        quantity: 0,
        description: "",
        reason: "",
        sellerId: "",
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
      const token = localStorage.getItem("user")
        ? JSON.parse(localStorage.getItem("user"))?.accessToken
        : "";
      api
        .get("/api/typeOfDebts", {
          headers: {
            authorization: token,
          },
        })
        .then(({ data, status }) => {
          if (status === 200) {
            this.debtIds = data.typeOfDebts.map((item) => {
              return { text: item.title, value: item._id };
            });
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
      this.debt.debtId = id;
    },
    sellectSellerId(id) {
      this.debt.sellerId = id;
    },
    validateField(field) {
      this.errors[field] = "";
      if (field === "debtId" && !this.debt.debtId.trim()) {
        this.errors.debtId = "Rasxodni rasxod turi  bo'sh bo'lmasligi kerak";
      }
      if (field === "sellerId" && !this.debt.sellerId.trim()) {
        this.errors.sellerId = "Rasxodni rasxod turi  bo'sh bo'lmasligi kerak";
      }
      if (field === "reason" && !this.debt.reason.trim()) {
        this.errors.reason = "Rasxod sababi bo'sh bo'lmasligi kerak";
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
        this.errors.quantity = "Sonni musbat son bo‘lishi kerak";
      }
    },
    submitForm() {
      this.validateField("username");
      this.validateField("description");
      this.validateField("reason");
      this.validateField("quantity");
      this.validateField("debtId");
      this.validateField("sellerId");

      for (const error in this.errors) {
        if (this.errors[error] !== "") {
          return;
        }
      }
      this.isSubmitting = true;
      const token = localStorage.getItem("user")
        ? JSON.parse(localStorage.getItem("user"))?.accessToken
        : "";
      if (!this.isUpdate) {
        api
          .post("/api/debt2", this.debt, {
            headers: {
              authorization: token,
            },
          })
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
            this.$emit("status", {
              status: "error",
              message: "Xatolik yuz berdi" || error.message,
            });
          });
      } else {
        api
          .put(
            "/api/debt2/" + this?.update?.id,
            {
              debtId: this.debt?.debtId,
              quantity: this.debt?.quantity,
              description: this.debt?.description,
              reason: this.debt?.reason,
              sellerId: this.debt?.sellerId,
            },
            {
              headers: {
                authorization: token,
              },
            }
          )
          .then(({ status }) => {
            if (status === 200) {
               this.$emit("status", {
                status: "success",
                message: "Rasxod yangilandi",
              });
              this.closeModal();  
              this.isSubmitting = false;
            }else{
               this.$emit("status", {
                status: "error",
                message: "Rasxod yangilanishida",
              });
            }
          })
          .catch((error) => {
            console.error(error);
          });
      }
    },
  },
  mounted() {
    if (this?.update?.isUpdate) {
      this.debt = {
        debtId: this?.update?.debtId?._id,
        quantity: this?.update?.quantity,
        description: this?.update?.description,
        reason: this?.update?.reason,
        sellerId: this?.update?.sellerId?._id,
      };
      this.isUpdate = true;
    }
  },
};
</script>

<style>
</style>