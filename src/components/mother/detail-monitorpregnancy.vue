<script setup lang="ts">
import { useAdminReadMonitorPreganancyById } from '@/services/admin-monitor-pregnancy';

const props = defineProps<{
  id: string
}>()

const { data, isLoading, isError } = useAdminReadMonitorPreganancyById(computed(() => props.id))

const detail = computed(() => data.value ?? {})

defineEmits(['close'])
</script>

<template>
  <div class="flex items-center justify-center overflow-auto bg-white rounded-lg">
    <div class="bg-white p-9 rounded-lg md:w-[540px]">
      <!-- Loading state -->
      <div v-if="isLoading" class="text-center py-8">
        <p>Loading data pantau ibu hamil...</p>
      </div>

      <!-- Error state -->
      <div v-else-if="isError" class="text-center py-8 text-red-500">Gagal memuat data.</div>

      <!-- Content - hanya render ketika data sudah ada -->
      <template v-else-if="detail">
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-lg text-center">{{ detail.mother?.name || 'Nama tidak tersedia' }}</h2>
          <i class="fas fa-times cursor-pointer" @click="$emit('close')"></i>
        </div>

        <div class="mb-4">
          <div class="flex justify-between mb-2">
            <span class="text-gray-700">MINGGU KE</span>
            <span class="text-primary">{{ detail.dayPostPartum?.name || '-' }}</span>
          </div>

          <div class="flex justify-between mb-2">
            <span class="text-gray-700">PEMERIKSAAN KEHAMILAN OLEH DOKTER</span>
            <span class="text-primary">
              {{ detail.question1 === true ? 'Tidak Periksa' : 'Sudah Periksa' }}
            </span>
          </div>

          <div class="flex justify-between mb-2">
            <span class="text-gray-700">KELAS IBU HAMIL</span>
            <span class="text-primary">
              {{ detail.question2 === true ? 'Tidak Mengikuti' : 'Mengikuti' }}
            </span>
          </div>

          <div class="flex justify-between mb-2">
            <span class="text-gray-700">PEMENUHAN GIZI SESUAI KEBUTUHAN</span>
            <span class="text-primary">
              {{ detail.question3 === true ? 'Tidak Memenuhi' : 'Memenuhi' }}
            </span>
          </div>

          <div class="flex justify-between mb-2">
            <span class="text-gray-700">DEMAM LEBIH DARI 2 HARI</span>
            <span class="text-primary">
              {{ detail.question4 === true ? 'Ada' : 'Tidak ada' }}
            </span>
          </div>

          <div class="flex justify-between mb-2">
            <span class="text-gray-700">PUSING / SAKIT KEPALA BERAT</span>
            <span class="text-primary">
              {{ detail.question5 === true ? 'Ada' : 'Tidak ada' }}
            </span>
          </div>

          <div class="flex justify-between mb-2">
            <span class="text-gray-700">SULIT TIDUR/CEMAS BERLEBIH</span>
            <span class="text-primary">
              {{ detail.question6 === true ? 'Ada' : 'Tidak ada' }}
            </span>
          </div>

          <div class="flex justify-between mb-2">
            <span class="text-gray-700">JANTUNG BERDEBAR / NYERI DI DADA</span>
            <span class="text-primary">{{ detail.question7 === true ? 'Ada' : 'Tidak ada' }}</span>
          </div>

          <div class="flex justify-between mb-2">
            <span class="text-gray-700">RISIKO TB</span>
            <span class="text-primary text-right">{{
              detail.question8 === true
                ? 'Batuk lebih dari 2 minggu atau kontak serumah dengan penderita Tb'
                : 'Tidak ada Batuk lebih dari 2 minggu atau kontak serumah dengan penderita Tb'
            }}</span>
          </div>

          <div class="flex justify-between mb-2">
            <span class="text-gray-700">GERAKAN JANIN</span>
            <span class="text-primary">{{
              detail.question9 === true
                ? 'Tidak ada atau < 10 kali dalam 12 jam'
                : '> 10 kali dalam 12 jam'
            }}</span>
          </div>

          <div class="flex justify-between mb-2">
            <span class="text-gray-700">NYERI PERUT HEBAT</span>
            <span class="text-primary">{{ detail.question10 === true ? 'Ada' : 'Tidak ada' }}</span>
          </div>

          <div class="flex justify-between mb-2">
            <span class="text-gray-700">KELUAR CAIRAN DARI JALAN LAHIR</span>
            <span class="text-primary text-right">{{
              detail.question11 === true
                ? 'Sangat banyak atau berbau'
                : 'Tidak ada/ ada dalam jumlah sedikit dan tidak berbau'
            }}</span>
          </div>

          <div class="flex justify-between mb-2">
            <span class="text-gray-700">SAKIT SAAT KENCING</span>
            <span class="text-primary">
              {{
                detail.question12 === true
                  ? 'Sakit saat kencing atau keluar keputihan atau gatal di daerah kemaluan'
                  : 'Tidak ada'
              }}
            </span>
          </div>

          <div class="flex justify-between mb-2">
            <span class="text-gray-700">DIARE BERULANG</span>
            <span class="text-primary">
              {{ detail.question13 === true ? 'ada' : 'Tidak ada' }}
            </span>
          </div>

          <div class="flex justify-between mb-2">
            <span class="text-gray-700">STATUS</span>
            <span class="text-primary">
              {{ detail.status === 'UNHEALTY' ? 'Segera ke faskes' : 'Sehat' }}
            </span>
          </div>
          <hr class="my-6" />

          <div class="flex justify-end space-x-4">
            <n-button type="primary" @click="$emit('close')">Kembali</n-button>
          </div>
        </div>
      </template>

      <!-- Fallback jika tidak ada data -->
      <div v-else class="text-center py-8">
        <p>Data tidak tersedia</p>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
