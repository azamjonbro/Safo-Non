<template>
  <transition name="slide-modal">
    <div class="modal" @click.self="$emit('close')">
      <div class="modal-content relative">
        <Icons name="xIcon" class="xIcon" @click="closeModal" />
        <h2>Yetkazuvchi yaratish</h2>

        <form>
          <div class="modal-form">
            <div class="form-group">
              <label for="quantity">Sonni</label>
              <input
                id="quantity"
                type="number"
                placeholder="Yetkazuvchini ismini kiriting"
                v-model="delivery.quantity"
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
                placeholder="Yetkazuvchini telefon raqamini kiriting"
                v-model="delivery.description"
                @blur="validateField('description')"
              />
              <p v-if="errors.description" class="error-text">
                {{ errors.description }}
              </p>
            </div>
            <div class="form-group">
              <label for="delivery">Yetkazuvchi</label>
              <CustomSelect
                :options="deliveries"
                id="delivery"
                @input="selectDelivery($event)"
                :selected="delivery.deliveryId"
                @blur="validateField('deliveryId')"
              />
              <p v-if="errors.deliveryId" class="error-text">
                {{ errors.deliveryId }}
              </p>
            </div>
            <div class="form-group">
              <label for="delivery">Non turlari</label>
              <MultiSelectVue
                :options="deliveries"
                id="delivery"
                @input="selectArray($event)"
                :activeWorker="delivery.typeOfBreadIds"
              />
              <p v-if="errors.typeOfBreadIds" class="error-text">
                {{ errors.typeOfBreadIds }}
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
import CustomSelect from "@/components/Template/customSelect.vue";
import MultiSelectVue from "@/components/Template/MultiSelect.vue";
export default {
  components: {
    Icons,
    CustomSelect,
    MultiSelectVue,
  },
  data() {
    return {
      isSubmitting: false,
      delivery: {
        description: "",
        quantity: 0,
        deliveryId: "",
        typeOfBreadIds: [],
      },
      deliveries: [],
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
    selectDelivery(id) {
      this.delivery.deliveryId = id;
    },
    selectArray(arr) {
      this.delivery.typeOfBreadIds = arr;
    },
    closeModal() {
      this.$emit("close");
      this.isUpdate = false;
    },
    validateField(field) {
      this.errors[field] = "";
      if (field === "description" && !this.delivery.description.trim()) {
        this.errors.description =
          "Foydalanuvchi descripyion bo'sh bo'lmasligi kerak";
      }
      if (field === "deliveryId" && !this.delivery.deliveryId.trim()) {
        this.errors.deliveryId =
          "Foydalanuvchi descripyion bo'sh bo'lmasligi kerak";
      }
      if (
        field === "quantity" &&
        (!this.delivery.quantity ||
          isNaN(this.delivery.quantity) ||
          this.delivery.quantity <= 0)
      ) {
        this.errors.quantity = "Sonni musbat son bo‘lishi kerak";
      }
      if (field === "typeOfBreadIds" && this.delivery.typeOfBreadIds.length === 0) {
        this.errors.typeOfBreadIds = "Non turini tanlang";
      }
      
    },
    submitForm() {
      this.errors = {};
      this.validateField("quantity");
      this.validateField("description");
      this.validateField("deliveryId");
      this.validateField("typeOfBreadIds");
      for (const error in this.errors) {
        if (this.errors[error] !== "") {
          return;
        }
      }
      this.isSubmitting = true;

      if (!this.isUpdate) {
        api
          .post("/api/orderWithDelivery", this.delivery)
          .then(({ status }) => {
            if (status === 201) {
              this.$emit("status", {
                status: "success",
                message: "Yetkazuvchi yaratildi",
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
          });
      } else {
        api
          .put("/api/orderWithDelivery/" + this.update.id, this.delivery)
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
          });
      }
    },
    getDeliveries() {
      api
        .get("/api/deliveries")
        .then(({ status, data }) => {
          if (status === 200) {
            this.deliveries = data.deliveries.map((item) => {
              return { text: item.username, value: item._id };
            });
          }
        })
        .catch((error) => {
          console.error(error);
        });
    },
  },
  mounted() {
    this.getDeliveries();
    if (this?.update?.isUpdate) {
      this.delivery = {
        typeOfBreadIds: this.update?.typeOfBreadIds,
        quantity: this.update?.quantity,
        description: this.update?.description,
        delivery: this.update?.delivery,
      };
      this.isUpdate = true;
    }
  },
};
</script>

<style>
</style>