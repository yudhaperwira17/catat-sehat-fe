<script setup lang="ts">
import { defineEmits, defineProps, nextTick, onMounted, ref, watch } from 'vue';

const props = defineProps<{
  length: number
  value: string
}>()
const emit = defineEmits<{ (e: 'update:value', value: string): void }>()

const otpLength = 6
const otp = ref<string[]>(Array(otpLength).fill(''))
const otpRefs = ref<(HTMLInputElement | null)[]>([])

// Watch for prop changes and update `otp` array
watch(
  () => props.value,
  (newValue) => {
    otp.value = newValue.split('')
  }
)

// Emit updated OTP as a single string
const emitOtp = () => {
  emit('update:value', otp.value.join(''))
}

const moveToNext = async (index: number) => {
  if (otp.value[index] && index < otpLength - 1) {
    await nextTick() // Ensure DOM is updated
    otpRefs.value[index + 1]?.focus()
    emitOtp()
  }
}

const moveToPrev = async (index: number) => {
  if (index > 0 && !otp.value[index]) {
    await nextTick() // Ensure DOM is updated
    otpRefs.value[index - 1]?.focus()
    emitOtp()
  }
}
// Set focus on the first input when component mounts
onMounted(() => {
  otpRefs.value[0]?.focus()
})
</script>
<template>
  <div class="flex gap-4">
    <n-input
      v-for="( index) in otpLength"
      :key="index"
      type="text"
      maxlength="1"
      v-model:value="otp[index]"
      @input="moveToNext(index)"
      @keydown.backspace="moveToPrev(index)"
      ref="otpRefs"
      class="h-16 flex justify-center items-center text-center"
      placeholder=""
      @change="emitOtp()"
    />
  </div>
</template>
