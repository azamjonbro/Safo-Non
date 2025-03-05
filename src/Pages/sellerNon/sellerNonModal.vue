<template>
  <transition name="slide-modal">
    <div class="modal" @click.self="$emit('close')">
      <div class="modal-content relative">
        <Icons name="xIcon" class="xIcon" @click="closeModal" />
        <h2>Nonvoy yaratish</h2>
        <form>
          <div class="modal-form">
            <div class="form-group">
              <label for="username">Foydalanuvchi nomi</label>
              <input
                id="username"
                type="text"
                v-model="bread.username"
                placeholder="Foydalanuvchi nomini kiriting"
                @blur="validateField('username')"
              />
              <p v-if="errors.username" class="error-text">
                {{ errors.username }}
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
              <label for="quantity">Sonni</label>
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
          </div>
        </form>
        <form>
          <div
            class="modal-form-2"
            v-for="(_, index) in count"
            :key="index"
          ></div>
          <div class="d-flex j-end">
            <button type="button" class="create-button" @click="count.push(count.length + 1)">Qo`shish</button>
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
export default {
  components: {
    Icons,
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
        username: "",
        ovenId: "",
        quantity: "",
      },
      errors: {},
      isUpdate: false,
      allTypeOfBread: [],
      count: [],
    };
  },
  methods: {
    closeModal() {
      this.$emit("close");
    },
    validateField(field) {
      this.errors[field] = "";
      if (field === "username" && !this.bread.username.trim()) {
        this.errors.username = "Foydalanuvchi nomi bo'sh bo'lmasligi kerak";
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
        this.errors.quantity = "Sonni musbat son bo‘lishi kerak";
      }
    },
    async submitForm() {
      this.errors = {};

      if (!Object.keys(this.errors).length) {
        return;
      }

      this.isSubmitting = true;
      if (!this.isUpdate) {
        try {
          const response = await api.post("/api/seller", {
            ...this.user,
            password: this.password ? this.password : this.user.phone.slice(-4),
          });
          console.log(response);

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
      } else {
        try {
          const response = await api.put(
            "/api/seller/" + this?.update?._id,
            this.user
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
    this.getallTypeOfBread();
    console.log(this.allTypeOfBread);

    if (this?.update?.isUpdate) {
      this.user = {};
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