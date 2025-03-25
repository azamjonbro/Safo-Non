<template>
  <transition name="slide-modal">
    <div class="modal" @click.self="$emit('close')">
      <div class="modal-content relative">
        <Icons name="xIcon" class="xIcon" @click="closeModal" />
        <h2>Manager yaratish</h2>
        <form>
          <div class="modal-form">
            <div class="form-group">
              <label for="username">Managerni nomi</label>
              <input
                id="username"
                type="text"
                v-model="user.username"
                placeholder="Managerni nomini kiriting"
                maxlength="20"
                @input="sanitizeInput('username')"
                @blur="validateField('username')"
              />
              <p v-if="errors.username" class="error-text">
                {{ errors.username }}
              </p>
            </div>
            <div class="form-group">
              <label for="password">Parol</label>
              <input
                type="text"
                id="password"
                v-model="user.password"
                placeholder="Manager parolini kiriting"
                maxlength="30"
                @input="sanitizeInput('password')"
                @blur="validateField('password')"
              />
              <p v-if="errors.password" class="error-text">
                {{ errors.password }}
              </p>
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
      user: {
        username: "",
        password: "",
      },
      errors: {},
      isUpdate: false,
    };
  },
  methods: {
    closeModal() {
      this.$emit("close");
    },
    sanitizeInput(field) {
      if (field === "username") {
        this.user.username = this.user.username.replace(/[^a-zA-Z0-9]/g, "");
      }
      if (field === "password") {
        this.user.password = this.user.password.replace(/[^a-zA-Z0-9@#!-_]/g, "");
      }
    },
    validateField(field) {
      this.errors[field] = "";
      if (field === "username" && !this.user.username?.trim()) {
        this.errors.username = "Managerni nomi bo'sh bo'lmasligi kerak";
      }
      if (field === "password" && !this.user.password?.trim()) {
        this.errors.password = "Managerni paroli bo'sh bo'lmasligi kerak";
      }
    },
    async submitForm() {   
      this.errors = {};
      this.validateField("username");
      this.validateField("password");

      if (!Object.keys(this.errors)) {
        return;
      }
      this.isSubmitting = true;

      if (!this.isUpdate) {
        try {
          const response = await api.post("/api/manager", this.user);          
          if (response?.status == 201) {
            this.$emit("status", {
              status: "success",
              message: "Manager muvaffaqqiyatli qo'shildi",
            });
            this.closeModal();
          } else {
            this.$emit("status", {
              status: "error",
              message: "Manager qo'shishda hatolik",
            });
          }
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
            "/api/manager/" + this?.update?.id,
            this.user
          );
          if (response?.status == 200) {
            this.$emit("status", {
              status: "success",
              message: "Manager muvaffaqqiyatli yangilandi",
            });
            this.closeModal();
          } else {
            this.$emit("status", {
              status: "error",
              message: "Manager yangilanishida hatolik",
            });
          }
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
  },
  mounted() {
    if (this?.update?.isUpdate) {
      this.user = {
        username: this?.update?.username,
        password: this?.update?.password,
      };
      this.isUpdate = true;
    }
  },
};
</script>

<style>
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
