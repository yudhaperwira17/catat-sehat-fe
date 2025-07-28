<script setup lang="ts">
import Detail from '@/components/modal/input-admin/Detail-Blood.vue';
import { API } from '@/composable/http/api-constant';
import { useAdminDeleteCheckupMother } from '@/services/admin-bloodRecord';
import { useQueryClient } from '@tanstack/vue-query';
import { ref } from 'vue';
import EditBlood from '../modal/input-admin/Edit-Blood.vue';


const props = defineProps<{
  id: string
  isAdmin?: boolean
}>()

const detailBlood = ref(false)
const editBlood = ref(false)
const queryClient = useQueryClient()

const { mutate } = useAdminDeleteCheckupMother(props.id)

const handleDelete = async (id: any) => {
  const confirmDelete = confirm('Apakah kamu yakin ingin menghapus data ini?')
  if (!confirmDelete) return
  try {
    mutate(id, {
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: [API.ADMIN_GET_BLOOD_SUPLEMENT]
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
    detailBlood.value = true 
  } else if (key === 'edit') {
    editBlood.value = true 
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
    key: 'edit',
    show: props.isAdmin === true
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

    <n-modal v-model:show="editBlood" :on-after-leave="() => (editBlood = false)">
    <EditBlood :id="props.id" @close="editBlood = false" />
  </n-modal>

    <n-modal v-model:show="detailBlood" :on-after-leave="() => (detailBlood = false)">
      <Detail :id="props.id" @close="detailBlood = false" />
    </n-modal>
  </template>