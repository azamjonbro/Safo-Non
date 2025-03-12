<template>
  <transition name="slide-modal">
    <div class="modal" @click.self="$emit('close')">
      <div class="modal-content relative">
        <Icons name="xIcon" class="xIcon" @click="closeModal" />
        <h2>Chiqim yaratish</h2>

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
              :placeholder="'Rasxod turini tanlang'"
            />
            <p v-if="errors.omborxonaProId" class="error-text">
              {{ errors.omborxonaProId }}
            </p>
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
                ? "Yangilanyapti..."
                : "Yangilash"
            }}
          </button>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
import api from "@/Utils/axios";
import CustomSelectVue from "@/components/Template/customSelect.vue";
import Icons from "@/components/Template/Icons.vue";

export default {
  components: {
    CustomSelectVue,
    Icons,
  },
  data() {
    return {
      debtIds: [],
      debt: {
        omborxonaProId: "",
        quantity: 0,
        description: "",
        price: 0,
      },
      errors: {},
      isSubmitting: false,
      isUpdate: false,
    };
  },
  props: {
    update: {
      type: Object,
    },
  },
  methods: {
    closeModal() {
      this.$emit("close");
      this.isUpdate = false;
    },
    validateField(field) {
      this.errors[field] = "";
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
    sellectDebtId(id) {
      this.debt.omborxonaProId = id._id;
      this.debt.price = id.price;
    },
    submitForm() {
      this.errors = {};
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
                message: "Chiqim yaratildi",
              });
              this.closeModal();
            } else {
              this.$emit("status", {
                status: "error",
                message: "Xatolik yuz berdi",
              });
            }
          })
          .catch((error) => {
            console.error(error);
            this.$emit("status", {
              status: "error",
              message:
                error.message || error.data.message || "Xatolik yuz berdi",
            });
          })
          .finally(() => {
            this.isSubmitting = false;
          });
      } else {
        api
          .put("/api/debt2/" + this.update.id, this.debt)
          .then(({ status }) => {
            if (status === 200) {
              this.$emit("status", {
                status: "success",
                message: "Chiqim yangilandi",
              });
              this.closeModal();
            } else {
              this.$emit("status", {
                status: "error",
                message: "Xatolik yuz berdi",
              });
            }
          })
          .catch((error) => {
            console.error(error);
            this.$emit("status", {
              status: "error",
              message:
                error.message || error.data.message || "Xatolik yuz berdi",
            });
          })
          .finally(() => {
            this.isSubmitting = false;
          });
      }
    },
  },
  mounted() {
    this.getDebtIds();
    if (this?.update?.isUpdate) {
      this.debt = {
        omborxonaProId: this?.update?.omborxonaProId._id,
        quantity: this?.update?.quantity,
        description: this?.update?.description,
        price: this?.update?.price,
      };
      console.log(this.debt)
      this.isUpdate = true;
    }
  },
};
</script>

<style>
</style>