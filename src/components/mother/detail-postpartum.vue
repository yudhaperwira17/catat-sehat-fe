<script setup lang="ts">
import { useAdminReadmonitorPostPartumById } from '@/services/admin-monitor-postpartum';

const props = defineProps<{
  id: string
}>()

const { data, isLoading, isError } = useAdminReadmonitorPostPartumById(computed(() => props.id))

const detail = computed(() => data.value ?? {})

defineEmits(['close'])
</script>

<template>
  <div class="flex items-center justify-center overflow-auto bg-white rounded-lg">
    <div class="bg-white p-9  rounded-lg md:w-[540px]">
      <!-- Loading state -->
      <div v-if="isLoading" class="text-center py-8">
        <p>Loading data pantau ibu nifas...</p>
      </div>
      
      <!-- Error state -->
      <div v-else-if="isError" class="text-center py-8 text-red-500">
        Gagal memuat data.
      </div>
      
      <!-- Content - hanya render ketika data sudah ada -->
      <template v-else-if="detail">
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-lg text-center">{{ detail.mother?.name || 'Nama tidak tersedia' }}</h2>
          <i class="fas fa-times cursor-pointer" @click="$emit('close')"></i>
        </div>
        
        <div class="mb-4">
          <div class="flex justify-between mb-2">
            <span class="text-gray-700">HARI KE</span>
            <span class="text-primary">{{ detail.dayPostPartum?.name || '-' }}</span>
          </div>
          
          <div class="flex justify-between mb-2">
            <span class="text-gray-700">PEMERIKSAAN NIFAS OLEH DOKTER</span>
            <span class="text-primary">
              {{ detail.question1 === true ? 'Belum Periksa' : 'Sudah Periksa' }}
            </span>
          </div>
          
          <div class="flex justify-between mb-2">
            <span class="text-gray-700">KONSUMSI VIT A</span>
            <span class="text-primary">
              {{ detail.question2 === true ? 'Belum Konsumsi' : 'Sudah Konsumsi' }}
            </span>
          </div>
          
          <div class="flex justify-between mb-2">
            <span class="text-gray-700">KONSUMSI TABLET TAMBAH DARAH</span>
            <span class="text-primary">
              {{ detail.question3 === true ? 'Belum Konsumsi' : 'Sudah Konsumsi' }}
            </span>
          </div>
          
          <div class="flex justify-between mb-2">
            <span class="text-gray-700">PEMENUHAN GIZI SESUAI KEBUTUHAN</span>
            <span class="text-primary">
              {{ detail.question4 === true ? 'Tidak Memenuhi' : 'Memenuhi' }}
            </span>
          </div>
          
          <div class="flex justify-between mb-2">
            <span class="text-gray-700">KESEHATAN JIWA</span>
            <span class="text-primary">
              {{
                detail.question5 === true
                  ? 'Cemas, gelisah, perasaan bersalah, tidak fokus, gangguan tidur, gangguan konsentrasi'
                  : 'Tidak ada gangguan'
              }}
            </span>
          </div>
          
          <div class="flex justify-between mb-2">
            <span class="text-gray-700">DEMAM</span>
            <span class="text-primary">
              {{ detail.question6 === true ? 'Ya, suhu > 38C' : 'Tidak, suhu < 38C' }}
            </span>
          </div>
          
          <div class="flex justify-between mb-2">
            <span class="text-gray-700">SAKIT KEPALA</span>
            <span class="text-primary">{{ detail.question7 === true ? 'Ya' : 'Tidak' }}</span>
          </div>
          
          <div class="flex justify-between mb-2">
            <span class="text-gray-700">PANDANGAN KABUR</span>
            <span class="text-primary">{{ detail.question8 === true ? 'Ya' : 'Tidak' }}</span>
          </div>
          
          <div class="flex justify-between mb-2">
            <span class="text-gray-700">NYERI ULU HATI</span>
            <span class="text-primary">{{ detail.question9 === true ? 'Ya' : 'Tidak' }}</span>
          </div>
          
          <div class="flex justify-between mb-2">
            <span class="text-gray-700">JANTUNG BERDEBAR</span>
            <span class="text-primary">{{ detail.question10 === true ? 'Ya' : 'Tidak' }}</span>
          </div>
          
          <div class="flex justify-between mb-2">
            <span class="text-gray-700">KELUAR CAIRAN DARI JALAN LAHIR</span>
            <span class="text-primary">{{ detail.question11 === true ? 'Ya' : 'Tidak' }}</span>
          </div>
          
          <div class="flex justify-between mb-2">
            <span class="text-gray-700">NAFAS PENDEK DAN TERNGAH-ENGAH</span>
            <span class="text-primary">
              {{
                detail.question12 === true
                  ? 'Ya, disertai nyeri dada, nafas berat batuk lebih dari 2 minggu'
                  : 'Tidak'
              }}
            </span>
          </div>
          
          <div class="flex justify-between mb-2">
            <span class="text-gray-700">PAYUDARA</span>
            <span class="text-primary">
              {{
                detail.question13 === true
                  ? 'Bengkak kemerahan disertai nyeri, benjolan disertai nyeri, ada keluhan dalam menyusui'
                  : 'Tidak ada keluhan'
              }}
            </span>
          </div>
          
          <div class="flex justify-between mb-2">
            <span class="text-gray-700">BUANG AIR KECIL</span>
            <span class="text-primary">
              {{
                detail.question14 === true
                  ? 'Tidak Bisa BAK, sedikit tapi panas, nyeri panggul, urin keluar tanpa sadar'
                  : 'Biasa'
              }}
            </span>
          </div>
          
          <div class="flex justify-between mb-2">
            <span class="text-gray-700">AREA SEKITAR KELAMIN</span>
            <span class="text-primary">
              {{
                detail.question15 === true
                  ? 'Bengkak atau nyeri ada luka terbuka'
                  : 'Tidak ada bengkak atau nyeri'
              }}
            </span>
          </div>
          
          <div class="flex justify-between mb-2">
            <span class="text-gray-700">DARAH NIFAS</span>
            <span class="text-primary">
              {{
                detail.question16 === true
                  ? 'Berbau atau mengalir atau ada nyeri bawah perut'
                  : 'Tidak berbau'
              }}
            </span>
          </div>
          
          <div class="flex justify-between mb-2">
            <span class="text-gray-700">PENDARAHAN</span>
            <span class="text-primary">
              {{
                detail.question17 === true
                  ? 'Lebih dari 1 pembalut basah dalam 5 menit'
                  : 'Kurang dari 1 pembalut basah dalam 5 menit'
              }}
            </span>
          </div>
          
          <div class="flex justify-between mb-2">
            <span class="text-gray-700">KEPUTIHAN</span>
            <span class="text-primary">
              {{
                detail.question18 === true
                  ? 'Cairan berlebih, berwarna dan berbau'
                  : 'Tidak ada atau sedikit, tidak berwarna dan tidak berbau'
              }}
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