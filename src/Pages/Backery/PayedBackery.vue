<template>
  <transition name="slide-modal">
    <div class="modal" @click.self="closeModal()">
      <div class="modal-content relative">
        <Icons name="xIcon" class="xIcon" @click="closeModal()" />
        <h2>Tolov qilish</h2>
        <div class="modal-form">
          <div class="form-group">
            <label for="price">To`lov</label>
            <input
              type="number"
              id="price"
              v-model="bakcery.price"
              placeholder="Fordalanuvchi priceni kiriting"
              @blur="validateField('price')"
            />
            <input
              type="number"
              id="price"
              v-model="bakcery.type"
              placeholder="Fordalanuvchi priceni kiriting"
              @blur="validateField('price')"
            />
            <p v-if="errors.type" class="error-text">{{ errors.type }}</p>
          </div>
        </div>
        <div class="modal-buttons d-flex j-end a-center gap24">
          <button type="button" class="action-button" @click="closeModal">
            Chiqish
          </button>
          <button
            type="button"
            @click="submitForm()"
            class="action-button"
            :disabled="isSubmitting"
          >
            {{ isSubmitting ? "Yaratilmoqda..." : "Yaratish" }}
          </button>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
import Icons from "@/components/Template/Icons.vue";
import api from "@/Utils/axios";
export default {
  components: {
    Icons,
  },
  props: {
    selectedItemPayed: String,
  },
  data() {
    return {
      bakcery: {
        sellerId: "",
        price: "",
      },
      errors: {},
      isSubmitting: false,
    };
  },
  methods: {
    closeModal() {
      this.$emit("close");
    },
    validateField(field) {
      this.errors[field] = "";
      if (
        field === "price" &&
        (!this.bakcery.price || isNaN(this.bakcery.price))
      ) {
        this.errors.price = "Tandir raqami raqam bo‘lishi kerak";
      }
    },
    submitForm() {
      this.isSubmitting = true;
      api
        .post("/api/sellerPayed", this.bakcery)
        .then(({ status }) => {
          if (status === 201) {
            this.$emit("status", {
              status: "success",
              message: "seller payed qilindi",
            });
            this.closeModal();
          } else {
            this.$emit("status", {
              status: "error",
              message: "seller payed qilinayotganida hatolik yuz berdi",
            });
          }
        })
        .catch((error) => {
          console.error(error);
          this.$emit("status", {
            status: "error",
            message: "seller payed qilinayotganida hatolik yuz berdi",
          });
        });
    },
  },
  mounted() {
    this.bakcery.sellerId = this?.selectedItemPayed;
  },
};
</script>

<style>
</style>