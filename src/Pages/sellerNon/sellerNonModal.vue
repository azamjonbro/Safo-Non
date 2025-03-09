<template>
  <transition name="slide-modal">
    <div class="modal" @click.self="$emit('close')">
      <div class="modal-content relative">
        <Icons name="xIcon" class="xIcon" @click="closeModal" />
        <h2>Nonvoy yaratish</h2>
        <form>
          <div class="modal-form">
            <div class="form-group">
              <label for="name">Foydalanuvchi nomi</label>
              <input
                id="name"
                type="text"
                v-model="bread.name"
                placeholder="Foydalanuvchi nomini kiriting"
                @blur="validateField('name')"
              />
              <p v-if="errors.name" class="error-text">
                {{ errors.name }}
              </p>
            </div>
            <div class="form-group">
              <label for="ovenId">Nonxonaga tegishli tandir raqami</label>
              <input
                id="ovenId"
                type="text"
                v-model="bread.ovenId"
                placeholder="Foydalanuvchi tandir raqamini kiriting"
                @blur="validateField('ovenId')"
              />
              <p v-if="errors.ovenId" class="error-text">{{ errors.ovenId }}</p>
            </div>
            <div class="form-group">
              <label for="quantity">Soni (Dona)</label>
              <input
                id="quantity"
                type="number"
                placeholder="Rasxod sonini kiriting"
                v-model="bread.quantity"
                @blur="validateField('quantity')"
              />
              <p v-if="errors.quantity" class="error-text">
                {{ errors.quantity }}
              </p>
            </div>

            <div class="form-group">
              <label for="qopQuantity">Qop Soni (Dona)</label>
              <input
                id="qopQuantity"
                type="number"
                placeholder="Qop sonini kiriting"
                v-model="bread.qopQuantity"
                @blur="validateField('qopQuantity')"
              />
              <p v-if="errors.qopQuantity" class="error-text">
                {{ errors.qopQuantity }}
              </p>
            </div>
          </div>
        </form>
        <form class="scroll" style="height: 50%">
          <div class="modal-form-2" v-for="(data, index) in count" :key="index">
            <div class="form-group">
              <label for="bread">Non turini tanlang</label>
              <CustomSelectVue
                :search="true"
                :options="
                  allTypeOfBread.map((item) => {
                    return { text: item.title, value: item._id };
                  })
                "
                id="bread"
                :selected="data?.breadId"
                @input="selectBread($event, index)"
                @blur="validateArrayField('breadId', index)"
              />
              <p v-if="data?.errors.breadId" class="error-text">
                {{ data?.errors.breadId }}
              </p>
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
                  @blur="validateArrayField('quantity', index)"
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
                count.push({
                  id: count.length,
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
            type="button"
            @click="submitForm()"
            class="action-button"
            :disabled="isSubmitting"
          >
            {{
              !isUpdate
                ? isSubmitting
                  ? "Yaratilmoqda..."
                  : "Yaratish"
                : isSubmitting
                ? "Yangilanyapti..."
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
import CustomSelectVue from "@/components/Template/customSelect.vue";
export default {
  components: {
    Icons,
    CustomSelectVue,
  },
  props: {
    update: {
      type: Object,
    },
  },
  data() {
    return {
      isSubmitting: false,
      bread: {
        name: "",
        ovenId: "",
        quantity: 0,
        qopQuantity: 0,
      },
      errors: {},
      isUpdate: false,
      allTypeOfBread: [],
      count: [{ id: 0, breadId: "", quantity: 0, price: 0, errors: {} }],
    };
  },
  methods: {
    deleteRow(id) {
      if (this.count.length > 1) {
        this.count = this.count.filter((item) => item.id !== id);
      }
    },
    validateArrayField(field, index) {
      this.count = this.count.map((item) => {
        if (item.id === index) {
          item.errors[field] = "";
          if (field === "breadId" && !item.breadId.trim()) {
            item.errors.breadId = "Noni turini tanlang";
          }
          if (
            field === "quantity" &&
            (isNaN(item.quantity) || item.quantity <= 0)
          ) {
            item.errors.quantity = "Soni (Dona) musbat son bo‘lishi kerak";
          }
          return { ...item };
        } else {
          return item;
        }
      });
    },
    selectBread(id, index) {
      this.count = this.count.map((item) =>
        item.id === index
          ? {
              ...item,
              breadId: id,
              price: this.allTypeOfBread[index].price,
            }
          : item
      );
    },
    closeModal() {
      this.$emit("close");
    },
    validateField(field) {
      this.errors[field] = "";
      if (field === "name" && !this.bread.name.trim()) {
        this.errors.name = "Foydalanuvchi nomi bo'sh bo'lmasligi kerak";
      }
      if (
        field === "ovenId" &&
        (!this.bread.ovenId || isNaN(this.bread.ovenId))
      ) {
        this.errors.ovenId = "Tandir raqami raqam bo‘lishi kerak";
      }
      //  if (
      //   field === "password" &&
      //   (!this.user.password || isNaN(this.user.password))
      // ) {
      //   this.errors.password = "Foydalanuvchi paroli bo‘lishi bo`lmasligi kerak";
      // }
      if (
        field === "price" &&
        (!this.user.price || isNaN(this.user.price) || this.user.price < 0)
      ) {
        this.errors.price = "Narx musbat son bo‘lishi kerak";
      }

      if (
        field === "quantity" &&
        (!this.bread.quantity ||
          isNaN(this.bread.quantity) ||
          this.bread.quantity <= 0)
      ) {
        this.errors.quantity = "Soni (Dona) musbat son bo‘lishi kerak";
      }

      if (
        field === "qopQuantity" &&
        (!this.bread.qopQuantity ||
          isNaN(this.bread.qopQuantity) ||
          this.bread.qopQuantity <= 0)
      ) {
        this.errors.qopQuantity = "Soni (Dona) musbat son bo‘lishi kerak";
      }
      // qopQuantity
    },
    async submitForm() {
      this.errors = {};
      this.validateField("name");
      this.validateField("ovenId");
      this.validateField("quantity");

      if (!Object.keys(this.errors).length) {
        return;
      }

      this.isSubmitting = true;
      if (!this.isUpdate) {
        try {
          const response = await api.post("/api/sellerBread", {
            ...this.bread,
            typeOfBreadId: this.count.map((item) => {
              return { breadId: item.breadId, quantity: item.quantity };
            }),
          });

          if (response?.status == 201) {
            this.$emit("status", {
              status: "success",
              message: "Nonvoy muvaffaqqiyatli qo'shildi",
            });
            this.closeModal();
          } else {
            this.$emit("status", {
              status: "error",
              message: "Nonvoy qo'shishda hatolik",
            });
          }
          this.isSubmitting = false;
        } catch (error) {
          this.$emit("status", {
            status: "error",
            message:
              error.response?.data?.message ||
              error.message ||
              "Xatolik yuz berdi",
          });
        } finally {
          this.isSubmitting = false;
        }
      } else {
        try {
          const response = await api.put(
            "/api/sellerBread/" + this?.update?._id,
            {
              ...this.bread,
              typeOfBreadId: this.count.map((item) => {
                return { breadId: item.breadId, quantity: item.quantity };
              }),
            }
          );
          if (response?.status == 200) {
            this.$emit("status", {
              status: "success",
              message: "Nonvoy muvaffaqqiyatli yangilandi",
            });
            this.closeModal();
          } else {
            this.$emit("status", {
              status: "error",
              message: "Nonvoy yangilanishida hatolik",
            });
          }
          this.isSubmitting = true;
        } catch (error) {
          this.$emit("status", {
            status: "error",
            message:
              error.response?.data?.message ||
              error.message ||
              "Xatolik yuz berdi",
          });
        } finally {
          this.isSubmitting = false;
        }
      }
    },
    getallTypeOfBread() {
      api
        .get("/api/typeOfBreads")
        .then(({ data, status }) => {
          if (status === 200) {
            this.allTypeOfBread = data?.typeOfBreads;
          }
        })
        .catch((error) => {
          console.error(error);
        });
    },
  },
  mounted() {
    if (this?.update?.isUpdate) {
      this.bread = {
        name: this?.update?.name,
        ovenId: this?.update?.ovenId,
        quantity: this?.update?.quantity,
      };

      this.count = this.update.typeOfBreadId.map((item) => {
        return {
          breadId: item.breadId._id,
          quantity: item.quantity,
          price: item.breadId.price,
          errors: {},
        };
      });

      this.isUpdate = true;
    }
    this.getallTypeOfBread();
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

.error-text {
  color: red;
  font-size: 14px;
  margin-top: 5px;
}

.xIcon {
  position: absolute;
  top: 50px;
  right: 100px;
  z-index: 101;
}

.xIcon > svg {
  width: 60px;
  height: 60px;
}
</style>
