import { useToast } from "vue-toastification";

const toast = useToast();

export const showSuccess = (message = "Muvaffaqiyatli bajarildi!") => {
  toast.success(message, { timeout: 3000 });
};

export const showError = (message = "Xatolik yuz berdi!") => {
  toast.error(message, { timeout: 5000 });
};

export const showInfo = (message = "Ma'lumot!") => {
  toast.info(message, { timeout: 4000 });
};

export const showWarning = (message = "Diqqat!") => {
  toast.warning(message, { timeout: 4000 });
};
