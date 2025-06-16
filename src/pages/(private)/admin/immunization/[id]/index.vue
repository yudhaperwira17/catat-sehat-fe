<script setup lang="ts">
import { adminCheckupChildByCode } from '@/services/admin-child'
import { useAdminPostImmunizations } from '@/services/admin-immunization'
import { NButton, NCard, NForm, NFormItem, NInput, NTag, useMessage } from 'naive-ui'
import { computed, ref, watch, watchEffect } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const { data: children, isError } = adminCheckupChildByCode(
  computed(() => route.params.id as string)
)
const childrenId = computed(() => children?.value?.id)
const { mutate: createImmunizations } = useAdminPostImmunizations()
const router = useRouter()

watchEffect(() => {
  if (isError.value) {
    console.log(isError.value)
    router.push('/404')
  }
})
interface Vaccine {
  id: string
  name: string
  suggestedAge: string
  vaccineId: string
  createdAt: string
  updatedAt: string
}
type FormData = {
  childrenId?: string
  vaccineStage?: {
    label: string
    value: string
    suggestedAge: string
  }
  dateGiven?: number
  note?: string
}
type EmitSubmit = {
  vaccineStageId?: Vaccine
  childrenId?: string
  dateGiven?: number
  note?: string
}
const formData = ref({
  motherName: '',
  childName: ''
})

const inputImmunization = ref(false)
const submittedData = ref<FormData[]>([])
const message = useMessage()

//edit delete
const editModalVisible = ref(false)
const editData = ref<FormData | undefined>(undefined)

const handleDropdownSelect = (index: number) => (key: string) => {
  console.log('Dropdown selected:')
  if (key === 'edit') {
    editData.value = { ...submittedData.value[index] }
    selectedId.value = index.toString() // Simpan indeks sebagai string
    editModalVisible.value = true
  } else if (key === 'delete') {
    submittedData.value.splice(index, 1)
    message.success('Data berhasil dihapus.')
  }
}
const selectedId = ref<string>('')

const handleEditSubmit = (updatedData: FormData) => {
  const index = parseInt(selectedId.value, 10)
  console.log(index)
  if (index !== -1) {
    submittedData.value[index] = updatedData
    message.success('Data berhasil diperbarui.')
    editModalVisible.value = false
  } else {
    message.error('Data tidak ditemukan.')
  }
}

//submit handle
const handleSubmit = () => {
  if (!childrenId.value || submittedData.value.length === 0) {
    message.error('Pastikan semua data telah diisi.')
    return
  }

  const payload = {
    childrenId: childrenId.value,
    immunizations: submittedData.value.map(({ vaccineStage, dateGiven, note }) => ({
      vaccineStageId: vaccineStage?.value,
      dateGiven,
      note
    }))
  }

  createImmunizations(payload, {
    onSuccess: () => {
      message.success('Imunisasi Anak berhasil ditambahkan')
      submittedData.value = []
    }
  })
}
//show mother and child
const updateFormData = () => {
  if (children.value) {
    formData.value.motherName = children.value.mother?.name || ''
    formData.value.childName = children.value.name || ''
  }
}

// Watch the data from API and update formData
watch(
  () => children.value,
  (newValue) => {
    if (newValue) updateFormData()
  },
  { immediate: true }
)
</script>

<template>
  <div class="flex items-center justify-center min-h-screen bg-gray-100">
    <!-- <div class="flex justify-center items-center  bg-gray-100"> -->
    <!-- Card Utama -->
    <NCard class="w-[606px] rounded-lg shadow-md p-6 bg-white">
      <!-- Content -->
      <!-- <NCard class="rounded-lg shadow-md p-6  max-w-md"> -->
      <div class="bg-white flex flex-col items-center space-y-4">
        <!-- Image Logo -->
        <img src="@/assets/images/LOGO.png" alt="Catat Sehat Logo" class="w-10 h-auto" />

        <!-- Title Text -->
        <h2 class="text-xl font-bold">Catat Sehat</h2>
        <p class="text-gray-700 font-medium text-center">Penambahan Data Imunisasi</p>
        <p class="text-gray-500 text-sm text-center pb-6">
          Silahkan mengisikan data pada form di bawah ini
        </p>

        <!-- Form -->
        <NForm class="mt-6 w-full flex flex-row gap-4" ref="formRef">
          <!-- Nama Ibu -->
          <NFormItem label="Nama Ibu" class="flex-1">
            <NInput
              placeholder="Masukan Nama Ibu"
              v-model:value="formData.motherName"
              readonly
              required
            />
          </NFormItem>

          <!-- Nama Anak -->
          <NFormItem label="Nama Anak" class="flex-1">
            <NInput
              placeholder="Masukan Nama Anak"
              v-model:value="formData.childName"
              readonly
              required
            />
          </NFormItem>
        </NForm>

        <!-- Horizontal Line -->
        <hr class="border-t border-gray-300 w-full mt-4" />
      </div>

      <div class="flex flex-row justify-between pt-4">
        <p>Daftar Vaksin</p>
        <span role="button" class="text-[#1678F2]" @click="inputImmunization = true"
          >+ Tambah Daftar Vaksin</span
        >
      </div>
      <n-modal v-model:show="inputImmunization" @close="inputImmunization = false">
        <modal-input-admin-immunization-add
          @submit="(data: EmitSubmit) => submittedData.push(data)"
          :childrenId="childrenId"
          @close="inputImmunization = false"
        />
      </n-modal>

      <!-- Daftar Vaksin -->
      <div>
        <div v-if="submittedData.length === 0" class="text-center mt-6 text-gray-900">
          <img src="/public/EmptyState.png" class="mx-auto w-48 mt-4" alt="empty-state" />
          <p class="text-base font-medium">Tidak ada vaksin</p>
          <p class="tex-sm font-normal">Anda Belum Menambahkan Jenis Vaksin</p>
        </div>
        <div v-else class="mt-4 rounded-lg drop-shadow-md grid md:grid-cols-2 gap-4">
          <div v-for="(item, index) in submittedData" :key="index">
            <n-card class="bg-white mx-2 shadow-md rounded-lg my-6">
              <div class="flex flex-row justify-between my-3">
                <div class="flex flex-row rounded-lg px-2">
                  <!-- <p class="text-xs font-bold">Jenis Vaksin</p> -->
                  <NTag>Vaksin {{ index + 1 }}</NTag>
                </div>
                <div class="flex flex-row gap-2">
                  <n-dropdown
                    trigger="click"
                    :options="[
                      { label: 'Edit', key: 'edit' },
                      { label: 'Hapus', key: 'delete' }
                    ]"
                    @select="
                      (e: string | number) => {
                        handleDropdownSelect(index)(e.toString())
                      }
                    "
                  >
                    <div class="rounded-lg px-2 item flex items-center cursor-pointer">
                      <i-mage:dots />
                    </div>
                  </n-dropdown>
                </div>
                <n-modal v-model:show="editModalVisible">
                  <modal-input-admin-immunization-edit-data
                    :childrenId="childrenId"
                    :data="editData"
                    @submit="handleEditSubmit"
                    @close="editModalVisible = false"
                  />
                </n-modal>
              </div>
              <hr />
              <div class="flex flex-col my-2">
                <div class="flex flex-col justify-between space-y-3 my-3">
                  <div class="flex flex-col flex-1">
                    <p class="text-xs font-bold">Jenis Vaksin</p>
                    <p class="text-xs font-normal">{{ item.vaccineStage?.label }}</p>
                  </div>
                  <div class="flex flex-col flex-1">
                    <p class="text-xs font-bold">Usia Yang Dianjurkan</p>
                    <p class="text-xs font-normal">{{ item.vaccineStage?.suggestedAge }}</p>
                  </div>
                  <div class="flex flex-col flex-1">
                    <p class="text-xs font-bold">Tanggal Pemberian Vaksin</p>
                    <p class="text-xs font-normal">Bulan {{ item.dateGiven }}</p>
                  </div>
                  <div class="flex flex-col flex-1">
                    <p class="text-xs font-bold">Catatan</p>
                    <p class="text-xs font-normal">{{ item.note || '-' }}</p>
                  </div>
                </div>
              </div>
            </n-card>
          </div>
        </div>
      </div>
      <NButton type="primary" class="w-full mt-4" @click="handleSubmit">Kirim </NButton>
    </NCard>
  </div>
</template>
<route lang="yaml">
meta:
  layout: blank
</route>
