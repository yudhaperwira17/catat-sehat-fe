<script setup lang="ts">
import { API } from '@/composable/http/api-constant'
import { useUserDeleteChild } from '@/services/child'
import { useQueryClient } from '@tanstack/vue-query'
import { ref } from 'vue'

const props = defineProps<{
  id: string
  onRefetch: () => void
}>()

// Opsi dropdown
const options = [
  {
    label: 'Ubah Profil',
    key: 'editProfile'
  },
  {
    label: 'QR Pemeriksaan',
    key: 'qrPemeriksaan'
  },
  {
    label: 'Hapus',
    key: 'delete'
  }
]

const queryClient = useQueryClient()

// Reactive references untuk kontrol modal
const editProfilChild = ref(false)
const showQrModal = ref(false)

const { mutate } = useUserDeleteChild(props.id)

// Fungsi untuk menangani pilihan opsi
const handleOptionClick = (key: string) => {
  if (key === 'editProfile') {
    editProfilChild.value = true // Buka modal edit profil
  } else if (key === 'qrPemeriksaan') {
    showQrModal.value = true // Buka modal QR Pemeriksaan
  } else if (key === 'delete') {
    handleDelete(props.id) // Panggil fungsi delete
  }
}

// Fungsi untuk menghapus data anak
const handleDelete = async (id: any) => {
  const confirmDelete = confirm('Apakah kamu yakin ingin menghapus data ini?')
  if (!confirmDelete) return
  try {
    mutate(id, {
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: [API.USER_GET_CHILD]
        })
      }
    })
    alert('Data anak berhasil dihapus.')
  } catch (error) {
    console.error('Error menghapus data:', error)
    alert('Terjadi kesalahan saat menghapus data anak.')
  }
}
</script>

<template>
  <n-dropdown :options="options" @select="handleOptionClick">
    <n-button>
      <i-mage:dots></i-mage:dots>
    </n-button>
  </n-dropdown>

  <!-- Modal untuk Edit Profil -->
  <n-modal v-model:show="editProfilChild" :on-after-leave="() => (editProfilChild = false)">
    <modal-input-user-edit-data-child :id="props.id" @close="editProfilChild = false" />
  </n-modal>

  <!-- Modal untuk QR Pemeriksaan -->
  <n-modal v-model:show="showQrModal" :on-after-leave="() => (showQrModal = false)">
    <modal-input-user-modal-qr-child :id="props.id" @close="showQrModal = false" />
  </n-modal>
</template>
