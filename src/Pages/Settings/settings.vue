<template>
  <div class="page">
    <div class="page-top d-flex j-between a-center">
      <b>Settings</b>
    </div>
    <div>
      <div class="settings-form">
        <div class="form-group">
          <label for="password">Parolni kiriting</label>
          <input
            type="text"
            placeholder="Password"
            id="password"
            v-model="passwords.password1"
          />
        </div>

        <div class="form-group">
          <label for="password2">Parolni Qayta kirting</label>
          <input
            type="text"
            placeholder="Password2"
            id="password2"
            v-model="passwords.passowrd2"
          />
        </div>
        <button class="change-button" @click="changePassowrd">Change</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      passwords: {
        password1: "",
        password2: "",
      },
    };
  },
  methods: {
    changePassowrd() {
      console.log(this.passwords);
    },
  },
};
</script>
<style>
.settings-form {
  width: 34%;
  display: flex;
  flex-direction: column;
  gap: 20px;
}
.change-button {
  width: 100%;
  height: 40px;
  border-radius: 8px;
  color: white;
  background-color: #6a8ffd;
  cursor: pointer;
  transition: 0.5s ease-in-out;
  margin-top: 5px;
}
.change-button:hover {
  background-color: #4d79ff;
}
@media screen and (max-width:900px) {
  .settings-form {
    width: 100%;
  }
}
</style>