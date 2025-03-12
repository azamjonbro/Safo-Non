<template>
  <transition name="slide-modal">
    <div class="modal" @click.self="$emit('close')">
      <div class="modal-content relative">
        <Icons name="xIcon" class="xIcon" @click="closeModal" />
        <h2>Yetkazuvchi yaratish</h2>

        <form>
          <div class="modal-form">
            <!-- <div class="form-group">
              <label for="quantity">Soni (Dona)</label>
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
            </div> -->
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
                :search="true"
                @blur="validateField('deliveryId')"
              />
              <p v-if="errors.deliveryId" class="error-text">
                {{ errors.deliveryId }}
              </p>
            </div>

            <div class="form-group">
              <label for="magazines">Yetkazuvchi</label>
              <CustomSelect
                :options="magazines"
                id="magazines"
                @input="selectMagazine($event)"
                :selected="delivery.magazineId"
                :search="true"
                @blur="validateField('magazineId')"
              />
              <p v-if="errors.magazineId" class="error-text">
                {{ errors.magazineId }}
              </p>
            </div>
          </div>
        </form>
        <form class="scroll" style="height: 50%">
          <div
            class="modal-form-2"
            v-for="(data, index) in typeOfBreadIds"
            :key="index"
          >
            <div class="form-group">
              <label for="bread">Non turini tanlang</label>
              <CustomSelect
                :options="typeOfBreads"
                id="bread"
                :selected="true"
                @input="selectArray($event, data.id)"
              />
            </div>

            <div class="form-group">
              <label for="quantity">Narxi</label>
              <input
                id="price"
                type="number"
                placeholder="Rasxod narxi"
                v-model="data.price"
                readonly
              />
              <!-- <p v-if="errors.price" class="error-text">
                {{ errors.price }}
              </p> -->
            </div>
            <div style="display: flex; align-items: end" class="gap12">
              <div class="form-group" style="width: 95%">
                <label for="quantity">Soni (Dona)</label>
                <input
                  id="quantity"
                  type="number"
                  placeholder="Rasxod sonini kiriting"
                  v-model="data.quantity"
                  @blur="validateField('quantity')"
                />
                <p v-if="data?.errors.quantity" class="error-text">
                  {{ data?.errors.quantity }}
                </p>
              </div>
              <Icons
                name="deleted"
                title="o'chirish"
                class="icon danger"
                @click="deleteRow(data?.id)"
              />
            </div>
          </div>
          <div class="d-flex j-end">
            <button
              type="button"
              class="create-button"
              @click="
                typeOfBreadIds.push({
                  id: typeOfBreadIds.length,
                  breadId: '',
                  quantity: 0,
                  price: 0,
                  errors: {},
                })
              "
            >
              Qo`shish
            </button>
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
      delivery: {
        description: "",
        // quantity: 0,
        deliveryId: "",
        magazineId: "",
      },
      typeOfBreadIds: [{ id: 0, quantity: 0, breadId: "", errors: {} }],
      deliveries: [],
      magazines: [],
      breads: [],
      typeOfBreads: [],
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
    getBreads() {
      api
        .get("/api/sellerBreads")
        .then(({ status, data }) => {
          if (status === 200) {
            this.typeOfBreads = data?.sellerBreads
              .map((item) => {
                return item.typeOfBreadId.map((i) => {
                  return {
                    text: i.breadId.title,
                    value: { bread: i, id: item._id },
                  };
                });
              })
              .flat(Infinity);
          }
        })
        .catch((error) => {
          console.error(error);
        });
    },
    getMagazines() {
      api
        .get("/api/magazines")
        .then(({ status, data }) => {
          if (status === 200) {
            this.magazines = data.magazines.map((item) => {
              return { text: item.title, value: item };
            });
          }
        })
        .catch((error) => {
          console.error(error);
        });
    },
    selectMagazine(id) {
      this.delivery.magazineId = id._id;
    },
    selectDelivery(id) {
      this.delivery.deliveryId = id._id;
    },
    deleteRow(index) {
      if (this.typeOfBreadIds.length > 1) {
        this.typeOfBreadIds = this.typeOfBreadIds.filter(
          (item) => item.id !== index
        );
      }
    },
    selectArray(value, index) {
      this.typeOfBreadIds = this.typeOfBreadIds.map((item) => {
        return item.id === index
          ? { ...item, breadId: value?.id, price: value?.bread?.breadId?.price }
          : item;
      });
      console.log(this.typeOfBreadIds, value);
    },
    closeModal() {
      this.$emit("close");
      this.isUpdate = false;
    },
    validateField(field) {
      this.errors[field] = "";
      if (field === "description" && !this.delivery.description?.trim()) {
        this.errors.description =
          "Foydalanuvchi descripyion bo'sh bo'lmasligi kerak";
      }
      if (field === "deliveryId" && !this.delivery.deliveryId?.trim()) {
        this.errors.deliveryId =
          "Foydalanuvchi descripyion bo'sh bo'lmasligi kerak";
      }
      if (field === "magazineId" && !this.delivery.magazineId?.trim()) {
        this.errors.magazineId = "Foydalanuvchi do`kon bo'sh bo'lmasligi kerak";
      }
      // if (
      //   field === "quantity" &&
      //   (!this.delivery.quantity ||
      //     isNaN(this.delivery.quantity) ||
      //     this.delivery.quantity <= 0)
      // ) {
      //   this.errors.quantity = "Soni (Dona) musbat son bo‘lishi kerak";
      // }
    },
    submitForm() {
      this.errors = {};
      // this.validateField("quantity");
      this.validateField("description");
      this.validateField("deliveryId");
      this.validateField("magazineId");
      for (const error in this.errors) {
        if (this.errors[error] !== "") {
          return;
        }
      }
      this.isSubmitting = true;
      if (!this.isUpdate) {
        api
          .post("/api/orderWithDelivery", {
            ...this.delivery,
            typeOfBreadIds: this.typeOfBreadIds.map((item) => {
              return { quantity: item.quantity, bread: item.breadId };
            }),
          })
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
            this.isSubmitting = false;
            console.error(error);
          });
      } else {
        api
          .put("/api/orderWithDelivery/" + this.update.id, {
            ...this.delivery,
            typeOfBreadIds: this.typeOfBreadIds.map((item) => {
              return { quantity: item.quantity, bread: item.breadId };
            }),
          })
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
              return { text: item.username, value: item };
            });
          }
        })
        .catch((error) => {
          console.error(error);
        });
    },
  },
  mounted() {
    this.getMagazines();
    this.getDeliveries();
    this.getBreads();
    if (this?.update?.isUpdate) {
      (this.typeOfBreadIds = this.update?.typeOfBreadIds.map((item, index) => {
        return {
          id: index,
          quantity: item.quantity,
          breadId: item.bread._id,
          price: item.bread.price,
          errors: {},
        };
      })),
        (this.delivery = {
          quantity: this.update?.quantity,
          description: this.update?.description,
          delivery: this.update?.delivery,
        });
      this.isUpdate = true;
    }
  },
};
</script>

<style>
.modal-form-2 {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  margin-bottom: 10px;
}
</style>