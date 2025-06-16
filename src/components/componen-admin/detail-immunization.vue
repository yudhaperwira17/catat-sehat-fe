<script setup lang="ts">
import { API } from '@/composable/http/api-constant'
import { useAdminDeleteImmuunization } from '@/services/admin-immunization'
import { useQueryClient } from '@tanstack/vue-query'
import { ref } from 'vue'

const editImmunization = ref(false)
const queryClient = useQueryClient()

const props = defineProps<{
  id: string
  mother?: string
  children?: string
}>()
const { mutate } = useAdminDeleteImmuunization(props.id)

const handleOptionClick = (key: string) => {
  if (key === 'edit') {
    editImmunization.value = true
  } else if (key === 'delete') {
    handleDelete(props.id)
  }
}

const options = [
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
          queryKey: [API.ADMIN_GET_IMMUNIZATION]
        })
      }
    })
    alert('Data kesehatan ibu berhasil dihapus.')
  } catch (error) {
    console.error('Error menghapus data:', error)
    alert('Terjadi kesalahan saat menghapus data kesehatan ibu.')
  }
}
</script>
<template>
  <n-dropdown :options="options" @select="handleOptionClick">
    <n-button>
      <i-mage:dots></i-mage:dots>
    </n-button>
  </n-dropdown>

  <n-modal v-model:show="editImmunization" :on-after-leave="() => (editImmunization = false)">
    <modal-input-admin-immunization-edit
      :id="props.id"
      :mother="props.mother"
      :children="mother"
      @close="editImmunization = false"
    />
  </n-modal>
</template>
