<script setup lang="ts">
import {
  useCreateLungQuestion,
  useDeleteLungQuestion,
  useLungQuestionList,
  useUpdateLungQuestion,
  type Question
} from '@/services/lung'
import {
  useCreateLungConclusion,
  useDeleteLungConclusion,
  useLungConclusionList,
  useUpdateLungConclusion,
  type LungConclusion
} from '@/services/lung-conclusion'
import { Search } from '@vicons/ionicons5'
import type { DataTableColumns, FormInst, FormRules } from 'naive-ui'
import { NButton, NDataTable, NIcon, NInput, NPagination, useMessage } from 'naive-ui'
import { computed, h, ref } from 'vue'

const pageSize = 3
const message = useMessage()

const paramsQuestion = ref({
  page: 1,
  limit: 10,
  search: ''
})
const { data, isLoading, refetch } = useLungQuestionList(paramsQuestion)

const questionColumns: DataTableColumns<Question> = [
  {
    title: 'No',
    key: 'id',
    width: 60,
    align: 'center',
    render: (_row, index) => index + 1
  },
  {
    title: 'Pertanyaan',
    key: 'question',
    width: 200,
    ellipsis: {
      tooltip: true
    }
  },
  {
    title: 'Keterangan',
    key: 'description',
    width: 280,
    ellipsis: {
      tooltip: true
    }
  },
  {
    title: 'Aksi',
    key: 'aksi',
    width: 150,
    align: 'center',
    titleAlign: 'center',
    render(_row) {
      return h(
        'div',
        {
          class: 'flex gap-2 justify-center',
          style: 'width: 100%'
        },
        [
          h(
            NButton,
            {
              type: 'primary',
              size: 'small',
              style: {
                backgroundColor: '#0F5BC0',
                borderColor: '#0F5BC0',
                fontSize: '13px'
              },
              onClick: () => {
                showCreate.value = true
                formData.value = { ..._row }
              }
            },
            { default: () => 'Ubah' }
          ),
          h(
            NButton,
            {
              onClick: () => {
                handleDelete(_row.id)
              },
              type: 'error',
              size: 'small',
              style: {
                fontSize: '13px',
                backgroundColor: '#FF0000',
                borderColor: '#FF0000'
              }
            },
            { default: () => 'Hapus' }
          )
        ]
      )
    }
  }
]

const paramsConclusion = ref({
  page: 1,
  limit: 10,
  search: ''
})
const {
  data: conclusions,
  isLoading: isLoadingConclusions,
  refetch: refetchConclusions
} = useLungConclusionList(paramsConclusion)

// delete fn
const selectedId = ref<string>()

const { mutate: onDelete } = useDeleteLungQuestion(selectedId as Ref<string>)
const handleDelete = (id: string) => {
  selectedId.value = id
  onDelete(
    {},
    {
      onSuccess: () => {
        message.success('Data pertanyaan berhasil dihapus')
        refetch()
      },
      onError: () => {
        message.error('Gagal menghapus data pertanyaan')
      }
    }
  )
}

// create fn
const { mutate, isPending } = useCreateLungQuestion()
const { mutate: onUpdate } = useUpdateLungQuestion(computed(() => formData.value.id) as Ref<string>)
const formRef = ref<FormInst>()
const showCreate = ref(false)
const formData = ref<Partial<Question>>({
  question: undefined,
  description: undefined
})
const rules: FormRules = {
  question: [
    {
      required: true,
      message: 'Pertanyaan harus diisi',
      trigger: ['blur', 'input']
    }
  ],
  description: [
    {
      required: true,
      message: 'Deskripsi harus diisi',
      trigger: ['blur', 'input']
    }
  ]
}
const handleSubmit = () => {
  formRef.value?.validate((errors) => {
    if (!errors || errors.length === 0) {
      if (formData.value.id) {
        onUpdate(formData.value, {
          onSuccess: () => {
            message.success('Data pertanyaan berhasil diubah')
            refetch()
            showCreate.value = false
          },
          onError: () => {
            message.error('Gagal mengubah data pertanyaan')
          }
        })
      } else {
        mutate(formData.value, {
          onSuccess: () => {
            message.success('Data pertanyaan berhasil disimpan')
            refetch()
            showCreate.value = false
          },
          onError: () => {
            message.error('Gagal menyimpan data pertanyaan')
          }
        })
      }
    } else {
      message.error('Semua field wajib diisi')
    }
  })
}

// create conclusion fn
const formRefConclusion = ref<FormInst>()
const formDataConclusion = ref<Partial<LungConclusion>>({})
const { mutate: mutateConclusion, isPending: isPendingConclusion } = useCreateLungConclusion()
const { mutate: onUpdateConclusion } = useUpdateLungConclusion(
  computed(() => formDataConclusion.value?.id) as ComputedRef<string>
)
const { mutate: onDeleteConclusion } = useDeleteLungConclusion(
  computed(() => formDataConclusion.value?.id) as ComputedRef<string>
)
const showCreateConclusion = ref(false)
const rulesConclusion: FormRules = {
  value: [
    {
      type: 'number',
      required: true,
      message: 'Total Skor harus diisi',
      trigger: ['blur', 'input']
    }
  ],
  conclusion: [
    {
      required: true,
      message: 'Kesimpulan harus diisi',
      trigger: ['blur', 'input']
    }
  ],
  description: [
    {
      required: true,
      message: 'Keterangan harus diisi',
      trigger: ['blur', 'input']
    }
  ]
}

const kesimpulanColumns: DataTableColumns<LungConclusion> = [
  {
    title: 'Total Skor',
    key: 'value',
    width: 60,
    align: 'center'
  },
  {
    title: 'Kesimpulan',
    key: 'conclusion',
    width: 200,
    ellipsis: {
      tooltip: true
    }
  },
  {
    title: 'Keterangan',
    key: 'description',
    width: 280,
    ellipsis: {
      tooltip: true
    }
  },
  {
    title: 'Aksi',
    key: 'aksi',
    width: 150,
    align: 'center',
    titleAlign: 'center',
    render(row) {
      return h(
        'div',
        {
          class: 'flex gap-2 justify-center',
          style: 'width: 100%'
        },
        [
          h(
            NButton,
            {
              type: 'primary',
              size: 'small',
              style: {
                backgroundColor: '#0F5BC0',
                borderColor: '#0F5BC0',
                fontSize: '13px'
              },
              onClick: () => {
                formDataConclusion.value = { ...row }
                showCreateConclusion.value = true
              }
            },
            { default: () => 'Ubah' }
          ),
          h(
            NButton,
            {
              type: 'error',
              size: 'small',
              style: {
                fontSize: '13px',
                backgroundColor: '#FF0000',
                borderColor: '#FF0000'
              },
              onClick: () => {
                showCreateConclusion.value = false
                formDataConclusion.value = {
                  id: row.id
                }
                onDeleteConclusion(formDataConclusion.value, {
                  onSuccess: () => {
                    message.success('Data kesimpulan berhasil dihapus')
                    refetchConclusions()
                  },
                  onError: () => {
                    message.error('Gagal menghapus data kesimpulan')
                  }
                })
              }
            },
            { default: () => 'Hapus' }
          )
        ]
      )
    }
  }
]

const handleSubmitConclusion = () => {
  formRefConclusion.value?.validate((errors) => {
    if (!errors || errors.length === 0) {
      if (formDataConclusion.value.id) {
        onUpdateConclusion(formDataConclusion.value, {
          onSuccess: () => {
            message.success('Data kesimpulan berhasil diubah')
            refetchConclusions()
            showCreateConclusion.value = false
          },
          onError: () => {
            message.error('Gagal mengubah data kesimpulan')
          }
        })
        return
      }
      mutateConclusion(formDataConclusion.value, {
        onSuccess: () => {
          message.success('Data kesimpulan berhasil disimpan')
          refetchConclusions()
          showCreateConclusion.value = false
        },
        onError: () => {
          message.error('Gagal menyimpan data kesimpulan')
        }
      })
    } else {
      message.error('Semua field wajib diisi')
    }
  })
}
</script>

<template>
  <n-modal
    v-model:show="showCreate"
    preset="card"
    class="max-w-lg"
    :title="`${formData.id ? 'Ubah' : 'Tambah'} Pertanyaan`"
  >
    <div>
      <n-form ref="formRef" :model="formData" :rules="rules" @submit.prevent="handleSubmit">
        <n-form-item label="Pertanyaan" path="pertanyaan">
          <n-input v-model:value="formData.question" placeholder="Masukkan Pertanyaan" />
        </n-form-item>
        <n-form-item label="Description" path="description">
          <n-input
            v-model:value="formData.description"
            type="textarea"
            placeholder="Masukkan Deskripsi"
          />
        </n-form-item>
        <div class="flex justify-end space-x-2">
          <n-button type="tertiary" @click="$emit('close')">Kembali</n-button>
          <n-button type="primary" attr-type="submit" :loading="isPending">Simpan</n-button>
        </div>
      </n-form>
    </div>
  </n-modal>

  <n-modal
    v-model:show="showCreateConclusion"
    preset="card"
    class="max-w-lg"
    :title="`${formDataConclusion.id ? 'Ubah' : 'Tambah'} Kesimpulan`"
  >
    <div>
      <n-form
        ref="formRefConclusion"
        :model="formDataConclusion"
        :rules="rulesConclusion"
        @submit.prevent="handleSubmitConclusion"
      >
        <n-form-item label="Total Skor" path="value">
          <n-input-number
            v-model:value="formDataConclusion.value"
            placeholder="Masukkan Total Skor"
          />
        </n-form-item>
        <n-form-item label="Kesimpulan" path="conclusion">
          <n-input
            v-model:value="formDataConclusion.conclusion"
            placeholder="Masukkan Kesimpulan"
          />
        </n-form-item>
        <n-form-item label="Description" path="description">
          <n-input
            v-model:value="formDataConclusion.description"
            placeholder="Masukkan Description"
          />
        </n-form-item>
        <div class="flex justify-end space-x-2">
          <n-button type="tertiary" @click="showCreateConclusion = false">Kembali</n-button>
          <n-button type="primary" attr-type="submit" :loading="isPendingConclusion"
            >Simpan</n-button
          >
        </div>
      </n-form>
    </div>
  </n-modal>

  <div class="p-6 bg-gray-50 min-h-screen">
    <!-- Header -->
    <div class="mb-6">
      <h1 class="text-xl md:text-2xl font-semibold">Master Data</h1>
      <nav class="text-sm text-gray-500 mt-2">
        <a href="#" class="hover:underline">Dashboard</a>
        <span class="mx-1">></span>
        <span>Master Data Skrining Paru</span>
      </nav>
    </div>

    <!-- Question Table -->
    <div class="bg-white p-4 rounded-lg shadow">
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-lg font-semibold">Data Pertanyaan Skrining Paru</h2>
        <div class="flex items-center gap-2">
          <n-input
            v-model:value="paramsQuestion.search"
            placeholder="Search"
            class="w-60 search-input"
            clearable
          >
            <template #prefix>
              <n-icon :component="Search" />
            </template>
          </n-input>
          <n-button
            type="primary"
            class="tambah-btn"
            @click="
              () => {
                formData = {}
                showCreate = true
              }
            "
            >Tambah Pertanyaan</n-button
          >
        </div>
      </div>

      <n-data-table
        :columns="questionColumns"
        :data="data?.data"
        :loading="isLoading"
        :pagination="false"
        :bordered="false"
      />

      <div class="mt-4 flex justify-center">
        <n-pagination
          v-model:page="paramsQuestion.page"
          :page-size="paramsQuestion.limit"
          :item-count="data?.meta.totalData"
        />
      </div>
    </div>

    <!-- Conclusion Table -->
    <div class="bg-white p-4 rounded-lg shadow">
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-lg font-semibold">Data Kesimpulan Skrining Paru</h2>
        <div class="flex items-center gap-2">
          <n-input
            v-model:value="paramsConclusion.search"
            placeholder="Search"
            class="w-60 search-input"
            clearable
          >
            <template #prefix>
              <n-icon :component="Search" />
            </template>
          </n-input>
          <n-button
            type="primary"
            class="tambah-btn"
            @click="
              () => {
                formDataConclusion = {}
                showCreateConclusion = true
              }
            "
            >Tambah Kesimpulan</n-button
          >
        </div>
      </div>

      <n-data-table
        :columns="kesimpulanColumns"
        :data="conclusions?.data"
        :pagination="false"
        :loading="isLoadingConclusions"
        :bordered="false"
      />

      <div class="mt-4 flex justify-center">
        <n-pagination
          v-model:page="paramsConclusion.page"
          :page-size="paramsConclusion.limit"
          :item-count="conclusions?.meta.totalData"
        />
      </div>
    </div>
  </div>
</template>
<route lang="yaml">
meta:
  layout: admin
</route>

<style scoped>
:deep(.n-data-table-th) {
  background-color: #a6c9f5 !important;
  font-weight: normal;
  font-size: 14px;
  padding: 12px 16px;
}
:deep(.n-data-table-td) {
  font-size: 14px;
  padding: 12px 16px;
}
:deep(.n-data-table .n-data-table-td:first-child) {
  width: 80px;
  text-align: center;
}
:deep(.n-data-table .n-data-table-td:last-child) {
  width: 180px;
  text-align: center;
}
:deep(.n-data-table .n-data-table-th:first-child) {
  width: 80px;
  text-align: center;
}
:deep(.n-data-table .n-data-table-th:last-child) {
  width: 180px;
  text-align: center;
}
.tambah-btn {
  background-color: #0f5bc0;
  border-color: #0f5bc0;
  font-weight: 500;
}
.tambah-btn:hover {
  background-color: #0d4fa8;
}
:deep(.n-button.n-button--error-type:hover) {
  background-color: #e60000 !important;
  border-color: #e60000 !important;
}
.search-input :deep(.n-input) {
  border-radius: 8px;
}
.search-input :deep(.n-input-wrapper) {
  padding-left: 12px;
}
.search-input :deep(.n-input__prefix) {
  margin-right: 8px;
  color: #8e8e8e;
}
</style>
