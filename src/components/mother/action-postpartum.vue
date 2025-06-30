<script setup lang="ts">
import Detail from '@/components/mother/detail-postpartum.vue';
import { ref } from 'vue';

defineProps<{
  id: string
}>()

const detailSchedule = ref(false)

const handleOptionClick = (key: string) => {
  if (key === 'detail') {
    detailSchedule.value = true
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
  <n-dropdown :options="options" @select="handleOptionClick" trigger="click">
    <n-button>
      <i-mage:dots></i-mage:dots>
    </n-button>
  </n-dropdown>
  <n-modal v-model:show="detailSchedule" :on-after-leave="() => (detailSchedule = false)">
    <Detail :id="$props.id" @close="detailSchedule = false" />
  </n-modal>
</template>
