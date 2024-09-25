<script setup lang="ts">
import { ai } from '@/api/ai'
import WelcomeItem from '@/components/WelcomeItem.vue'
import EcosystemIcon from '@/components/icons/IconEcosystem.vue'
import { inject, onMounted, ref, type Ref, type Reactive } from 'vue'
import type { Da } from '@/api/ai'
import { _data } from '@/api/data.api'
const text = ref('正在询问中...')
onMounted(() => {
  const name = inject('flower') as Ref<string>
  const location = inject('ct') as Ref<string>
  const wd = inject('wd') as Reactive<{
    success: boolean
    message: {
      text: string
      code: string
      temperature: string
    }
  }>
  const data: Da = {
    name: name.value,
    location: location.value,
    sky: wd.message.text,
    skyt: wd.message.temperature,
    humidity: _data.soilHumidity,
    temp: _data.temp
  }
  ai(data, text)
})
</script>
<template>
  <WelcomeItem>
    <template #icon>
      <EcosystemIcon />
    </template>
    {{ text }}
  </WelcomeItem>
</template>

<style>
@media (min-width: 1024px) {
  .about {
    min-height: 100vh;
    display: flex;
    align-items: center;
  }
}
</style>
