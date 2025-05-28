<script setup lang="ts">
import { useUserSignup } from '@/services/auth-user'
import { Eye, EyeOff } from '@vicons/ionicons5'
import { useMessage, type FormInst, type FormRules } from 'naive-ui'
import { ref } from 'vue'

const { mutate, isPending } = useUserSignup()

type FormData = {
  // email?: string
  name?: string
  phone?: string
  // password?: string
  // confirmPassword?: string
  pin?: string
  confirmPin?: string
}

const formData = ref<FormData>({
  // email: undefined,
  name: undefined,
  phone: undefined,
  // password: undefined,
  // confirmPassword: undefined
  pin: undefined,
  confirmPin: undefined
})

const formRef = ref<FormInst>()
const message = useMessage()
const isPasswordVisible = ref(false)
const isConfirmPasswordVisible = ref(false)

const handleSubmit = () => {
  formRef.value?.validate((errors) => {
    if (!errors) {
      mutate({
        ...formData.value
      })

      return
    }
    message.error('validasi gagal')
  })
}

const rules: FormRules = {
  // email: [
  //   {
  //     type: 'email',
  //     message: 'Email tidak valid'
  //   },
  //   {
  //     type: 'string',
  //     required: true,
  //     message: 'Email wajib diisi'
  //   }
  // ],
  name: [
    {
      type: 'string',
      required: true,
      message: 'Nama lengkap wajib diisi'
    }
  ],
  phone: [
    {
      type: 'string',
      required: true,
      message: 'Nomor Telpon Wajib diisi',
      min: 10
    },
    {
      type: 'string',
      required: true,
      message: 'Nomor Telpon telah digunakan'
    }
  ],
  // password: [
  //   {
  //     type: 'string',
  //     required: true,
  //     message: 'Password wajib diisi'
  //   }
  // ],
  // confirmPassword: [
  //   {
  //     type: 'string',
  //     required: true,
  //     message: 'Password wajib diisi'
  //   }
  // ]
  pin: [
    {
      type: 'string',
      required: true,
      message: 'Pin wajib diisi'
    },
    {
      type: 'string',
      required: true,
      len: 6,
      message: 'Pin wajib 6 digit'
    }
  ],
  confirmPin: [
    {
      type: 'string',
      required: true,
      message: 'Pin wajib diisi'
    },
    {
      type: 'string',
      required: true,
      len: 6,
      message: 'Pin wajib 6 digit'
    }
  ]
}
</script>

<template>
  <div class="flex flex-col md:flex-row min-h-screen justify-center items-center">
    <!-- Left Side (Form) -->
    <div class="w-full md:w-1/2 flex flex-col justify-center items-center">
      <!-- Logo Div -->
      <div class="bg-white p-2 w-full max-w-md">
        <div class="flex md:hidden items-center justify-center space-x-4">
          <!-- SVG Logo -->
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="39"
            height="36"
            viewBox="0 0 39 36"
            fill="none"
          >
            <path
              d="M19.4954 1.00529C18.1978 0.0395943 16.5666 -0.246903 15.0174 0.217748L4.53846 3.36137C2.37968 4.0094 0.928406 5.95839 0.928406 8.21314V30.6102C0.928406 32.2275 1.67242 33.7085 2.96992 34.6727C4.26766 35.6385 5.90066 35.9249 7.44802 35.4603L15.2706 33.1129C15.026 32.3061 14.9021 31.4642 14.9021 30.6102V20.4387C14.9021 18.3027 15.681 16.2628 17.0991 14.6979C18.14 13.5451 19.4902 12.6947 20.9991 12.2406L21.537 12.087V5.06941C21.537 3.45211 20.793 1.9711 19.4953 1.00529H19.4954Z"
              fill="#E74694"
            />
            <path
              d="M39.0021 17.2951V27.4666C39.0021 29.7197 37.5525 31.6705 35.3921 32.3167L24.9131 35.4605C24.4276 35.6071 23.9334 35.6788 23.4444 35.6788C22.3736 35.6788 21.3258 35.3366 20.435 34.6728C20.028 34.369 19.6753 34.0179 19.3853 33.625C19.0326 33.1534 18.7688 32.6277 18.6029 32.0636C18.6011 32.0636 18.5995 32.0636 18.5977 32.0652L18.6011 32.0618C18.4668 31.5989 18.3934 31.1117 18.3934 30.6104V20.4388C18.3934 19.3944 18.7042 18.4147 19.2527 17.6008C19.8011 16.7868 20.587 16.1372 21.5371 15.7512C21.6891 15.6901 21.8445 15.634 22.0035 15.5871L23.2855 15.2028L32.4826 12.4433C34.0317 11.9787 35.663 12.2652 36.9606 13.231C38.2583 14.1968 39.0022 15.6778 39.0022 17.2951H39.0021Z"
              fill="#E74694"
            />
          </svg>

          <!-- Title Text -->
          <h2 class="text-xl font-bold">Stunting</h2>
        </div>
      </div>

      <!-- Daftar Div -->
      <div class="bg-white p-4 rounded-lg shadow-lg w-full max-w-md mt-4">
        <h3 class="text-center text-xl leading-9 tracking-tight text-black">Daftar</h3>
        <p class="text-center text-xs font-medium leading-9 text-gray-500">
          Silahkan Masukkan Data Diri Anda
        </p>

        <n-form
          class="space-y-4 mt-4"
          @submit.prevent="handleSubmit"
          ref="formRef"
          :model="formData"
          :rules="rules"
        >
          <!-- Flex container for Nama Lengkap and Password -->
          <div class="flex flex-col md:flex-row gap-4">
            <!-- Nama Lengkap -->
            <div class="w-full">
              <div class="">
                <n-form-item label="Nama lengkap" path="name">
                  <n-input
                    v-model:value="formData.name"
                    placeholder="Masukkan Nama Lengkap"
                    name="name"
                  />
                </n-form-item>
              </div>
            </div>
          </div>

          <!-- Flex container for Email and Confirm Password -->
          <div class="flex flex-col md:flex-row gap-4">
            <!-- Number WA -->
            <div class="w-full">
              <div class="flex items-center justify-between"></div>
              <div class="">
                <n-form-item label="Nomor WhatsApp" path="phone">
                  <n-input
                    v-model:value="formData.phone"
                    placeholder="Masukkan Nomor WhatsApp"
                    name="phone"
                  />
                </n-form-item>
              </div>
            </div>
            <!-- Password -->
            <!-- <div class="w-full md:w-1/2">
              <div class="mt-2">
                <n-form-item label="Kata Sandi" path="password">
                  <n-input
                    v-model:value="formData.password"
                    placeholder="Masukkan Kata Sandi"
                    name="password"
                    type="password"
                    required
                  />
                </n-form-item>
              </div>
            </div> -->

            <!-- Confirm Password -->
            <!-- <div class="w-full md:w-1/2">
              <div class="mt-2">
                <n-form-item label="Konfirmasi Kata Sandi" path="confirmPassword">
                  <n-input
                    v-model:value="formData.confirmPassword"
                    placeholder="Konfirmasi Kata Sandi"
                    name="confirmpassword"
                    type="password"
                    required
                  />
                </n-form-item>
              </div>
            </div> -->
          </div>

          <!-- PIN -->
          <div class="flex flex-col md:flex-row gap-4">
            <div class="w-full md:w-1/2">
              <div class="">
                <n-form-item label="PIN" path="pin">
                  <n-input
                    v-model:value="formData.pin"
                    placeholder="Masukkan PIN"
                    name="pin"
                    :type="isPasswordVisible ? 'text' : 'password'"
                    required
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
                </n-form-item>
              </div>
            </div>

            <div class="w-full md:w-1/2">
              <div class="">
                <n-form-item label="Konfirmasi PIN" path="pin">
                  <n-input
                    v-model:value="formData.confirmPin"
                    placeholder="Konfirmasi PIN"
                    name="pin"
                    :type="isConfirmPasswordVisible ? 'text' : 'password'"
                    required
                  />
                  <button
                    type="button"
                    class="absolute inset-y-0 right-3 flex items-center text-gray-500"
                    @click="isConfirmPasswordVisible = !isConfirmPasswordVisible"
                  >
                    <n-icon size="20">
                      <Eye v-if="!isConfirmPasswordVisible" />
                      <EyeOff v-else />
                    </n-icon>
                  </button>
                </n-form-item>
              </div>
            </div>
          </div>
          <!-- Submit Button -->
          <div>
            <div class="flex justify-center">
              <n-button :loading="isPending" type="primary" attr-type="submit"> Daftar </n-button>
            </div>
          </div>

          <!-- Login -->
          <div class="flex justify-center items-center">
            <span class="font-semibold text-gray-900">Sudah punya akun? </span>
            <RouterLink
              to="/auth/user-login"
              class="font-semibold text-pink-600 hover:text-pink-500"
            >
              Masuk
            </RouterLink>
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
