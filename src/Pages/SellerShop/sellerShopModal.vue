<template>
  <transition name="slide-modal">
    <div class="modal" @click.self="$emit('close')">
      <div class="modal-content relative">
        <Icons name="xIcon" class="xIcon" @click="closeModal" />
        <h2>Do`kon yaratish</h2>

        <form>
          <div class="modal-form">
            <div class="form-group">
              <label for="title">Nomi</label>
              <input
                id="title"
                type="text"
                placeholder="Do`kon nomi narxini raqamini kiriting"
                @blur="validateField('title')"
                v-model="shop.title"
              />
              <p v-if="errors.title" class="error-text">{{ errors.title }}</p>
            </div>

            <div class="form-group">
              <label for="description">Description</label>
              <input
                id="description"
                type="text"
                placeholder="Do`kon nonni description raqamini kiriting"
                @blur="validateField('description')"
                v-model="shop.description"
              />
              <p v-if="errors.description" class="error-text">
                {{ errors.description }}
              </p>
            </div>

            <div class="form-group">
              <label for="sellerBreadId">Non turi</label>
              <CustomSelect
                :search="true"
                :options="breads"
                @blur="validateField('sellerBreadId')"
                @input="selectBreadId($event)"
                :placeholder="'Non turini kiriting'"
                :selected="shop.sellerBreadId"
              />
              <p v-if="errors.sellerBreadId" class="error-text">
                {{ errors.sellerBreadId }}
              </p>
            </div>
            <div class="form-group">
              <label for="price">Narxi</label>
              <input
                id="price"
                type="number"
                placeholder="Do`kon nonni narxini raqamini kiriting"
                @blur="validateField('price')"
                v-model="shop.price"
              />
              <p v-if="errors.price" class="error-text">{{ errors.price }}</p>
            </div>
            <div class="form-group">
              <label for="quantity">Sonni</label>
              <input
                id="quantity"
                type="number"
                placeholder="Do`kon nonni sonni kiriting"
                @blur="validateField('quantity')"
                v-model="shop.quantity"
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

export default {
  components: {
    Icons,
    CustomSelect,
  },
  data() {
    return {
      isSubmitting: false,
      shop: {
        price: 0,
        quantity: 0,
        sellerBreadId: "",
        title: "",
        description: "",
      },
      breads: [],
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
    selectBreadId(id) {
      this.shop.sellerBreadId = id;
    },
    closeModal() {
      this.$emit("close");
      this.isUpdate = false;
    },
    validateField(field) {
      this.errors[field] = "";
      if (field === "title" && !this.shop.title.trim()) {
        this.errors.title = "Magazin nopmi bo'sh bo'lmasligi kerak";
      }
      if (field === "description" && !this.shop.description.trim()) {
        this.errors.description = "Magazin description bo'sh bo'lmasligi kerak";
      }
      if (field === "sellerBreadId" && !this.shop.sellerBreadId.trim()) {
        this.errors.sellerBreadId = "Magazin noni bo'sh bo'lmasligi kerak";
      }
      if (
        field === "price" &&
        (!this.shop.price || isNaN(this.shop.price) || this.shop.price <= 0)
      ) {
        this.errors.price = "Narx musbat son bo‘lishi kerak";
      }

      if (
        field === "quantity" &&
        (!this.shop.quantity ||
          isNaN(this.shop.quantity) ||
          this.shop.quantity <= 0)
      ) {
        this.errors.quantity = "Sonni musbat son bo‘lishi kerak";
      }
    },
    submitForm() {
      this.errors = {};
      this.validateField("sellerBreadId");
      this.validateField("quantity");
      this.validateField("price");
      for (const error in this.errors) {
        if (this.errors[error] !== "") {
          return;
        }
      }
      this.isSubmitting = true;
 
      if (!this.isUpdate) {
        api
          .post("/api/sellerMagazine", this.shop)
          .then(({ status }) => {
            if (status === 201) {
              this.$emit("status", {
                status: "success",
                message: "Do`kon yaratildi",
              });
              this.closeModal();
              this.isSubmitting = false;
            } else {
              this.$emit("status", {
                status: "error",
                message: "Do`kon yaratilishida hatolik yuz berdi",
              });
            }
          })
          .catch((error) => {
            console.error(error);
          });
      } else {
        api
          .put("/api/sellerMagazine/" + this.update.id, this.shop)
          .then(({ status }) => {
            if (status === 200) {
              this.$emit("status", {
                status: "success",
                message: "Do`kon yangilandi",
              });
              this.closeModal();
              this.isSubmitting = false;
              this.isUpdate = false;
            } else {
              this.$emit("status", {
                status: "error",
                message: "Do`kon yangilanishida hatolik yuz berdi",
              });
            }
          })
          .catch((error) => {
            this.isSubmitting = false;
            console.error(error);
          });
      }
    },
    getBreads() {
      api
        .get("/api/sellerBreads")
        .then(({ status, data }) => {
          if (status === 200) {
            this.breads = data?.sellerBreads.map((item) => {
              return { text: item.name, value: item._id };
            });
          }
        })
        .catch((error) => {
          console.error(error);
        });
    },
  },
  mounted() {
    this.getBreads();
    if (this?.update?.isUpdate) {
      this.shop = {
        sellerBreadId: this.update?.sellerBreadId,
        quantity: this.update?.quantity,
        price: this.update?.price,
      };
      this.isUpdate = true;
    }
  },
};
</script>

<style>
</style>