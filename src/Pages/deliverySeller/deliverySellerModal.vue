<template>
  <transition name="slide-modal">
    <div class="modal" @click.self="$emit('close')">
      <div class="modal-content relative">
        <Icons name="xIcon" class="xIcon" @click="closeModal" />
        <h2>Yetkazuvchiga non berish</h2>
        <!-- <form class="scroll" ></form> -->
        <form>
          <div class="modal-form">
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
              <label for="bread">Qaysi narxda</label>
              <CustomSelect :options="prices" @input="selectPrice($event)" />
            </div>
          </div>
          <div class="scroll" style="height: 70%">
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
                  :selected="data.breadId"
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
          </div>
          <div class="modal-form">
            <div class="form-group">
              <label for="description">Tasnif</label>
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
              <label for="quantity">Qoldiq summa</label>
              <input
                id="price"
                type="number"
                placeholder="0"
                readonly
                v-model="totalAmountPrice"
              />
            </div>
            <div class="form-group">
              <label for="quantity">Qoldiq soni</label>
              <input
                id="price"
                type="number"
                placeholder="0"
                readonly
                v-model="totalAmountQuantity"
              />
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
      delivery: {
        description: "",
        deliveryId: "",
        pricetype:""
      },
      typeOfBreadIds: [
        {
          id: 0,
          quantity: 0,
          bread: "",
          typeOfBread: "",
          errors: {},
          price: 0,
        },
      ],
      deliveries: [],
      breads: [],
      typeOfBreads: [],
      typeOfBreads2: new Map(),
      errors: {},
      isUpdate: false,
      prices: [
        { text: "Tan narxi", value: "tan" },
        { text: "To`yxona", value: "toyxona" },
        { text: "Do`kon", value: "dokon" },
      ],
    };
  },
  props: {
    update: {
      type: Object,
    },
  },
  computed: {
    totalAmountPrice() {
      return (
        this.typeOfBreads.reduce((a, b) => a + b.totalPrice, 0) -
        this.typeOfBreadIds.reduce((a, b) => a + b.price, 0)
      );
    },
    totalAmountQuantity() {
      return (
        this.typeOfBreads.reduce((a, b) => a + b.totalQuantity, 0) -
        this.typeOfBreadIds.reduce((a, b) => a + b.quantity, 0)
      );
    },
  },
  methods: {
    selectPrice(type) {
      this.delivery.pricetype = type;
    },
    getBreads() {
      api
        .get("/api/sellerBreads")
        .then(({ status, data }) => {
          if (status === 200) {
            const groupedBreads = data?.sellerBreads.reduce((acc, bread) => {
              bread.typeOfBreadId.forEach((breadDetail) => {
                const { breadId, quantity, qopQuantity } = breadDetail;
                if (!acc[breadId._id]) {
                  acc[breadId._id] = {
                    text: breadId.title,
                    value: {
                      quantity: 0,
                      qopQuantity: 0,
                      bread: breadId,
                      id: bread._id,
                    },
                  };
                }
                acc[breadId._id].value.quantity += quantity;
                acc[breadId._id].value.qopQuantity += qopQuantity;
              });
              return acc;
            }, {});

            this.typeOfBreads = Object.values(groupedBreads);
          }
        })
        .catch((error) => {
          console.error(error);
        });
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
      console.log(value);
      this.typeOfBreadIds = this.typeOfBreadIds.map((item) => {
        return item.id === index
          ? {
              ...item,
              bread: value?.id,
              price:
                this.delivery.pricetype === ""
                  ? value.bread.price
                  : this.delivery.pricetype === "toyxona"
                  ? value.bread.price3
                  : this.delivery.pricetype === "dokon"
                  ? value.bread.price2
                  : value.bread.price,
              typeOfBread: value?.breadx?.breadId?._id,
            }
          : item;
      });
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
    },
    submitForm() {
      this.errors = {};
      this.validateField("description");
      this.validateField("deliveryId");
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
              return {
                quantity: item.quantity,
                bread: item.bread,
                typeOfBread: item.typeOfBread,
              };
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
            this.$emit("status", {
              status: "error",
              message:
                error.response.data.message ||
                error.data.message ||
                "Xatolik yuz berdi",
            });
          });
      } else {
        api
          .put("/api/orderWithDelivery/" + this.update.id, {
            ...this.delivery,
            typeOfBreadIds: this.typeOfBreadIds.map((item) => {
              return {
                quantity: item.quantity,
                bread: item.bread,
                typeOfBread: item.typeOfBread,
              };
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