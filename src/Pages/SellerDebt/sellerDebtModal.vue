<template>
  <div class="modal" @click.self="$emit('close')">
    <div class="modal-content relative">
      <Icons name="xIcon" class="xIcon" @click="$emit('close')" />
      <h3>Chiqimlar yaratish</h3>

      <form>
        <div class="modal-form">
          <div class="form-group">
            <label for="omborxonaProId">Omborxona produkti</label>
            <CustomSelectVue
              :options="
                products.map((item) => {
                  return { text: item.name, value: item };
                })
              "
                :search="true"
              :selected="debt.omborxonaProId"
              :placeholder="'Omborxona produktini tanlang'"
              @blur="validateField('omborxonaProId')"
              @input="sellectDebtId($event)"
            />
            <p v-if="errors.omborxonaProId" class="error-text">
              {{ errors.omborxonaProId }}
            </p>
          </div>
          <div class="form-group">
            <label for="quantity">Sonni</label>
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

          <!-- <div class="form-group">
            <label for="reason">Reason</label>
            <input
              id="reason"
              type="text"
              placeholder="Rasxod reasonni kiriting"
              v-model="debt.reason"
              @blur="validateField('reason')"
            />
            <p v-if="errors.reason" class="error-text">
              {{ errors.reason }}
            </p>
          </div> -->

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
        </div>
      </form>

      <div class="modal-buttons d-flex j-end a-center gap24">
        <button type="button" class="action-button" @click="$emit('close')">
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
</template>

<script>
import Icons from "@/components/Template/Icons.vue";
import CustomSelectVue from "@/components/Template/customSelect.vue";
import api from "@/Utils/axios";
export default {
  components: {
    Icons,
    CustomSelectVue,
  },
  data() {
    return {
      isSubmitting: false,
      isUpdate: false,
      products: [],
      debt: {
        omborxonaProId: "",
        quantity: 0,
        description: "",
        // reason: "",
        price: 0,
      },
      errors: {},
    };
  },
  props: {
    update: {
      type: Object,
    },
  },
  methods: {
    sellectDebtId(id) {
      console.log(id);
      
      this.debt.omborxonaProId = id._id;
      this.debt.price = id.price
      
    },
    validateField(field) {
      this.errors[field] = "";
      if (field === "omborxonaProId" && !this.debt.omborxonaProId.trim()) {
        this.errors.omborxonaProId =
          "Rasxodni rasxod turi  bo'sh bo'lmasligi kerak";
      }
      // if (field === "reason" && !this.debt.reason.trim()) {
      //   this.errors.reason = "Rasxod sababi bo'sh bo'lmasligi kerak";
      // }
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
        this.errors.quantity = "Sonni musbat son bo‘lishi kerak";
      }
      if (
        field === "price" &&
        (!this.debt.price || isNaN(this.debt.price) || this.debt.price <= 0)
      ) {
        this.errors.price = "Sonni musbat son bo‘lishi kerak";
      }
    },
    getWarehouseProducts() {
      api
        .get("/api/typeOfWareHouses")
        .then(({ status, data }) => {
          if (status === 200) {
            this.products = data?.typeOfWareHouses;
          }
        })
        .catch((error) => {
          console.error(error);
        });
    },
    submitForm() {
      this.validateField("description");
      this.validateField("quantity");
      this.validateField("price");
      this.validateField("omborxonaProId");

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
                message: "Rasxod yaratildi",
              });
              this.$emit("close");
              this.isSubmitting = false;
            } else {
              this.$emit("error", {
                status: "error",
                message: "Rasxod qo`shishda hatolik",
              });
            }
          })
          .catch((error) => {
            console.error(error);
            this.$emit("status", {
              status: "error",
              message: "Xatolik yuz berdi" || error.message,
            });
          });
      } else {
        api
          .put("/api/debt2/" + this?.update?.id, {
            omborxonaProId: this.debt?.omborxonaProId,
            quantity: this.debt?.quantity,
            description: this.debt?.description,
            reason: this.debt?.reason,
            price: this.debt?.price,
            breadId: this.debt?.breadId,
          })
          .then(({ status }) => {
            if (status === 200) {
              this.$emit("status", {
                status: "success",
                message: "Rasxod yangilandi",
              });
              this.$emit("close");
              this.isSubmitting = false;
            } else {
              this.$emit("status", {
                status: "error",
                message: "Rasxod yangilanishida",
              });
            }
          })
          .catch((error) => {
            console.error(error);
          });
      }
    },
  },
  mounted() {
    this.getWarehouseProducts();
    if (this?.update?.isUpdate) {
      this.debt = {
        omborxonaProId: this?.update?.omborxonaProId?._id,
        quantity: this?.update?.quantity,
        description: this?.update?.description,
        // reason: this?.update?.reason,
        price: this?.update?.omborxonaProId?.price,
      };
      //   console.log(this.debt);

      this.isUpdate = true;
    }
  },
};
</script>

<style>
</style>