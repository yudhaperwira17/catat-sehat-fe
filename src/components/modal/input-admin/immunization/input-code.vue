<script setup lang="ts">
import router from '@/router';
import { adminCheckupChildByCode, adminUpdateChildByCode } from '@/services/admin-child';
import { useMessage, type FormInst, type FormRules } from 'naive-ui';
import { computed, ref } from 'vue';



const inputCheckupChild = ref(false)
type FormData = {
  code?: string
}
const formData = ref<FormData>({
  code: undefined
})

const { mutate } = adminUpdateChildByCode(computed(() => formData.value.code as string))
const {


  isPending
} = adminCheckupChildByCode(computed(() => formData.value.code as string))

const rules: FormRules = {
  code: [{ type: 'string', required: true, message: 'Nama lengkap wajib diisi' }]
}

const formRef = ref<FormInst>()
const message = useMessage()

const handleSubmit = () => {
  console.log(formData.value)
  formRef.value?.validate((errors) => {
    console.log(errors)
    if (!errors) {
      mutate(
        {
          ...formData.value
        },
        {
          onSuccess: () => {
            // Memanggil emit untuk menutup modal setelah sukses
            inputCheckupChild.value = true
            message.success('Data berhasil disimpan')
            router.push(`/admin/immunization/${formData.value.code}`);
          },
          onError: (error) => {
            console.error('Error:', error)
            message.error('Gagal menyimpan data')
          }
        }
      )
      return
    }
    message.error('Validasi gagal')
  })
}
const closeModal = () => {
  // Logic for closing the modal
  alert('Closing modal...')
}
</script>

<template>
  <div class="flex items-center justify-center">
    <div class="bg-white rounded-lg shadow-lg p-6 w-96">
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-lg font-semibold">Input Kode Anak</h2>
        <button class="text-gray-500 hover:text-gray-700" @click="closeModal">
          <i class="fas fa-times"></i>
        </button>
      </div>
      <n-form @submit.prevent="handleSubmit" ref="formRef" :model="formData" :rules="rules">
        <div class="mb-4">
          <n-form-item path="code" label="Kode Anak">
            <n-input
              type="text"
              v-model:value="formData.code"
              class="w-full border border-gray-300 rounded-md p-2"
              placeholder="Input Kode Anak"
            />
          </n-form-item>
        </div>

        <div class="flex justify-end space-x-2">
          <n-button type="tertiary" @click="$emit('close')">Kembali</n-button>
            <n-button type="primary" :loading="isPending" attr-type="submit">Submit</n-button>       
        </div>
      </n-form>
    </div>
  </div>
</template>

<style scoped>
/* Add any additional styles here if needed */
</style>

<route lang="yaml">
meta:
  layout: blank
</route>
