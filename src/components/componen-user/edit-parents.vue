<script setup lang="ts">
import EditParent from '@/components/modal/input-user/edit-parent.vue';
import QR from '@/components/modal/input-user/qr-mother.vue';
import { API } from '@/composable/http/api-constant';
import { useUserDeleteParent } from '@/services/parents';
import { useQueryClient } from '@tanstack/vue-query';
import { ref } from 'vue';


const props = defineProps<{
  id: string
}>()

// Opsi dropdown
const options = [
  {
    label: 'Ubah Data',
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
const editParent = ref(false)
const showQrModal = ref(false)

const { mutate } = useUserDeleteParent(props.id)

// Fungsi untuk menangani pilihan opsi
const handleOptionClick = (key: string) => {
  if (key === 'editProfile') {
    editParent.value = true // Buka modal edit profil
  } else if (key === 'qrPemeriksaan') {
    showQrModal.value = true // Buka modal QR Pemeriksaan
  } else if (key === 'delete') {
    handleDelete(props.id) // Panggil fungsi delete
  }
}

const handleDelete = async (id: string) => {
  const confirmDelete = confirm('Apakah kamu yakin ingin menghapus data ini?')
  if (!confirmDelete) return
  try {
    mutate(id, {
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: [API.USER_GET_PARENT]
        })
        alert('Data orang tua berhasil dihapus.')
      }
    })
  } catch (error) {
    console.error('Error menghapus data:', error)
    alert('Terjadi kesalahan saat menghapus data orang tua.')
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
  <n-modal v-model:show="editParent" :on-after-leave="() => (editParent = false)">
    <EditParent :id="props.id" @close="editParent = false" />
  </n-modal>

  <!-- Modal untuk QR Pemeriksaan -->
  <n-modal v-model:show="showQrModal" :on-after-leave="() => (showQrModal = false)">
    <QR :id="props.id" @close="showQrModal = false" />
  </n-modal>
</template>
