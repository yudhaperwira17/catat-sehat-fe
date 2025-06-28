<script setup lang="ts">
import EditData from '@/components/modal/input-admin/report/edit.vue';
import Detail from '@/components/modal/input-admin/report/modal-detail.vue';

import { API } from '@/composable/http/api-constant';
import { useAdminDeleteReport } from '@/services/admin-report';
import { useQueryClient } from '@tanstack/vue-query';
import { ref } from 'vue';

const props = defineProps<{
  id: string
}>()

console.log(props.id)

const detailCheckupChild = ref(false)
const editCheckupChild = ref(false)
const queryClient = useQueryClient()



const { mutate } = useAdminDeleteReport(props.id)

const handleDelete = async (id: any) => {
  const confirmDelete = confirm('Apakah kamu yakin ingin menghapus data ini?')
  if (!confirmDelete) return
  try {
    mutate(id, {
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: [API.ADMIN_GET_REPORT_STUNTING]
        })
        alert('Data kesehatan anak berhasil dihapus.')
      }
    })
  } catch (error) {
    console.error('Error menghapus data:', error)
    alert('Terjadi kesalahan saat menghapus data kesehatan ibu.')
  }
}

const handleOptionClick = (key: string) => {
  if (key === 'detail') {
    detailCheckupChild.value = true 
  } else if (key === 'edit') {
    editCheckupChild.value = true 
  } else if (key === 'delete') {
    handleDelete(props.id) 
  }
}

const options = [
  {
    label: 'Detail',
    key: 'detail'
  },
  {
    label: 'Tindak Lanjut',
    key: 'edit'
  },
  {
    label: 'Hapus',
    key: 'delete'
  }
]
</script>
<template>
    <n-dropdown :options="options" @select="handleOptionClick">
      <n-button>
        <i-mage:dots></i-mage:dots>
      </n-button>
    </n-dropdown>

    <n-modal v-model:show="editCheckupChild" :on-after-leave="() => (editCheckupChild = false)">
    <EditData :id="props.id" @close="editCheckupChild = false" />
  </n-modal>

    <n-modal v-model:show="detailCheckupChild" :on-after-leave="() => (detailCheckupChild = false)">
      <Detail :id="props.id" @close="detailCheckupChild = false" />
    </n-modal>
  </template>