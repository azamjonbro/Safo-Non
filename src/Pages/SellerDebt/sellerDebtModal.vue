<template>
  <transition name="slide-modal">
    <div class="modal" @click.self="$emit('close')">
      <div class="modal-content relative">
        <Icons name="xIcon" class="xIcon" @click="closeModal" />
        <h2>Chiqim yaratish</h2>
        <form>
          <div class="modal-form">
            <div class="form-group">
              <label for="title">Nomi</label>
              <input
                id="title"
                type="text"
                v-model="debt.title"
                placeholder="Do`kon nomini kiriting"
                maxlength="50"
                @input="sanitizeInput('title')"
                @blur="validateField('title')"
              />
              <p v-if="errors.title" class="error-text">
                {{ errors.title }}
              </p>
            </div>
            <div class="form-group">
              <label for="reason">reason</label>
              <input
                id="reason"
                type="text"
                v-model="debt.reason"
                placeholder="Do`kon addressini kiriting"
                maxlength="100"
                @blur="validateField('reason')"
              />
              <p v-if="errors.reason" class="error-text">
                {{ errors.reason }}
              </p>
            </div>
            <div class="form-group">
              <label for="quantity">Sonni</label>
              <input
                id="quantity"
                type="number"
                v-model="debt.quantity"
                placeholder="Sonni"
                maxlength="13"
                @blur="validateField('quantity')"
              />
              <p v-if="errors.quantity" class="error-text">
                {{ errors.quantity }}
              </p>
            </div>
            <div class="form-group">
              <label for="price">Narxi</label>
              <input
                id="price"
                type="number"
                v-model="debt.price"
                placeholder="Sonni"
                maxlength="13"
                @blur="validateField('price')"
              />
              <p v-if="errors.price" class="error-text">
                {{ errors.price }}
              </p>
            </div>
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
      isSubmitting: false,
      debt: {
        title: "",
        quantity: 0,
        price: 0,
        reason: "",
      },
      errors: {},
      isUpdate: false,
    };
  },
  props: {
    update: {
      type: Object,
    },
  },
  methods: {
    // getDebtIds() {
    //   api
    //     .get("/api/typeOfWareHouses")
    //     .then(({ data, status }) => {
    //       if (status === 200) {
    //         this.debtIds = data.typeOfWareHouses;
    //       }
    //     })
    //     .catch((error) => {
    //       console.error(error);
    //     });
    // },
    closeModal() {
      this.$emit("close");
    },
    sanitizeInput(field) {
      this.debt[field] = this.debt[field].replace(/[^a-zA-Z0-9'`\s]/g, "");
    },
    validateField(field) {
      this.errors[field] = "";
      if (field === "title" && !this.debt.title.trim()) {
        this.errors.title = "Magazin nomi bo'sh bo'lmasligi kerak";
      }
      if (field === "reason" && !this.debt.reason.trim()) {
        this.errors.reason = "Magazin addressi bo'sh bo'lmasligi kerak";
      }

      if (
        field === "price" &&
        (!this.debt.price || isNaN(this.debt.price) || this.debt.price < 0)
      ) {
        this.errors.price = "Narx musbat son bo‘lishi kerak";
      }
      if (
        field === "quantity" &&
        (!this.debt.quantity ||
          isNaN(this.debt.quantity) ||
          this.debt.quantity < 0)
      ) {
        this.errors.quantity = "Sonni musbat son bo‘lishi kerak";
      }
    },
    submitForm() {
      this.errors = {};
      this.validateField("title");
      this.validateField("quantity");
      this.validateField("reason");
      this.validateField("price");
      for (const error in this.errors) {
        if (this.errors[error]) {
          return;
        }
      }
      this.isSubmitting = true;

      if (!this.isUpdate) {
        api
          .post("/api/debt1", this.debt)
          .then(({ status }) => {
            if (status === 201) {
              this.$emit("status", {
                status: "success",
                message: "Chiqim yaratildi",
              });
              this.closeModal();
              this.isSubmitting = false;
            } else {
              this.$emit("status", {
                status: "error",
                message: "Yetkazuvchi yaratilishida hatolik yuz berdi",
              });
            }
          })
          .catch((error) => {
            console.error(error);
          })
          .finally(() => {
            this.isSubmitting = false;
          });
      } else {
        api
          .put("/api/debt1/" + this.update.id, this.debt)
          .then(({ status }) => {
            if (status === 200) {
              this.$emit("status", {
                status: "success",
                message: "yetkazuvchi yangilandi",
              });
              this.closeModal();
              this.isSubmitting = false;
              this.isUpdate = false;
            } else {
              this.$emit("status", {
                status: "error",
                message: "yetkazuvchi yangilanishida hatolik yuz berdi",
              });
            }
          })
          .catch((error) => {
            this.isSubmitting = false;
            console.error(error);
          })
          .finally(() => {
            this.isSubmitting = false;
          });
      }
    },
  },
  mounted() {
    if (this?.update?.isUpdate) {
      this.debt = {
        title: this.update.title,
        quantity: this.update.quantity,
        price: this.update.price,
        reason: this.update.reason,
      };
      this.isUpdate = true;
    }
  },
};
</script>

<style>
.error-text {
  color: red;
  font-size: 14px;
}
</style>

