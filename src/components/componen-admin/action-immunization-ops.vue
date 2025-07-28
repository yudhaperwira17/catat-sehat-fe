<script setup lang="ts">
import Edit from '@/components/modal/input-admin/checkup-child/edit-immu-ops.vue';
import Detail from '@/components/modal/input-admin/checkup-child/result/detail-immun-ops.vue';
import { API } from '@/composable/http/api-constant';
import { useAdminDeleteImmuunizationOptional } from '@/services/admin-immunization';
import { useQueryClient } from '@tanstack/vue-query';
import { ref } from 'vue';


const detailCheckupChild = ref(false)
const editCheckupChild = ref(false)
const queryClient = useQueryClient()



const props = defineProps<{
  id: string
}>()
const { mutate } = useAdminDeleteImmuunizationOptional(props.id)

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
    label: 'Ubah',
    key: 'edit'
  },
  {
    label: 'Hapus',
    key: 'delete'
  }
]

const handleDelete = async (id: any) => {
  const confirmDelete = confirm('Apakah kamu yakin ingin menghapus data ini?')
  if (!confirmDelete) return
  try {
    mutate(id, {
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: [API.ADMIN_GET_OPTIONAL_IMMUNIZATION]
        })
        alert('Data catatan imunisasi opsional berhasil dihapus.')
      }
    })
  } catch (error) {
    console.error('Error menghapus data:', error)
    alert('Terjadi kesalahan saat menghapus data catatan imunisasi opsional.')
  }
}
</script>




<template>
    <n-dropdown :options="options" @select="handleOptionClick">
      <n-button>
        <i-mage:dots></i-mage:dots>
      </n-button>
    </n-dropdown>

    <n-modal v-model:show="editCheckupChild" :on-after-leave="() => (editCheckupChild = false)">
    <Edit :id="props.id" @close="editCheckupChild = false" />
  </n-modal>

    <n-modal v-model:show="detailCheckupChild" :on-after-leave="() => (detailCheckupChild = false)">
      <Detail :id="props.id" @close="detailCheckupChild = false" />
    </n-modal>
  </template>