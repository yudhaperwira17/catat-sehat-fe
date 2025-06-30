<script setup lang="ts">
import { CheckmarkCircle, CloseCircle } from '@vicons/ionicons5';
import { NIcon, NTag } from 'naive-ui';
import { computed } from 'vue';

const props = defineProps<{
  monitorData: {
    id: string
    question1: boolean
    question2: boolean
    question3: boolean
    question4: boolean
    question5: boolean
    question6: boolean
    question7: boolean
    question8: boolean
    question9: boolean
    question10: boolean
    question11: boolean
    question12: boolean
    question13: boolean
    status: string
    mother: {
      name: string
      dateOfBirth: string
      placeOfBirth: string
      address: string
    }
    weekPregnancyMonitoring: {
      dayNumber: number
      name: string
    }
    createdAt: string
  }
}>()

const questionLabels = {
  question1: 'Pemeriksaan Kehamilan oleh Dokter',
  question2: 'Kelas Ibu Hamil',
  question3: 'Pemenuhan Gizi Sesuai',
  question4: 'Demam Lebih dari 2 hari',
  question5: 'Pusing/Sakit Kepala Berat',
  question6: 'Sulit Tidur / Cemas Berlebihan',
  question7: 'Jantung Berdebar / Nyeri di Dada',
  question8: 'Resiko TB',
  question9: 'Gerakan Janin',
  question10: 'Nyeri Perut Hebat',
  question11: 'Keluar cairan dari jalan lahir',
  question12: 'Sakit saat kencing',
  question13: 'Diare berulang',
}

const detailQuestions = computed(() => {
  const questions = []
  for (const [key, label] of Object.entries(questionLabels)) {
    questions.push({
      label,
      value: props.monitorData[key as keyof typeof props.monitorData] as boolean,
      key
    })
  }
  return questions
})

const getStatusIcon = (value: boolean) => {
  return value ? CheckmarkCircle : CloseCircle
  
}

const getStatusColor = (value: boolean) => {
  return value ? 'error' : 'success'
}

const getStatusText = (value: boolean) => {
  return value ? 'Belum Dilakukan / Ada Gangguan' : 'Dilakukan / Tidak ada gangguan'
}
</script>

<template>
  <div class="ml-8 border-l-4 border-blue-200 pl-6">
    <!-- Header dengan informasi ibu -->
    <div class="bg-blue-50 p-4 rounded-lg mb-4">
      <div class="grid grid-cols-2 gap-4">
        <div>
          <h4 class="font-semibold text-blue-800 mb-2">Informasi Ibu</h4>
          <p><span class="font-medium">Nama:</span> {{ monitorData.mother.name }}</p>
          <p><span class="font-medium">Tempat Lahir:</span> {{ monitorData.mother.placeOfBirth }}</p>
          <p><span class="font-medium">Alamat:</span> {{ monitorData.mother.address }}</p>
        </div>
        <div>
          <h4 class="font-semibold text-blue-800 mb-2">Informasi Pemantauan</h4>
          <p><span class="font-medium">Hari:</span> {{ monitorData.weekPregnancyMonitoring.name }}</p>
          <p><span class="font-medium">Tanggal Periksa:</span> {{ new Date(monitorData.createdAt).toLocaleDateString('id-ID') }}</p>
          <p><span class="font-medium">Status:</span> 
            <n-tag 
              :type="monitorData.status === 'HEALTHY' ? 'success' : 'error'" 
              :bordered="true"
              class="ml-2"
            >
              {{ monitorData.status === 'HEALTHY' ? 'Sehat' : 'Segera Ke Faskes' }}
            </n-tag>
          </p>
        </div>
      </div>
    </div>

    <!-- Detail Pertanyaan -->
    <div class="bg-white rounded-lg border">
      <div class="font-bold p-4 bg-gray-50 border-b">Detail Pemeriksaan Nifas</div>
      
      <div class="grid grid-cols-4 bg-gray-100 font-semibold p-3 border-b overflow-auto border-gray-300 text-sm">
        <div>No</div>
        <div class="col-span-2">Pertanyaan Pemeriksaan</div>
        <div class="text-center">Status</div>
      </div>
      
      <div v-if="!detailQuestions.length" class="text-center p-4 text-gray-500">
        Tidak ada data pemeriksaan yang tersedia.
      </div>
      
      <div v-else>
        <div
          v-for="(question, index) in detailQuestions"
          :key="question.key"
          class="grid grid-cols-4 p-3 border-b border-gray-200 hover:bg-gray-50 text-sm"
        >
          <div class="font-medium text-gray-600">{{ index + 1 }}</div>
          <div class="col-span-2">{{ question.label }}</div>
          <div class="flex items-center justify-center">
            <n-tag
              :type="getStatusColor(question.value)"
              :bordered="false"
              class="flex items-center gap-1"
            >
              <n-icon :component="getStatusIcon(question.value)" :size="14" />
              {{ getStatusText(question.value) }}
            </n-tag>
          </div>
        </div>
      </div>
    </div>

    <!-- Summary -->
    <!-- <div class="mt-4 p-3 bg-gray-50 rounded-lg">
      <div class="flex justify-between items-center text-sm">
        <span class="font-medium">Total Pertanyaan:</span>
        <span>{{ detailQuestions.length }}</span>
      </div>
      <div class="flex justify-between items-center text-sm mt-1">
        <span class="font-medium">Jawaban "False":</span>
        <span class="text-green-600">{{ detailQuestions.filter(q => q.value).length }}</span>
      </div>
      <div class="flex justify-between items-center text-sm mt-1">
        <span class="font-medium">Jawaban "True":</span>
        <span class="text-red-600">{{ detailQuestions.filter(q => !q.value).length }}</span>
      </div>
    </div> -->
  </div>
</template>

<style scoped>
/* Custom styles untuk improve readability */
.grid {
  align-items: center;
}
</style>