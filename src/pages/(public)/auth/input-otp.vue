<script setup lang="ts">
import InputOtp from '@/components/ui/input/otp.vue';
import { useUserOTPVerification, useUserResendOTP } from '@/services/auth-user'; // Assuming OTP verification API service
import { ref } from 'vue';





const otp = ref<string>('') // OTP data
const resendAvailable = ref(false) // Control resend button visibility

const { mutate: resendMutate } = useUserResendOTP()

const { mutate } = useUserOTPVerification()

// Handle OTP form submission
const handleSubmit = () => {
  mutate({ otp: otp.value })
}

// Handle OTP resend logic
const resendOtp = () => {
  resendMutate(
    {},
    {
      onSuccess: () => {
        resendAvailable.value = false
      }
    }
  )
}

const onCountdownFinish = () => {
  resendAvailable.value = true
}
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
              <InputOtp :length="6" v-model:value="otp" />
            </div>

            <div>
              <p class="text-center font-medium leading-4 text-gray-900">
                Belum Menerima kode OTP?
                <span v-if="!resendAvailable">
                  <n-countdown
                    :duration="300000"
                    :active="true"
                    @finish="onCountdownFinish"
                    v-slot="{ time }"
                    class="text-pink-500"
                  >
                    {{ time.minutes }} menit {{ time.seconds }} detik
                  </n-countdown>
                </span>
                <span v-else>
                  <a
                    href="#"
                    class="text-pink-500 hover:text-pink-600 font-semibold underline cursor-pointer"
                    @click.prevent="resendOtp"
                  >
                    Kirim ulang
                  </a>
                </span>
              </p>
            </div>

            <div class="mt-6 text-center">
              <n-button type="primary" @click="handleSubmit">Konfirmasi</n-button>
            </div>
          </n-form>
        </div>
      </div>
    </div>

    <!-- Right Side (Image) -->
  </div>
</template>

<route lang="yaml">
meta:
  layout: blank
  requiresAuth: true
</route>