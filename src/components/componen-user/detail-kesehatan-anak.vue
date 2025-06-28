<script setup lang="ts">
import { ref } from 'vue'
import ModalDetail from '../modal/input-user/modal-result-checkup-child.vue'

const isOpen = ref(false)
const modalReport = ref(false)

const props = defineProps<{
  id: string
}>()

const handleOptionClick = (key: string) => {
  switch (key) {
    case 'detail':
      isOpen.value = true

      break
    case 'lapor':
      // laporan stunting
      modalReport.value = true
      break
  }
}

const options = [
  {
    label: 'Detail',
    key: 'detail'
  }
]
</script>

<template>
  <n-dropdown :options="options" @select="handleOptionClick">
    <n-button>
      <i-mage:dots></i-mage:dots>
    </n-button>
  </n-dropdown>

  <n-modal v-model:show="isOpen" :on-after-leave="() => (isOpen = false)">
    <ModalDetail :id="props.id" @close="isOpen = false" />
  </n-modal>
</template>
