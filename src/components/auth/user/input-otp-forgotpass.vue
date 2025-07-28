<script setup lang="ts">
import { useUserOTPForgotPassword, useUserResendOTPForgotPassword } from '@/services/auth-user'; // Assuming OTP verification API service
import { Eye, EyeOff } from '@vicons/ionicons5';
import { useMessage } from 'naive-ui';
import { ref } from 'vue';

const message = useMessage()
const { mutate } = useUserOTPForgotPassword()
const { mutate: resendMutate } = useUserResendOTPForgotPassword()
const resendAvailable = ref(false) // Control resend button visibility

const otp = defineModel('otp', { type: String, required: true })

defineEmits<{
  (e: 'submission'): void
}>()

type FormData = {
  otp: string
  phone: string
  newPin: string
  confirmPin: string
}

const formData = ref<FormData>({
  phone: '',
  otp: '',
  newPin: '',
  confirmPin: ''
})
const isSubmitted = ref(false)
const isPinVisible = ref(false)
const isPinConfirmVisible = ref(false)
// Handle OTP form submission
const handleSubmit = () => {
  if ((formData.value.otp as string).length == 6) {
    mutate({
      otp: formData.value.otp,
      phone: props.phone,
      newPin: formData.value.newPin,
      confirmPin: formData.value.confirmPin
    })
    isSubmitted.value = true
  } else {
    message.error('Masukkan 6 kode OTP yang telah dikirim.')
  }
}

// Handle OTP resend logic
const resendOtp = () => {
  resendMutate(
    { phone: props.phone },
    {
      onSuccess: () => {
        resendAvailable.value = false
      }
    }
  )
  // Logic to resend OTP here
}

const onCountdownFinish = () => {
  resendAvailable.value = true
}
const props = defineProps<{
  phone?: string
}>()
</script>

<template>
  <div class="flex min-h-screen">
    <!-- Left Side (Form) -->
    <div class="w-full md:w-1/2 flex justify-center items-center bg-white p-4">
      <div class="bg-white p-2 w-full max-w-md flex flex-col items-center space-y-6 mb-6">
        <div class="flex items-center space-x-2 mb-4">
          <!-- Logo and Title -->
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="39"
            height="36"
            viewBox="0 0 39 36"
            fill="none"
            class="md:hidden"
          >
            <!-- SVG Path omitted for brevity -->
          </svg>
          <h2 class="text-xl font-bold md:hidden">Stunting</h2>
        </div>

        <div class="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
          <h2 class="text-center text-2xl font-bold leading-9 tracking-tight text-gray-900 mb-4">
            Masukkan Kode OTP
          </h2>
          <p class="text-center font-medium leading-9 text-gray-900 mb-4">
            Masukkan kode OTP yang telah dikirim ke WhatsApp.
          </p>

          <n-form class="space-y-6 mt-10" @submit.prevent="handleSubmit">
            <!-- Input OTP -->
            <div class="flex items-center justify-center space-x-2">
              <ui-input-otp :length="6" v-model:value="formData.otp" />
            </div>
            <div>
              <p class="text-center font-medium leading-4 text-gray-900">
                Belum Menerima kode OTP?
                <span v-if="!resendAvailable">
                  <n-countdown
                    :duration="60000"
                    :active="true"
                    @finish="onCountdownFinish"
                    v-slot="{ time }"
                    class="text-pink-500"
                  >
                    {{ time.seconds }} detik
                  </n-countdown>
                </span>
                <span v-else>
                  <a
                    href="#"
                    class="text-pink-500 hover:text-pink-600 font-semibold cursor-pointer"
                    @click.prevent="resendOtp"
                  >
                    <span class="underline"> Kirim ulang</span>
                  </a>
                </span>
              </p>
            </div>
            <div>
              <div v-if="formData.otp.length == 6">
                <!-- Password Baru -->
                <div class="flex items-center justify-between">
                  <label for="Password" class="block text-sm font-medium leading-6 text-gray-900">
                    Pin Baru
                  </label>
                </div>
                <n-form-item path="PasswordBaru">
                  <div class="w-full">
                    <n-input
                      id="Password"
                      name="PasswordBaru"
                      :type="isPinVisible ? 'text' : 'password'"
                      autocomplete="new-password"
                      required
                      class="block w-full rounded-md border-0 py-1.5 pl-7 pr-20 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-pink-600 sm:text-sm sm:leading-6"
                      v-model:value="formData.newPin"
                      placeholder="Masukkan Kata Sandi Baru"
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
                  </div>
                </n-form-item>
                <!-- Konfirmasi Password -->
                <div class="flex items-center justify-between mt-4">
                  <label
                    for="KonfirmasiPassword"
                    class="block text-sm font-medium leading-6 text-gray-900"
                  >
                    Konfirmasi Pin
                  </label>
                </div>
                <n-form-item path="KonfirmasiPassword">
                  <div class="w-full">
                    <n-input
                      id="KonfirmasiPassword"
                      name="KonfirmasiPassword"
                      :type="isPinConfirmVisible ? 'text' : 'password'"
                      autocomplete="new-password"
                      required
                      class="block w-full rounded-md border-0 py-1.5 pl-7 pr-20 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-pink-600 sm:text-sm sm:leading-6"
                      v-model:value="formData.confirmPin"
                      placeholder="konfirmasi Kata Sandi"
                    />
                    <button
                      type="button"
                      class="absolute inset-y-0 right-3 flex items-center text-gray-500"
                      @click="isPinConfirmVisible = !isPinConfirmVisible"
                    >
                      <n-icon size="20">
                        <Eye v-if="!isPinConfirmVisible" />
                        <EyeOff v-else />
                      </n-icon>
                    </button>
                  </div>
                </n-form-item>
              </div>
            </div>
            <!-- <div v-if="formData.otp.length == 6">
              <auth-user-new-password 
              v-model:data="formData" 
              :phone="formData.phone" 
              :otp="formData.otp" 
              :newPin="formData.newPin" 
              :confirmPin="formData.confirmPin"
              @submission="$emit('submission')" />
            </div> -->
            <div class="mt-6 text-center">
              <n-button type="primary" @click="handleSubmit">Konfirmasi</n-button>
            </div>
          </n-form>
          <!-- component input password -->
          <!-- ketika otp length == 6 -->
        </div>
      </div>
    </div>
    <!-- Right Side (Image) -->
    
  </div>
</template>

<route lang="yaml">
meta:
  layout: blank
</route>
