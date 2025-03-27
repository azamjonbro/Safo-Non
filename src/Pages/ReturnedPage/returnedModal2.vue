<template>
  <transition name="slide-modal">
    <div class="modal" @click.self="$emit('close')">
      <div class="modal-content relative">
        <Icons name="xIcon" class="xIcon" @click="closeModal" />
        <h2>Yetkazuvchiga non berish</h2>

        <div class="scroll" style="height: 100%; margin-top: 30px">
          <div class="modal-form-2">
            <div class="form-group">
              <label for="bread">Umumiy hisob</label>
              <input
                id="price"
                type="text"
                placeholder="Rasxod narxi"
                v-model="datas.totalPrice"
                readonly
              />
            </div>
            <div class="form-group">
              <label for="bread">Tavsif</label>
              <input
                id="price"
                type="text"
                placeholder="Rasxod narxi"
                v-model="datas.order.description"
                readonly
              />
            </div>
            <div class="form-group">
              <label for="bread">Soni</label>
              <input
                id="price"
                type="text"
                placeholder="Rasxod narxi"
                v-model="datas.order.totalQuantity"
                readonly
              />
            </div>
            <div class="form-group">
              <label for="bread">Yetkazuvchi</label>
              <CustomSelect
                :selected="datas.deliveryId.username"
                :options="
                  deliveries.map((i) => {
                    return { text: i.username, value: i._id };
                  })
                "
                @input="selectDelivery($event)"
                @blur="validateField('deliveryId')"
              />
              <p v-if="errors.deliveryId" class="error-text">
                {{ errors.deliveryId }}
              </p>
            </div>
          </div>
        </div>

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
import CustomSelect from "@/components/Template/customSelect.vue";
import api from "@/Utils/axios";
export default {
  components: {
    CustomSelect,
  },
  data() {
    return {
      IsSubmitting: false,
      deliveries: [],
      deliveryId: "",
      errors: {},
    };
  },
  props: {
    datas: {
      type: Object,
    },
  },
  methods: {
    validateField(field) {
      this.errors[field] = "";
      if (field === "deliveryId" && !this.deliveryId.trim()) {
        this.errors.deliveryId = "Yetkazuvchini tanlang";
      }
    },
    selectDelivery(emit) {
      this.deliveryId = emit;
    },
    closeModal() {
      this.$emit("close");
    },
    deleteReturned(id) {
      api
        .delete("/api/returnedPro/" + id)
        .then((status) => {
          if (status === 200) {
            console.log(`zor`);
          } else {
            console.log("balki zor");
          }
        })
        .catch((error) => {
          console.error(error);
        });
    },
    getDeliveries() {
      api
        .get("/api/deliveries")
        .then(({ data, status }) => {
          if (status === 200) {
            this.deliveries = data?.deliveries;
          }
        })
        .catch((error) => {
          console.error(error);
        });
    },
    submitForm() {
      this.errors = {};
      this.validateField("deliveryId");
      if (Object.keys(!this.errors).length) {
        return;
      }
      this.IsSubmitting = true;
      api
        .post("/api/orderWithDelivery", {
          typeOfBreadIds: this.datas.order.typeOfBreadIds.map((item) => {
            return { bread: item._id, quantity: item.quantity };
          }),
          totalQuantity: this.datas.order.totalQuantity,
          pricetype: this.datas.order.pricetype,
          description: this.datas.order.description,
          deliveryId: this.deliveryId,
          type: "returned",
        })
        .then(({ status }) => {
          if (status === 201) {
            this.deleteReturned(this.datas._id);
            this.$emit("status", {
              status: "success",
              message: "Nonlar yetkazuvchilarga berildi",
            });
            this.closeModal();
          } else {
            this.$emit("status", {
              status: "error",
              message: "Nonlar yetkazuvchilarga berishda hatolik yuz berdi",
            });
          }
        })
        .catch((error) => {
          console.error(error);
          this.$emit("status", {
            status: "error",
            message: error.response.data.message || "Xatolik yuz berdi",
          });
        });
    },
  },
  mounted() {
    this.getDeliveries();
  },
};
</script>

<style scoped>
.modal-form-2 {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
  margin-bottom: 10px;
}
</style>