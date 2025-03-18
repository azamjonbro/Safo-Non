<template>
  <transition name="slide-modal">
    <div class="modal" @click.self="$emit('close')">
      <div class="modal-content relative">
        <Icons name="xIcon" class="xIcon" @click="closeModal" />
        <h2>Pending</h2>

        <form></form>
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
  </transition>
</template>

<script>
import Icons from "@/components/Template/Icons.vue";
import api from "@/Utils/axios";
import CustomSelect from "@/components/Template/customSelect.vue";
export default {
  components: {
    Icons,
    CustomSelect,
  },
  data() {
    return {
      isSubmitting: false,
      errors: {},
    };
  },
  props: {
    update: {
      type: Object,
    },
    Delivery: {
      type: Object,
    },
  },
  methods: {
    closeModal() {
      this.$emit("close");
    },
    validateField(field) {
      this.errors[field] = "";
      if (field === "paymentMethod" && !this.magazine.paymentMethod.trim()) {
        this.errors.paymentMethod = "To`lov turini tanlang";
      }
      if (field === "description" && !this.magazine.description.trim()) {
        this.errors.description =
          "Foydalanuvchi descripyion bo'sh bo'lmasligi kerak";
      }
      if (field === "deliveryId" && !this.magazine.deliveryId.trim()) {
        this.errors.deliveryId =
          "Foydalanuvchi descripyion bo'sh bo'lmasligi kerak";
      }
      if (field === "magazineId" && !this.magazine.magazineId.trim()) {
        this.errors.magazineId = "Foydalanuvchi do`kon bo'sh bo'lmasligi kerak";
      }
      if (
        field === "quantity" &&
        (!this.magazine.quantity ||
          isNaN(this.magazine.quantity) ||
          this.magazine.quantity <= 0)
      ) {
        this.errors.quantity = "Soni (Dona) musbat son bo‘lishi kerak";
      }
      if (
        field === "money" &&
        (!this.magazine.money ||
          isNaN(this.magazine.money) ||
          this.magazine.money <= 0)
      ) {
        this.errors.money = "Olingan pul son bo‘lishi kerak";
      }
    },
    submitForm() {},
  },
  mounted() {},
};
</script>

<style scoped>
.contentbox {
  display: flex;
  gap: 10px;
}
.contentbox > .form-group {
  width: 33%;
}
.scroll {
  max-height: 400px;
}
form {
  display: flex;
  flex-direction: column;
  gap: 24px;
}
.yemagan {
  display: flex;
  flex-direction: column;
  gap: 24px;
}
.modal-form-2 {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  margin-bottom: 10px;
}
</style>
