<script setup lang="ts">
import Detail from '@/components/modal/input-user/modal-result-checkup-mom.vue';
import { ref } from 'vue';

const props = defineProps<{
  id: string
}>()

const DetailKesehatanIbu = ref(false)


const handleOptionClick = (key: string) => {
  switch (key) {
    case 'detail':
      DetailKesehatanIbu.value = true
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

  <n-modal v-model:show="DetailKesehatanIbu" :on-after-leave="() => (DetailKesehatanIbu = false)">
    <Detail :id="props.id" @close="DetailKesehatanIbu = false" />
  </n-modal>
</template>
