<template>
    <transition name="slide-modal">
        <div class="modal" @click.self="$emit('close')">
            <div class="modal-content relative">
                <Icons name="xIcon" class="xIcon" @click="closeModal" />
                <h2>Nonvoy yaratish</h2>
                <form @submit.prevent="submitForm">
                    <div class="modal-form">
                        <div class="form-group">
                            <label for="username">Foydalanuvchi nomi</label>
                            <input id="username" type="text" v-model="user.username"
                                placeholder="Foydalanuvchi nomini kiriting" @blur="validateField('username')" />
                            <p v-if="errors.username" class="error-text">{{ errors.username }}</p>
                        </div>
                        <div class="form-group">
                            <label for="ovenId">Foydalanuvchiga tegishli tandir raqami</label>
                            <input id="ovenId" type="number" v-model="user.ovenId"
                                placeholder="Foydalanuvchi tandir raqamini kiriting" @blur="validateField('ovenId')" />
                            <p v-if="errors.ovenId" class="error-text">{{ errors.ovenId }}</p>
                        </div>
                        <div class="form-group">
                            <label for="phone">Telefon raqami</label>
                            <input id="phone" type="text" v-model="user.phone" placeholder="Telefon raqamini kiriting"
                                @blur="validateField('phone')" />
                            <p v-if="errors.phone" class="error-text">{{ errors.phone }}</p>
                        </div>
                        <div class="form-group">
                            <label for="price">Har bir non uchun narxi</label>
                            <input id="price" type="number" v-model="user.price" placeholder="Summa kiriting"
                                @blur="validateField('price')" />
                            <p v-if="errors.price" class="error-text">{{ errors.price }}</p>
                        </div>
                    </div>
                </form>
                    <div class="modal-buttons d-flex j-end a-center gap24">
                        <button type="button" class="action-button" @click="closeModal">
                            Chiqish
                        </button>
                        <button type="submit" class="action-button" :disabled="isSubmitting">
                            {{ isSubmitting ? "Yaratilmoqda..." : "Yaratish" }}
                        </button>
                    </div>
            </div>
        </div>
    </transition>
</template>

<script>
import Icons from "@/components/Template/Icons.vue";
import Api from "@/Utils/axios"
export default {
    components: {
        Icons,
        Api
    },
    data() {
        return {
            isSubmitting: false,
            user: {
                username: "",
                phone: "",
                price: "",
                ovenId: "",
            },
            errors: {},
        };
    },
    methods: {
        closeModal() {
            this.$emit("close");
        },
        validateField(field) {
            this.errors[field] = "";
            if (field === "username" && !this.user.username.trim()) {
                this.errors.username = "Foydalanuvchi nomi bo'sh bo'lmasligi kerak";
            }
            if (field === "ovenId" && (!this.user.ovenId || isNaN(this.user.ovenId))) {
                this.errors.ovenId = "Tandir raqami raqam bo‘lishi kerak";
            }
            if (field === "phone") {
                const regex = /^\+998\d{9}$/;
                if (!this.user.phone.trim()) {
                    this.errors.phone = "Telefon raqamini kiriting";
                } else if (!regex.test(this.user.phone)) {
                    this.errors.phone = "Telefon raqami noto‘g‘ri formatda (+998XXXXXXXXX)";
                }
            }
            if (field === "price" && (!this.user.price || isNaN(this.user.price) || this.user.price <= 0)) {
                this.errors.price = "Narx musbat son bo‘lishi kerak";
            }
        },
        async submitForm() {
            this.errors = {};
            this.validateField("username");
            this.validateField("phone");
            this.validateField("price");
            this.validateField("ovenId");

            if (Object.keys(this.errors).length > 0) {
                return;
            }

            this.isSubmitting = true;
            try {
                Api.post('/api')
                this.closeModal();
                this.isSubmitting=true
            } catch (error) {
                console.error("Xatolik yuz berdi:", error);
            } finally {
                this.isSubmitting = false;
            }
        },
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

.xIcon>svg {
    width: 60px;
    height: 60px;
}
</style>