<script setup lang="ts">
import { useAdminSignin } from '@/services/auth-admin'
import { Eye, EyeOff } from '@vicons/ionicons5'
import { useMessage, type FormInst, type FormRules } from 'naive-ui'
import { ref } from 'vue'

const { mutate, isPending } = useAdminSignin()

type FormData = {
  email?: string
  password?: string
}

const formData = ref<FormData>({
  email: undefined,
  password: undefined
})

const formRef = ref<FormInst>()
const message = useMessage()
const isPasswordVisible = ref(false)

const handleSubmit = () => {
  formRef.value?.validate((errors) => {
    if (!errors) {
      mutate(formData.value)

      return
    }
    message.error('validasi gagal')
  })
}

const rules: FormRules = {
  email: [
    {
      type: 'email',
      message: 'Email tidak valid'
    },
    {
      type: 'string',
      required: true,
      message: 'Email wajib diisi'
    }
  ],
  password: [
    {
      type: 'string',
      required: true,
      min: 8,
      pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/,
      message:
        'Password harus minimal 8 karakter, mengandung huruf besar, huruf kecil, angka, dan simbol (!@#$%^&*)'
    }
  ]
}
</script>

<template>
  <div class="flex min-h-screen">
    <!-- Left Side (Form) -->
    <div class="w-full flex flex-col justify-center items-center bg-white px-4 md:px-10">
      <div class="bg-white p-8 rounded-lg shadow-lg w-full max-w-md mt-4 mx-4 sm:mx-0 md:px-10">
        <h3 class="text-center text-xl leading-9 tracking-tight text-black">Masuk</h3>
        <p class="text-center text-xs font-medium leading-9 text-gray-500">
          Silahkan Masukkan Email dan Kata Sandi Anda
        </p>

        <n-form
          class="mt-6"
          @submit.prevent="handleSubmit"
          ref="formRef"
          :model="formData"
          :rules="rules"
        >
          <!-- Email -->
          <div class="mt-2">
            <n-form-item label="Email" path="email">
              <n-input
                placeholder="Masukkan Email"
                name="email"
                type="text"
                autocomplete="email"
                v-model:value="formData.email"
                required
                class="w-full"
              />
            </n-form-item>
          </div>

          <!-- Password -->
          <div class="mt-2">
            <n-form-item label="Kata Sandi" path="password">
              <div class="relative w-full">
                <n-input
                  placeholder="Masukkan Kata Sandi"
                  name="password"
                  :type="isPasswordVisible ? 'text' : 'password'"
                  v-model:value="formData.password"
                  required
                  class="w-full pr-10"
                />
                <button
                  type="button"
                  class="absolute inset-y-0 right-3 flex items-center text-gray-500"
                  @click="isPasswordVisible = !isPasswordVisible"
                >
                  <n-icon size="20">
                    <Eye v-if="!isPasswordVisible" />
                    <EyeOff v-else />
                  </n-icon>
                </button>
              </div>
            </n-form-item>
          </div>

          <!-- Button dan Lupa Password -->
          <div class="flex justify-between items-center mt-2">
            <RouterLink
              to="/auth/admin-forgot-password"
              class="font-semibold text-blue-600 hover:text-blue-500"
            >
              Lupa kata sandi?
            </RouterLink>
            <n-button :loading="isPending" attr-type="submit" type="primary" size="medium">
              Masuk
            </n-button>
          </div>
        </n-form>
      </div>
    </div>
  </div>
</template>

<route lang="yaml">
meta:
  layout: blank
</route>
