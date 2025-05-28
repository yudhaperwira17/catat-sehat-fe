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
    <div
      class="w-full md:w-1/2 flex flex-col justify-center items-center bg-white px-4 overflow-hidden"
    >
      <div class="bg-white p-2 w-full max-w-md flex justify-center items-center space-x-4">
        <!-- SVG Logo (hidden on desktop) -->
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="39"
          height="36"
          viewBox="0 0 39 36"
          fill="none"
          class="md:hidden"
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
        <h2 class="text-xl font-bold md:hidden">Stunting</h2>
      </div>
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
            <n-button :loading="isPending" attr-type="submit" type="primary" size="medium">
              Masuk
            </n-button>

            <RouterLink
              to="/auth/forgot-password"
              class="font-semibold text-pink-600 hover:text-pink-500"
            >
              Lupa kata sandi?
            </RouterLink>
          </div>

          <div class="flex justify-center items-center mt-4">
            <p>
              Belum punya akun?
              <RouterLink
                to="/auth/registration-form"
                class="font-semibold text-pink-600 hover:text-pink-500"
              >
                Daftar
              </RouterLink>
            </p>
          </div>
        </n-form>
      </div>
    </div>

    <!-- Right Side (Image) -->
    <div class="w-1/2 md:w-[80%] hidden md:flex flex-col overflow-y-auto h-full">
      <div class="w-full h-full min-h-screen">
        <div class="overflow-y-auto h-[100vh]">
          <div class="flex justify-center items-center mt-8">
            <div
              class="mt-8 mx-2 h-24 relative mb-4 bg-pink-500 rounded-lg shadow-md flex items-center md:h-52 gap-y-6"
            >
              <!-- Tulisan "Kesehatan Gigi" -->
              <h2
                class="absolute ml-4 mt-0 md:left-5 md:top-1/2 md:transform md:-translate-y-1/2 text-sm text-white md:text-5xl font-semibold z-10"
              >
                Kesehatan Gigi
              </h2>

              <p
                class="absolute ml-4 mt-6 text-xs md:left-5 md:top-3/4 md:transform md:-translate-y-1/2 text-white md:text-xl font-medium z-10 md:mt-0"
              >
                Mulai dari dini
              </p>

              <!-- Gambar Banner -->

            </div>

            <!-- Memindahkan div bg merah di bawah carousel -->
          </div>
          <div class="mt-22 mx-2 rounded-lg">
            <div class="w-full hidden md:flex">
              <div class="w-full">
                <div>
                  <div class="flex justify-between items-center mb-2 w-full">
                    <h2
                      class="pl-2 text-base font-medium text-black pb-4"
                      style="padding-top: 10px"
                    >
                      Artikel Kesehatan
                    </h2>
                  </div>
                  <div class="grid grid-cols-3 gap-4 mb-4 w-full">
                    <!-- Card 1 -->
                  </div>
                </div>
              </div>
            </div>
          </div>
          <!-- tabel posyandu -->
        </div>
      </div>
    </div>
  </div>
</template>

<route lang="yaml">
meta:
  layout: blank
</route>
