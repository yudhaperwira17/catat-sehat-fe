<script setup lang="ts">
import { ref } from 'vue';
import { NModal, NButton } from 'naive-ui';
import { Icon } from '@iconify/vue';
import { computed } from 'vue';

const modalVisible = computed({
  get: () => props.show,
  set: (value) => emit('update:show', value)
});

const props = defineProps({
  show: {
    type: Boolean,
    default: false
  },
  checkupData: {
    type: Object,
    required: true,
    default: () => ({})
  }
});

const emit = defineEmits(['update:show']);

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('id-ID', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

const handleClose = () => {
  emit('update:show', false);
};
</script>

<template>
  <n-modal
    v-model:show="modalVisible"
    preset="card"
    style="max-width: 400px"
    :mask-closable="false"
    :bordered="false"
    class="rounded-lg"
  >
    <template #header>
      <div class="flex justify-between items-center">
        <div class="text-lg font-semibold">Detail Pemeriksaan</div>
        <n-button quaternary circle @click="handleClose">
          ✕
        </n-button>
      </div>
    </template>

    <div class="space-y-4" v-if="checkupData">
      <div class="text-center">
        <h3 class="text-lg font-semibold">Pemeriksaan {{ formatDate(checkupData.date) }}</h3>
      </div>

      <div class="space-y-3">
        <div class="flex justify-between items-center">
          <span class="text-gray-600">Umur</span>
          <span>{{ checkupData.age }} Tahun</span>
        </div>
        <div class="flex justify-between items-center">
          <span class="text-gray-600">Jenis Kelamin</span>
          <span>{{ checkupData.gender }}</span>
        </div>
        <div class="flex justify-between items-center">
          <span class="text-gray-600">Tinggi Badan</span>
          <span>{{ checkupData.height }} cm</span>
        </div>
        <div class="flex justify-between items-center">
          <span class="text-gray-600">Berat Badan</span>
          <span>{{ checkupData.weight }} kg</span>
        </div>
        <div class="flex justify-between items-center">
          <span class="text-gray-600">Indeks Massa Tubuh</span>
          <span :class="{
            'px-2 py-1 text-sm rounded': true,
            'bg-green-100 text-green-600': checkupData.bmiStatus === 'Normal',
            'bg-yellow-100 text-yellow-600': checkupData.bmiStatus === 'Obesitas',
            'bg-red-100 text-red-600': checkupData.bmiStatus === 'Stunting'
          }">
            {{ checkupData.bmi }} ({{ checkupData.bmiStatus }})
          </span>
        </div>
        <div class="flex justify-between items-center" v-if="checkupData.referralLetter">
          <span class="text-gray-600">Surat Rujukan</span>
          <a :href="checkupData.referralLetter" target="_blank" class="text-blue-500 hover:underline flex items-center">
            <Icon icon="mdi:file-document-outline" class="mr-1 text-xl" />
            suratrujukan.pdf
          </a>
        </div>
      </div>
    </div>

    <template #footer>
      <div class="flex justify-end space-x-2">
        <n-button quaternary @click="handleClose">
          Kembali
        </n-button>
      </div>
    </template>
  </n-modal>
</template>

<style scoped>
:deep(.n-modal) {
  @apply rounded-lg;
}

:deep(.n-modal-body) {
  padding: 20px !important;
}

:deep(.n-button) {
  font-size: 14px;
}
</style>
