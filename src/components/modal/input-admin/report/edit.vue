<script setup lang="ts">
import { useAdminPutReport } from '@/services/admin-report'
import { useQueryClient } from '@tanstack/vue-query'
import { useMessage } from 'naive-ui'
import { computed } from 'vue'

const props = defineProps<{
  id: string
}>()

const emit = defineEmits<{
  close: []
}>()

const message = useMessage()
const queryClient = useQueryClient()

// Gunakan mutation untuk update status
const { mutate, isPending } = useAdminPutReport(computed(() => props.id))

const submitForm = async () => {
  try {
    // Kirim request dengan body { "status": "RESOLVED" }
    mutate(
      { status: "RESOLVED" },
      {
        onSuccess: () => {
          message.success('Laporan berhasil ditindaklanjuti!')
          
          // Invalidate queries untuk refresh data
          queryClient.invalidateQueries({ 
            queryKey: ['admin-reports'] // sesuaikan dengan query key yang digunakan
          })
          
          emit('close')
        },
        onError: (error) => {
          console.error('Error updating report:', error)
          message.error('Gagal memperbarui status laporan. Silakan coba lagi.')
        }
      }
    )
  } catch (error) {
    console.error('Submit form error:', error)
    message.error('Terjadi kesalahan. Silakan coba lagi.')
  }
}
</script>

<template>
  <NCard title="Tindak Lanjuti Laporan">
    <div class="mb-4">
      <p class="text-gray-700">Apakah laporan sudah ditindaklanjuti?</p>
    </div>
    
    <div class="flex justify-end gap-3">
      <NButton 
        type="tertiary" 
        @click="$emit('close')"
        :disabled="isPending"
      >
        Belum
      </NButton>
      
      <NButton 
        type="primary" 
        :loading="isPending" 
        @click="submitForm"
      >
        Sudah
      </NButton>
    </div>
  </NCard>
</template>

<route lang="yaml">
meta:
  layout: blank
</route>