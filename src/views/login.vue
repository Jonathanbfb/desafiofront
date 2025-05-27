<template>
  <v-app>
    <v-main class="login-background">
      <v-container class="fill-height d-flex justify-center align-center">
        <v-card elevation="10" class="login-card">
          <v-card-title class="justify-center">
            <div class="logo-wrapper">
              <img src="@/assets/logo-login.svg" alt="Logo WatchFlix" class="logo-image" />
            </div>
          </v-card-title>

          <v-card-text>
            <v-text-field
              v-model="username"
              label="Usuário"
              prepend-inner-icon="mdi-account"
              color="primary"
              variant="outlined"
            />
            <v-text-field
              v-model="password"
              label="Senha"
              type="password"
              prepend-inner-icon="mdi-lock"
              color="primary"
              variant="outlined"
            />
          </v-card-text>

          <v-card-actions class="justify-center">
            <v-btn color="primary" size="large" @click="login" rounded elevation="2">
              Entrar
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-container>
    </v-main>
  </v-app>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'
import { useAuthStore } from '@/stores/auth'

const username = ref('')
const password = ref('')
const auth = useAuthStore()
const router = useRouter()

interface LoginResponse {
  access_token: string
}

const login = async () => {
  const res = await axios.post<LoginResponse>(`${import.meta.env.VITE_API_URL}/auth/login`, {
    username: username.value,
    password: password.value,
  })
  auth.setToken(res.data.access_token)
  router.push('/dashboard')
}
</script>

<style scoped>
.login-background {
  background: linear-gradient(145deg, #1e1e2f, #3a0ca3);
  min-height: 100vh;
}

.login-card {
  width: 100%;
  max-width: 500px;
  padding: 32px 24px;
  background-color: white;
  border-radius: 16px;
}

.logo-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  padding: 10px 0;
}

.logo-image {
  width: 100%;
  max-width: 280px;
  height: auto;
  object-fit: contain;
}
</style>
