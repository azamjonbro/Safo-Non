<template>
  <div class="modal" @click.self="closeModal">
    <div class="modal-content relative">
      <Icons name="xIcon" class="xIcon" @click="closeModal" />
      <h2>Rasxod yaratish</h2>
      <form>
        <div class="modal-form">
          <div class="form-group">
            <label for="title">Nomi</label>
            <input
              type="text"
              placeholder="Nomi"
              id="title"
              v-model="debt.title"
              @blur="validateField('title')"
            />
            <p v-if="errors.title">{{ errors.title }}</p>
          </div>
          <div class="form-group">
            <label for="quantity">Sonni</label>
            <input
              type="number"
              placeholder="Sonni"
              id="quantity"
              v-model="debt.quantity"
              @blur="validateField('quantity')"
            />
            <p v-if="errors.quantity">{{ errors.quantity }}</p>
          </div>

          <div class="form-group">
            <label for="price">Narxi</label>
            <input
              type="number"
              placeholder="Narxi"
              id="price"
              v-model="debt.price"
              @blur="validateField('price')"
            />
            <p v-if="errors.price">{{ errors.price }}</p>
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
          {{ isSubmitting ? "Yaratilmoqda..." : "Yaratish" }}
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import Icons from "@/components/Template/Icons.vue";
import api from "@/Utils/axios";
export default {
  components: {
    Icons,
  },
  data() {
    return {
      isSubmitting: false,
      debt: {
        title: "",
        price: 0,
        quantity: 0,
      },
      errors: {},
    };
  },
  methods: {
    closeModal() {
      this.$emit("close");
      this.isUpdate = false;
    },
    validateField(field) {
      this.errors[field] = "";
      if (field === "title" && !this.debt.title.trim()) {
        this.errors.title = "Rasxodni turi bo'sh bo'lmasligi kerak";
      }
      if (
        field === "price" &&
        (!this.debt.price || isNaN(this.debt.price) || this.debt.price <= 0)
      ) {
        this.errors.price = "Sonni musbat son bo‘lishi kerak";
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
      this.errors = {};

      this.validateField("title");
      this.validateField("price");
      this.validateField("quantity");
      for (const error in this.errors) {
        if (this.errors[error] !== "") {
          return;
        }
      }
      this.isSubmitting = true;
      api
        .post("/api/typeOfDebt", this.debt)
        .then(({ status }) => {
          if (status === 201) {
            this.$emit("status", {
              status: "success",
              message: "Rasxod  yaratildi",
            });
            this.closeModal();
            this.debt = {
              title: "",
              price: 0,
              quantity: 0,
            };
          } else {
            this.$emit("status", {
              status: "error",
              message: "Rasxod yaratish vaqtida xatolik yuz berdi",
            });
          }
        })
        .catch((error) => {
          console.error(error);
          this.$emit("status", {
            status: "error",
            message: error.message || "Xatolik yuz berdi",
          });
          F;
        });
    },
  },
};
</script>

<style>
</style>