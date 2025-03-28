<template>
  <div class="modal" @click.self="closeModal()">
    <div class="modal-content relative">
      <Icons name="xIcon" class="xIcon" @click="closeModal()" />
      <h2>To'lov qilish</h2>
      <form>
        <div class="modal-form">
          <div class="form-group">
            <label for="price">To'lov</label>
            <input
              type="text"
              id="price"
              v-model="delivery.price"
              placeholder="To'lov miqdorini kiriting"
              @input="formatPrice"
              @blur="validateField('price')"
              maxlength="10"
              v-if="delivery.type !== 'Oylik'"
            />
            <input
              type="text"
              id="price"
              v-model="delivery.price"
              placeholder="To'lov miqdorini kiriting"
              maxlength="10"
              readonly
              v-else
            />
            <p v-if="errors.price" class="error-text">{{ errors.price }}</p>
          </div>

          <div class="form-group">
            <label for="statusId">To'lov holati</label>
            <CustomSelectVue
              placeholder="To'lov holatini tanlang"
              id="statusId"
              @input="selectPayedState($event)"
              :options="payedStatus"
              @blur="validateField('status')"
              :search="true"
            />
            <p v-if="errors.status" class="error-text">{{ errors.status }}</p>
          </div>

          <div class="form-group">
            <label for="typeId">To'lov turi</label>
            <CustomSelectVue
              placeholder="To'lov turini tanlang"
              id="typeId"
              @input="selectPayedType($event)"
              :options="payedType"
              @blur="validateField('type')"
              :search="true"
            />
            <p v-if="errors.type" class="error-text">{{ errors.type }}</p>
          </div>

          <div class="form-group">
            <label for="comment">Tavsifini kiriting</label>
            <input
              type="text"
              id="comment"
              v-model="delivery.comment"
              placeholder="Tasnifni kiriting"
              maxlength="10"
              @blur="validateField('comment')"
            />
            <p v-if="errors.comment" class="error-text">{{ errors.comment }}</p>
          </div>
        </div>
      </form>
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
  props: {
    id: Object,
  },
  data() {
    return {
      isSubmitting: false,
      delivery: {
        type: "",
        price: "",
        status: "",
        deliveryId: "",
        comment: "",
      },
      errors: {},
      payedStatus: [
        { text: "To'landi", value: "To'landi" },
        { text: "To'lanmadi", value: "To'lanmadi" },
      ],
      payedType: [
        { text: "Bonus", value: "Bonus" },
        { text: "Shtraf", value: "Shtraf" },
        { text: "Kunlik", value: "Kunlik" },
        { text: "Avans", value: "Avans" },
        { text: "Oylik", value: "Oylik" },
      ],
    };
  },
  methods: {
    closeModal() {
      this.$emit("close");
    },
    formatPrice() {
      this.delivery.price = this.delivery.price
        .replace(/[^0-9]/g, "")
        .slice(0, 10);
    },
    validateField(field) {
      this.errors[field] = "";
      if (field === "price") {
        if (isNaN(this.delivery.price) || this.delivery.price <= 0) {
          this.errors.price = "To'lov miqdori musbat son bo'lishi kerak";
        }
      }
      if (field === "type" && !this.delivery.type) {
        this.errors.type = "To'lov turi tanlanishi kerak";
      }
      if (field === "status" && !this.delivery.status) {
        this.errors.status = "To'lov holati tanlanishi kerak";
      }
      if (field === "comment" && !this.delivery.comment) {
        this.errors.comment = "Tasnif  bo'sh bo'lmasligi kerak";
      }
    },
    selectPayedState(value) {
      this.delivery.status = value;
    },
    selectPayedType(value) {
      this.delivery.type = value;
      if (this.delivery.type === "Oylik") {
        this.delivery.price = Math.abs(this.id.price)
      }
    },
    submitForm() {
      this.errors = {};
      this.validateField("price");
      this.validateField("type");
      this.validateField("status");

      if (Object.keys(!this.errors).length) {
        return;
      }

      this.isSubmitting = true;
      api
        .post("/api/deliveryPayed", this.delivery)
        .then(({ status }) => {
          if (status === 201) {
            this.$emit("status", {
              status: "success",
              message: "To'lov muvaffaqiyatli bajarildi",
            });
            this.isSubmitting = false;
            this.closeModal();
          } else {
            this.$emit("status", {
              status: "error",
              message: "To'lov amalga oshirishda xatolik yuz berdi",
            });
          }
        })
        .catch((error) => {
          this.isSubmitting = false;
          console.error(error);
          this.$emit("status", {
            status: "error",
            message: "To'lov amalga oshirishda xatolik yuz berdi",
          });
        });
    },
  },
  mounted() {
    this.delivery.deliveryId = this.id.id || "";
  },
};
</script>

<style>
.error-text {
  color: red;
  font-size: 12px;
  margin-top: 5px;
}
</style>
