<script setup lang="ts">
import { useAuthProfile } from '@/services/auth-user';
import { initials } from '@dicebear/collection';
import { createAvatar } from '@dicebear/core';
import { computed } from 'vue';

const { data } = useAuthProfile()
const props = defineProps<{
  seed?: string
}>()

const avatar = computed(() => {
  return createAvatar(initials, {
  size: 50,
  seed: props.seed
}).toDataUri()
})

</script>
<template>
  <img :src="data?.userPicture?.path || avatar"
  alt="Profile Picture" 
  class="w-10 h-10 rounded-full mr-2" />
</template>
