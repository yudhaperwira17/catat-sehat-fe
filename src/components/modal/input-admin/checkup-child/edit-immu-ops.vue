<script setup lang="ts">
import { API } from '@/composable/http/api-constant'
import router from '@/router'
import {
    useAdminPutImmunizationOptional,
    useAdminReadImmunizationOptionalById
} from '@/services/admin-immunization'
import { useQueryClient } from '@tanstack/vue-query'
import { useMessage, type FormInst } from 'naive-ui'
import { computed, ref, watchEffect } from 'vue'

const props = defineProps<{
  id: string
}>()

const { data: checkupChild } = useAdminReadImmunizationOptionalById(computed(() => props.id))
const { mutate, isPending } = useAdminPutImmunizationOptional(computed(() => props.id))
const emit = defineEmits<{
  close: []
}>()

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
const queryClient = useQueryClient()
const childName = ref('')

const submitForm = () => {
  formRef.value?.validate((errors) => {
    console.log(errors)
    if (!errors) {
      mutate(
        {
          ...formData.value
        },
        {
          onSuccess: () => {
            queryClient.invalidateQueries({
              queryKey: [API.ADMIN_GET_OPTIONAL_IMMUNIZATION]
            })
            emit('close')
            router.push('/admin/immunization-optional')
          },

          onError: () => {
            message.error('Update Data gagal')
          }
        }
      )

      return
    }
    message.error('Validasi gagal')
  })
}

watchEffect(() => {
  if (checkupChild.value) {
    formData.value.childrenId = checkupChild.value.children.id
    childName.value = checkupChild.value.children.name
    formData.value.name = checkupChild.value.name
    formData.value.dateGiven = checkupChild.value.dateGiven
    formData.value.note = checkupChild.value.note
  }
})
</script>

<template>
  <div class="flex items-center justify-center bg-gray-100">
    <div class="bg-white rounded-lg shadow-lg p-6 w-full max-w-lg">
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-lg font-semibold">Pemeriksaan Bayi</h2>
       
      </div>
      <n-form
        class="space-y-2 mt-4"
        @submit.prevent="submitForm"
        ref="formRef"
        :model="formData"
      >
        <n-form-item label="Nama Anak" path="childrenId">
          <div class="w-full">
            <n-input :value="childName" readonly />
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
<route lang="yaml">
meta:
  layout: blank
</route>
