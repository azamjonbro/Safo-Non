<template>
  <div class="modal" @click.self="closeModal()">
    <div class="modal-content relative">
      <Icons name="xIcon" class="xIcon" @click="closeModal()" />
      <h2>Tolov qilish</h2>
      <form>
        <div class="modal-form">
          <div class="form-group">
            <label for="price">To`lov</label>
            <input
              type="number"
              id="price"
              v-model="delivery.price"
              placeholder="To`lov priceni tanlang"
              @blur="validateField('price')"
            />
            <p v-if="errors.price" class="error-text">{{ errors.price }}</p>
          </div>

          <div class="form-group">
            <label for="statusId">To`lov holati</label>
            <CustomSelectVue
              :placeholder="'To`lov holatini kiriting'"
              id="statusId"
              @input="sellectPayedState($event)"
              :options="payedStatus"
              @blur="validateField('statusId')"
            />
            <p v-if="errors.statusId" class="error-text">
              {{ errors.statusId }}
            </p>
          </div>

          <div class="form-group">
            <label for="typeId">To`lov turi</label>
            <CustomSelectVue
              :placeholder="'To`lov turini tanlang'"
              id="typeId"
              @input="sellectPayedType($event)"
              :options="payedType"
              @blur="validateField('typeId')"
            />
            <p v-if="errors.typeId" class="error-text">{{ errors.typeId }}</p>
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
    id: String,
  },
  data() {
    return {
      isSubmitting: false,
      delivery: {
        type: "",
        price: 0,
        status: "",
        deliveryId: "",
      },
      errors: {},
      payedStatus: [{ text: "Bonus", value: "Bonus" }],
      payedType: [
        { text: "To`landi", value: "To`landi" },
        { text: "To`lanmoqda", value: "To`lanmoqda" },
      ],
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
        (!this.delivery.price || isNaN(this.delivery.price))
      ) {
        this.errors.price = "Tandir raqami raqam bo‘lishi kerak";
      }
      if (field === "type" && !this.delivery.type.trim()) {
        this.errors.type = "To`lov turi bo'sh bo'lmasligi kerak";
      }
      if (field === "status" && !this.delivery.status.trim()) {
        this.errors.status = "To`lov holati turi bo'sh bo'lmasligi kerak";
      }
    },
    sellectPayedState(id) {
      this.delivery.status = id;
    },
    sellectPayedType(id) {
      this.delivery.type = id;
    },
    submitForm() {
      this.errors = {};
      this.validateField("price");
      this.validateField("typeId");
      this.validateField("statusId");

      for (const error in this.errors) {
        if (this.errors[error] !== "") {
          return;
        }
      }

      this.isSubmitting = true;

      api
        .post("/api/deliveryPayed", this.delivery)
        .then(({ status }) => {
          if (status === 201) {
            this.$emit("status", {
              status: "success",
              message: "seller payed qilindi",
            });
            this.isSubmitting = false
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
    this.delivery.deliveryId = this?.id;
  },
};
</script>

<style>
</style>