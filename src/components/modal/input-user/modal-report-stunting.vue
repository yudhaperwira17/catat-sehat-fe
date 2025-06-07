<script setup lang="ts">
import { API } from '@/composable/http/api-constant'
import router from '@/router'
import { useUserReportStunting } from '@/services/report-stunting'
import { useQueryClient } from '@tanstack/vue-query'
import { useMessage, type FormInst, type FormRules, type UploadFileInfo } from 'naive-ui'
import { ref } from 'vue'

// Definisikan tipe untuk form data

const { mutate, isPending } = useUserReportStunting()
// Deklarasi ref dengan tipe FormData
type FormData = {
  reporter?: string
  phoneNumber?: string
  childName?: string
  childAddress?: string
  fileChildPicture?: string
  fileHousePicture?: string
  observation?: string
  gender?: 'MALE' | 'FEMALE'
}
const formData = ref<FormData>({
  reporter: undefined,
  phoneNumber: undefined,
  childName: undefined,
  childAddress: undefined,
  fileChildPicture: undefined,
  fileHousePicture: undefined,
  observation: undefined,
  gender: undefined
})

const formRef = ref<FormInst>()
const message = useMessage()
const queryClient = useQueryClient()
const emits = defineEmits(['close'])

const rules: FormRules = {
  reporter: [{ type: 'string', required: true, message: 'Pelapor wajib diisi' }],
  phoneNumber: [
    { type: 'string', required: true, message: 'Nomor wajib diisi' },
    { min: 10, message: 'Nomor telepon harus berisi minimal 10 karakter', trigger: 'blur' },
    { max: 13, message: 'Nomor telepon harus berisi maksimal 13 karakter', trigger: 'blur' },
    {
      pattern: /^[0-9]+$/,
      message: 'Nomor telepon harus berupa nomor yang valid',
      trigger: 'blur'
    }
  ],
  childName: [{ type: 'string', required: true, message: 'Nama Anak wajib diisi' }],
  childAddress: [{ type: 'string', required: true, message: 'Alamat Anak wajib diisi' }],
  fileChildPicture: [{ type: 'string', required: true, message: 'Foto Anak wajib diisi' }],
  fileHousePicture: [{ type: 'string', required: true, message: 'Foto Rumah wajib diisi' }],
  observation: [{ type: 'string', required: true, message: 'Observasi wajib diisi' }],
  gender: [
    { type: 'string', required: true, enum: ['MALE', 'FEMALE'], message: 'gender wajib diisi' }
  ]
}

const options: { label: string; value: string }[] = [
  {
    label: 'Laki-Laki',
    value: 'MALE'
  },
  {
    label: 'Perempuan',
    value: 'FEMALE'
  }
]

// Fungsi untuk mengirimkan formulir
const handleSubmit = () => {
  formRef.value?.validate((errors) => {
    if (!errors) {
      mutate(formData.value, {
        onSuccess: () => {
          router.push('/user/report-stunting')
          queryClient.invalidateQueries({
            queryKey: [API.USER_POST_REPORT_STUNTING]
          })
          emits('close')
        }
      })

      return
    }
    message.error('Validasi gagal')
  })
}
// Fungsi untuk kembali
const isModalOpen = ref<boolean>(true)

const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = (error) => reject(error)
    reader.readAsDataURL(file)
  })
}

// Tidak perlu mengembalikan nilai dalam script setup, karena semua ini otomatis tersedia di template
</script>

<template>
  <div v-if="isModalOpen" class="flex items-center justify-center mx-auto my-8 md:h-[80%]">
    <div
      class="bg-white fixed p-6 rounded-lg shadow-lg mx-4 md:w-full md:max-w-2xl h-auto md:h-[80%] overflow-y-auto max-h-screen"
    >
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-xl font-semibold">Laporkan Stunting</h2>
      </div>
      <n-form
        class="space-y-6 mt-4"
        @submit.prevent="handleSubmit"
        ref="formRef"
        :model="formData"
        :rules="rules"
      >
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <n-form-item label="Nama Pelapor" path="reporter">
              <n-input
                v-model:value="formData.reporter"
                type="text"
                placeholder="Masukkan Nama Pelapor"
              />
            </n-form-item>
          </div>
          <div>
            <n-form-item label="No Telepon" path="phoneNumber">
              <n-input
                v-model:value="formData.phoneNumber"
                type="text"
                placeholder="Masukkan No Telepon"
              />
            </n-form-item>
          </div>
        </div>
        <div class="mb-4">
          <n-form-item label="Nama Anak" path="childName">
            <n-input
              v-model:value="formData.childName"
              type="text"
              placeholder="Masukkan Nama Anak"
            />
          </n-form-item>
        </div>
        <div class="mb-4 w-full">
          <n-form-item label="Pilih Jenis Kelamin" path="gender">
            <div class="w-full">
              <n-space vertical>
                <n-select
                  v-model:value="formData.gender"
                  placeholder="Pilih Jenis Kelamin"
                  :options="options"
                />
              </n-space>
            </div>
          </n-form-item>
        </div>
        <div class="mb-4">
          <n-form-item label="Alamat Anak" path="childAddress">
            <n-input
              v-model:value="formData.childAddress"
              type="text"
              placeholder="Masukkan Alamat Anak"
            />
          </n-form-item>
        </div>
        <div class="mb-4">
          <n-form-item label="Observasi" path="observation">
            <n-input
              v-model:value="formData.observation"
              type="textarea"
              placeholder="Masukkan Hasil Observasi Anak"
            />
          </n-form-item>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div
            class="border-2 border-dashed border-gray-300 rounded-md p-4 flex flex-col items-center justify-center"
          >
            <n-form-item label="Foto Anak" path="fileChildPicture">
              <n-upload
                @update-file-list="
                  (options: Required<UploadFileInfo>[]) => {
                    // file to base64
                    const file = options[0]?.file
                    fileToBase64(file as File).then((result) => {
                      formData.fileChildPicture = result
                    })
                  }
                "
              >
                <n-upload-dragger>
                  <div style="margin-bottom: 12px">
                    <n-icon size="48" :depth="3">
                      <ArchiveIcon />
                    </n-icon>
                  </div>
                  <n-text style="font-size: 16px">
                    Klik atau tarik file ke area ini untuk diunggah
                  </n-text>
                  <n-p depth="3" style="margin: 8px 0 0 0">
                    File : .jpg, .png, .gif, .heic, .heif, .pdf
                    <br />
                    Ukuran maksimal : 10mb
                  </n-p>
                </n-upload-dragger>
              </n-upload>
            </n-form-item>
          </div>
          <div
            class="border-2 border-dashed border-gray-300 rounded-md p-4 flex flex-col items-center justify-center"
          >
            <n-form-item label="Foto Rumah" path="fileHousePicture">
              <n-upload
                @update-file-list="
                  (options: Required<UploadFileInfo>[]) => {
                    // file to base64
                    const file = options[0]?.file
                    fileToBase64(file as File).then((result) => {
                      formData.fileHousePicture = result
                    })
                  }
                "
              >
                <n-upload-dragger>
                  <div style="margin-bottom: 12px">
                    <n-icon size="48" :depth="3">
                      <ArchiveIcon />
                    </n-icon>
                  </div>
                  <n-text style="font-size: 16px">
                    Klik atau tarik file ke area ini untuk diunggah
                  </n-text>

                  <n-p depth="3" style="margin: 8px 0 0 0">
                    File : .jpg, .png, .gif, .heic, .heif, .pdf
                    <br />
                    Ukuran maksimal : 10mb
                  </n-p>
                </n-upload-dragger>
              </n-upload>
            </n-form-item>
          </div>
        </div>
        <div class="flex justify-end space-x-4">
          <n-button
            type="tertiary"
            @click="emits('close')"
            class="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
          >
            Kembali
          </n-button>
          <n-button
            type="primary"
            :loading="isPending"
            attr-type="submit"
            class="px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700"
          >
            Submit
          </n-button>
        </div>
      </n-form>
    </div>
  </div>
</template>

<style scoped>
/* Add any custom styling here if needed */
</style>
