<script setup lang="ts">
import { useUserSignin } from '@/services/auth-user'
import { Eye, EyeOff } from '@vicons/ionicons5'
import { useMessage, type FormInst, type FormRules } from 'naive-ui'
import { ref } from 'vue'

const params = ref({ someParam: 'value' })
const { mutate, isPending } = useUserSignin()

type FormData = {
  phone?: string
  pin?: string
}

const formData = ref<FormData>({
  phone: undefined,
  pin: undefined
})

const currentIndex = ref(0)
const formRef = ref<FormInst>()
const message = useMessage()
const isPinVisible = ref(false)

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
  phone: [
    {
      type: 'string',
      required: true,
      message: 'Nomor telepon wajib diisi'
    },
    {
      type: 'string',
      required: true,
      pattern: /^[0-9]+$/,
      message: 'Nomor telepon harus berupa angka'
    },
    {
      type: 'string',
      required: true,
      min: 8,
      max: 13,
      message: 'Nomor HP tidak sesuai, harus diantara 8-13 karakter angka'
    }
  ],
  pin: [
    {
      required: true,
      message: 'PIN wajib diisi'
    },
    {
      pattern: /^[0-9]{6}$/,
      message: 'PIN harus 6 angka'
    }
  ]
}
</script>

<template>
  <div class="flex min-h-screen overflow-hidden">
    <!-- Left Side (Form) -->
    <div class="w-full flex flex-col justify-center items-center bg-white px-4 overflow-hidden">
      <div class="bg-white p-8 rounded-lg shadow-lg w-full max-w-md mt-4 mx-4 sm:mx-0 md:px-10">
        <h3 class="text-center text-xl leading-9 tracking-tight text-black">Masuk</h3>
        <p class="text-center text-xs font-medium leading-9 text-gray-500">
          Silahkan Masukkan Nomor WhatsApp dan PIN Anda
        </p>

        <n-form
          class="mt-6"
          @submit.prevent="handleSubmit"
          ref="formRef"
          :model="formData"
          :rules="rules"
        >
          <!-- Email -->
          <div>
            <div class="flex items-center justify-between"></div>
            <div class="mt-2 w-full">
              <n-form-item label="Nomor WhatsApp" path="phone">
                <n-input
                  class="w-full"
                  name="Nomor whatsapp"
                  v-model:value="formData.phone"
                  placeholder="Masukkan Nomor WhatsApp Akun Anda"
                  required
                />
              </n-form-item>
            </div>
          </div>

          <!-- Password -->
          <div>
            <div class="flex items-center justify-between"></div>
            <div class="mt-2 w-full">
              <n-form-item label="PIN" path="pin">
                <n-input
                  class="w-full"
                  name="PIN"
                  :type="isPinVisible ? 'text' : 'password'"
                  v-model:value="formData.pin"
                  autocomplete="current-password"
                  placeholder="Masukkan PIN"
                  required
                />
                <button
                  type="button"
                  class="absolute inset-y-0 right-3 flex items-center text-gray-500"
                  @click="isPinVisible = !isPinVisible"
                >
                  <n-icon size="20">
                    <Eye v-if="!isPinVisible" />
                    <EyeOff v-else />
                  </n-icon>
                </button>
              </n-form-item>
            </div>
          </div>

          <!-- Button and Lupa Password Container -->
          <div class="flex justify-between items-center mt-4">
            <RouterLink
              to="/auth/forgot-password"
              class="font-semibold text-blue-600 hover:text-blue-500"
            >
              Lupa kata sandi?
            </RouterLink>
            <n-button :loading="isPending" attr-type="submit" type="primary" size="medium">
              Masuk
            </n-button>
          </div>

          <div class="flex justify-center items-center mt-4">
            <p>
              Belum punya akun?
              <RouterLink
                to="/auth/registration-form"
                class="font-semibold text-blue-600 hover:text-blue-500"
              >
                Daftar
              </RouterLink>
            </p>
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
