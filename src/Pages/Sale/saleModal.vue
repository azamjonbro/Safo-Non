<template>
  <transition name="slide-modal">
    <div class="modal" @click.self="$emit('close')">
      <div class="modal-content relative">
        <Icons name="xIcon" class="xIcon" @click="closeModal" />
        <h2>{{ isUpdate ? "Sotuvni yangilash" : "Sotuv yaratish" }}</h2>
        <!-- <form class="scroll" ></form> -->
        <form>
          <div class="modal-form">
            <div class="form-group">
              <label for="breadId">Non turi</label>
              <CustomSelect
                :search="true"
                :options="
                  breads.map((i) => {
                    return { text: i.bread.title, value: i };
                  })
                "
                @blur="validateField('breadId')"
                @input="selectBreadId($event)"
                :placeholder="'Non turini kiriting'"
                :selected="sale.breadId"
              />
              <p v-if="errors.breadId" class="error-text">
                {{ errors.breadId }}
              </p>
            </div>
            <div class="form-group">
              <label for="breadId">Qaysi narxda</label>
              <CustomSelect
                :search="true"
                :options="prices"
                @blur="validateField('pricetype')"
                @input="selectPrice($event)"
                :placeholder="'Non turini kiriting'"
                :selected="sale.pricetype"
              />
              <p v-if="errors.pricetype" class="error-text">
                {{ errors.pricetype }}
              </p>
            </div>
            <div class="form-group">
              <label for="quantity">Sotilgan nonlar soni</label>
              <input
                type="number"
                placeholder="Sotilgan nonlar soni kiriting"
                v-model="sale.quantity"
                @blur="validateField('quantity')"
              />
              <p v-if="errors.quantity" class="error-text">
                {{ errors.quantity }}
              </p>
            </div>
            <div class="form-group">
              <label for="money">Olingan pul</label>
              <input
                type="number"
                placeholder="Qabul qilingan summa"
                v-model="sale.money"
                @blur="validateField('money')"
              />
              <p v-if="errors.money" class="error-text">
                {{ errors.money }}
              </p>
            </div>

            <div class="form-group">
              <label for="description">Tavsif</label>
              <input
                type="text"
                placeholder="Tavsif"
                v-model="sale.description"
                @blur="validateField('description')"
              />
              <p v-if="errors.description" class="error-text">
                {{ errors.description }}
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
      sale: {
        breadId: "",
        quantity: 0,
        money: 0,
        description: "",
        pricetype: "",
      },

      errors: {},
      isUpdate: false,
      prices: [
        { text: "Tan narxi", value: "tan" },
        { text: "To`yxona", value: "toyxona" },
        { text: "Do`kon", value: "dokon" },
      ],
      breads: [],
    };
  },
  props: {
    update: {
      type: Object,
    },
  },
  computed: {},
  methods: {
    selectBreadId(value) {
      this.sale.breadId = value._id;
    },
    selectPrice(type) {
      this.sale.pricetype = type;
    },
    closeModal() {
      this.$emit("close");
      this.isUpdate = false;
    },
    validateField(field) {
      this.errors[field] = "";
      if (field === "breadId" && !this.sale.breadId?.trim()) {
        this.errors.breadId = "Sotuvga non tanlang";
      }
      if (field === "description" && !this.sale.description?.trim()) {
        this.errors.description = "Sotuvni Tavnifi bo'sh bo'lmasligi kerak";
      }
      if (field === "pricetype" && !this.sale.pricetype?.trim()) {
        this.errors.pricetype = "Sotuvni Tavnifi bo'sh bo'lmasligi kerak";
      }
      if (
        (field === "quantity" && !this.sale.quantity) ||
        isNaN(this.sale.quantity) ||
        this.sale.quantity < 0
      ) {
        this.errors.quantity = "Narx musbat son bo‘lishi kerak";
      }

      if (
        (field === "money" && !this.sale.money) ||
        isNaN(this.sale.money) ||
        this.sale.money < 0
      ) {
        this.errors.money = "Narx musbat son bo‘lishi kerak";
      }
    },
    submitForm() {
      this.errors = {};
      this.validateField("breadId");
      this.validateField("description");
      this.validateField("pricetype");
      this.validateField("quantity");
      this.validateField("money");
      for (const error in this.errors) {
        if (this.errors[error] !== "") {
          return;
        }
      }
      this.isSubmitting = true;
      if (!this.isUpdate) {
        api
          .post("/api/sale", this.sale)
          .then(({ status }) => {
            if (status === 201) {
              this.$emit("status", {
                status: "success",
                message: "sotuv yaratildi",
              });
              this.closeModal();
              this.isSubmitting = false;
            } else {
              this.$emit("status", {
                status: "error",
                message: "sotuv yaratilishida hatolik yuz berdi",
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
          .put("/api/sale/" + this.update.id, this.sale)
          .then(({ status }) => {
            if (status === 200) {
              this.$emit("status", {
                status: "success",
                message: "sotuv yangilandi",
              });
              this.closeModal();
              this.isSubmitting = false;
              this.isUpdate = false;
            } else {
              this.$emit("status", {
                status: "error",
                message: "sotuv yangilanishida hatolik yuz berdi",
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
      }
    },
    getBreads() {
      api
        .get("/api/manager's/warehouse")
        .then(({ status, data }) => {
          if (status === 200) {
            this.breads = data?.datas
          }
        })
        .catch((error) => {
          console.error(error);
        });
    },
  },
  mounted() {
    this.getBreads();
    if (this.update?.isUpdate) {
      this.sale = {
        breadId: this?.update?.breadId,
        quantity: this?.update?.quantity,
        money: this?.update?.money,
        description: this?.update?.description,
        pricetype: this?.update?.pricetype,
      };
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