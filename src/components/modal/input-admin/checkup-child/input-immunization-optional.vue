<script setup lang="ts">
import { API } from '@/composable/http/api-constant'
import { adminCheckupChildByCode } from '@/services/admin-child'
import { useAdminPostImmunizationsOptional } from '@/services/admin-immunization'
import { useQueryClient } from '@tanstack/vue-query'
import { useMessage, type FormInst } from 'naive-ui'
import { computed, ref, watchEffect } from 'vue'

const queryClient = useQueryClient()
const props = defineProps<{
  code: string
}>()

const { mutate, isPending } = useAdminPostImmunizationsOptional()
const { data: child } = adminCheckupChildByCode(computed(() => props.code))

type FormData = {
  childrenId?: string
  name?: string
  dateGiven?: number
  note?: string
  
}

const formData = ref<FormData>({
  childrenId: undefined,
  name: undefined,
  dateGiven: undefined,
  note: undefined,
})
const formRef = ref<FormInst>()
const message = useMessage()
const emit = defineEmits(['close'])
const displayName = computed(() => child.value?.name ?? '')

// Menambahkan watchEffect untuk memantau perubahan pada setiap field
watchEffect(() => {
  if (child.value) {
    console.log(child.value)
    formData.value.childrenId = child?.value?.id
  }
})

const handleSubmit = () => {
  formRef.value?.validate((errors) => {
    if (!errors) {
      mutate(
        {
          ...formData.value
        },
        {
          onSuccess: () => {
            // Panggil queryClient untuk invalidasi atau refetch data
            queryClient.invalidateQueries({
              queryKey: [API.ADMIN_GET_OPTIONAL_IMMUNIZATION]
            })
            emit('close')
          },
          onError: (error) => {
            console.error('Error:', error)
            message.error('Gagal memproses data.')
          }
        }
      )
      return
    }
    message.error('Validasi gagal')
  })
}

// const rules: FormRules = {
//   height: [{ type: 'number', required: true, message: 'Tinggi badan wajib diisi' }],
//   weight: [{ type: 'number', required: true, message: 'Berat badan wajib diisi' }],
//   headCircumference: [{ type: 'number', required: true, message: 'Lingkar kepala wajib diisi' }],
//   fileDiagnosed: [{ type: 'string', required: false, message: 'File wajib diisi' }],
//   childrenId: [{ type: 'string', required: true, message: 'Anak wajib diisi' }]
// }

const closeForm = () => {
  alert('Form closed')
  // Implement form closing logic if needed
}


// const options = ref([
//   {
//     label: 'Laki-laki',
//     value: 'MALE'
//   },
//   {
//     label: 'Perempuan',
//     value: 'FEMALE'
//   }
// ])
</script>

<template>
  <div class="flex items-center justify-center bg-gray-100">
    <div class="bg-white rounded-lg shadow-lg p-6 w-full max-w-lg">
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-lg font-semibold">Pemeriksaan Bayi</h2>
        <button class="text-gray-500" @click="closeForm">
          <i class="fas fa-times"></i>
        </button>
      </div>
      <n-form
        class="space-y-2 mt-4"
        @submit.prevent="handleSubmit"
        ref="formRef"
        :model="formData"
      >
        <n-form-item label="Nama Anak" path="childrenId">
          <div class="w-full">
            <n-input :value="displayName" readonly />
          </div>
        </n-form-item>
        <n-form-item label="Nama Vaksin" path="childrenId">
          <div class="w-full">
            <n-input v-model:value="formData.name" />
          </div>
        </n-form-item>

        <!-- <n-form-item label="Jenis Kelamin" path="gender">
          <div class="w-full">
            <n-select
              v-model:value="formData.gender"
              :options="options"
              placeholder="Pilih Jenis Kelamin"
            />
          </div>
        </n-form-item> -->

          <n-form-item label="Umur" path="height">
            <div>
              <n-input-number v-model:value="formData.dateGiven" placeholder="Input Umur" />
            </div>
          </n-form-item>
            <n-form-item label="Catatan" path="childrenId">
          <div class="w-full">
            <n-input v-model:value="formData.note" />
          </div>
        </n-form-item>
        
        
        <div class="flex justify-end space-x-2">
          <n-button type="tertiary" @click="$emit('close')">Kembali</n-button>
          <n-button type="primary" :loading="isPending" attr-type="submit"
            >Simpan Perubahan</n-button
          >
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
