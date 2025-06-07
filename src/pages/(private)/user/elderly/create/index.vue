<script setup lang="ts">
import { ref } from 'vue'
import { useMessage, type FormInst } from 'naive-ui'
import { useElderlyCreate } from '../_services/elderly'
import { DateTime } from 'luxon'
import { rules } from '../_schema/form'

const message = useMessage()
const formRef = ref<FormInst>()

class CreateElderlyData {
  name?: string
  gender?: string
  address?: string
  bloodType?: string
  dateOfBirth?: number
  placeOfBirth?: string

  constructor(data?: Partial<CreateElderlyData>) {
    Object.assign(this, data)
  }

  toJSON() {
    return {
      name: this.name,
      gender: this.gender,
      address: this.address,
      bloodType: this.bloodType,
      dateOfBirth: DateTime.fromMillis((this.dateOfBirth as number) || 0).toISO(),
      placeOfBirth: this.placeOfBirth
    }
  }
}

const formData = ref<CreateElderlyData>(new CreateElderlyData())

const { mutate, isPending } = useElderlyCreate()
const router = useRouter()

const handleSubmit = () => {
  formRef.value?.validate((errors) => {
    if (!errors) {
      mutate(formData.value, {
        onSuccess: () => {
          message.success('Data berhasil disimpan')
          router.push('/admin/elderly')
        },
        onError: () => {
          message.error('Data gagal disimpan')
        }
      })
    }
  })
}
</script>

<template>
  <div class="p-6 bg-gray-50 min-h-screen">
    <!-- Header -->
    <div class="mb-6">
      <h1 class="text-xl md:text-2xl font-semibold">Tambah Master Data</h1>
      <nav class="text-sm text-gray-500 mt-2">
        <a href="#" class="hover:underline">Dashboard</a>
        <span class="mx-1">></span>
        <span>Master Data Lansia</span>
      </nav>
    </div>
    <n-form
      ref="formRef"
      :model="formData"
      :rules="rules"
      label-placement="left"
      require-mark-placement="right-hanging"
      :show-label="false"
      :show-require-mark="false"
      @submit.prevent="handleSubmit"
    >
      <n-form-item label="Nama Lengkap" path="name">
        <n-input v-model:value="formData.name" placeholder="Masukkan Nama Lengkap" />
      </n-form-item>
      <n-form-item label="Nama Lengkap" path="placeOfBirth">
        <n-input v-model:value="formData.placeOfBirth" placeholder="Masukkan Tempat Lahir" />
      </n-form-item>
      <n-form-item label="Tanggal Lahir" path="birthDate">
        <n-date-picker
          v-model:value="formData.dateOfBirth"
          type="date"
          placeholder="Masukkan Tanggal Lahir"
        />
      </n-form-item>
      <n-form-item label="Jenis Kelamin" path="gender">
        <n-select
          v-model:value="formData.gender"
          placeholder="Masukkan Jenis Kelamin"
          :options="[
            { label: 'Laki-laki', value: 'MALE' },
            { label: 'Perempuan', value: 'FEMALE' }
          ]"
        />
      </n-form-item>
      <n-form-item label="Alamat" path="address">
        <n-input v-model:value="formData.address" type="textarea" placeholder="Masukkan Alamat" />
      </n-form-item>
      <n-form-item label="Golongan Darah" path="bloodType">
        <n-select
          v-model:value="formData.bloodType"
          placeholder="Masukkan Golongan Darah"
          :options="[
            { label: 'A', value: 'A' },
            { label: 'B', value: 'B' },
            { label: 'AB', value: 'AB' },
            { label: 'O', value: 'O' }
          ]"
        />
      </n-form-item>
      <n-form-item>
        <n-button attr-type="submit" :loading="isPending" type="primary">Simpan</n-button>
        <n-button class="ml-2" tertiary @click="$router.back()">Kembali</n-button>
      </n-form-item>
    </n-form>
  </div>
</template>
