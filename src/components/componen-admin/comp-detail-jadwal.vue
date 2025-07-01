<script setup lang="ts">
import Detail from '@/components/modal/input-admin/Detail-Schedule.vue'
import EditData from '@/components/modal/input-admin/Edit-Schedule.vue'
import { API } from '@/composable/http/api-constant'
import { useAdminDeleteSchedule } from '@/services/admin-schedule'
import { useQueryClient } from '@tanstack/vue-query'
import { ref } from 'vue'

const props = defineProps<{
  id: string
}>()

const detailSchedule = ref(false)
const editSchedule = ref(false)
const queryClient = useQueryClient()

const { mutate } = useAdminDeleteSchedule(props.id)

const handleDelete = async (id: any) => {
  const confirmDelete = confirm('Apakah kamu yakin ingin menghapus data ini?')
  if (!confirmDelete) return
  try {
    mutate(id, {
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: [API.ADMIN_GET_SCHEDULE]
        })
        alert('Data posyandu dihapus.')
      }
    })
  } catch (error) {
    console.error('Error menghapus data:', error)
    alert('Terjadi kesalahan saat menghapus data kesehatan ibu.')
  }
}

const handleOptionClick = (key: string) => {
  if (key === 'detail') {
    detailSchedule.value = true
  } else if (key === 'edit') {
    editSchedule.value = true
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
</script>

<template>
  <n-dropdown :options="options" @select="handleOptionClick" trigger="click">
    <n-button>
      <i-mage:dots></i-mage:dots>
    </n-button>
  </n-dropdown>
  <n-modal v-model:show="editSchedule" :on-after-leave="() => (editSchedule = false)">
    <EditData :id="props.id" @close="editSchedule = false" />
  </n-modal>

  <n-modal v-model:show="detailSchedule" :on-after-leave="() => (detailSchedule = false)">
    <Detail :id="$props.id" @close="detailSchedule = false" />
  </n-modal>
</template>
