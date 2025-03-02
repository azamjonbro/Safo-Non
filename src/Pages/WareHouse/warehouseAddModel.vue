<template>
  <div class="modal" @click.self="$emit('close')">
    <div class="modal-content relative">
      <Icons name="xIcon" class="xIcon" @click="closeModal" />
      <h3>Omborxona turini yaratish</h3>

      <form>
        <div class="modal-form">
          <div class="form-group">
            <label for="price">Narxi</label>
            <input
              type="number"
              id="price"
              placeholder="Omborxona turini narxini kiriting"
              @blur="validateField('price')"
              v-model="warehouseType.price"
            />
            <p v-if="errors.price" class="error-text">
              {{ errors.price }}
            </p>
          </div>

          <div class="form-group">
            <label for="quantity">Sonni</label>
            <input
              type="number"
              id="quantity"
              placeholder="Omborxona turini sonini kiriting"
              @blur="validateField('quantity')"
              v-model="warehouseType.quantity"
            />
            <p v-if="errors.quantity" class="error-text">
              {{ errors.quantity }}
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
      errors: {},
      warehouseType: {
        price: 0,
        quantity: 0,
        typeId: "",
      },
      isSubmitting: false,
    };
  },
  props: {
    id: String,
  },
  methods: {
    closeModal() {
      this.$emit("close");
    },
    validateField(field) {
      this.errors[field] = "";
      if (
        field === "price" &&
        (!this.warehouseType.price ||
          isNaN(this.warehouseType.price) ||
          this.warehouseType.price <= 0)
      ) {
        this.errors.price = "Omborxona Narxi musbat son bo‘lishi kerak";
      }

      if (
        field === "quantity" &&
        (!this.warehouseType.quantity ||
          isNaN(this.warehouseType.quantity) ||
          this.warehouseType.quantity <= 0)
      ) {
        this.errors.quantity = "Omborxona Narxi musbat son bo‘lishi kerak";
      }
    },
    submitForm() {
      this.isSubmitting = true;
      api
        .post("/api/warehouse", this.warehouseType)
        .then(({ status }) => {
          if (status === 201) {
            this.$emit("status", {
              status: "success",
              message: "Omborxona turi yaratildi",
            });
            this.isSubmitting = false;
            this.closeModal();
          }     
        })
        .catch((error) => {
          console.error(error);
          this.$emit("status", {
            status: "error",
            message: "Omborxona yanglilanishida hatolik yuz berdi",
          });
        });
    },
  },
  mounted() {
    this.warehouseType.typeId = this?.id;
  },
};
</script>

<style>
</style>