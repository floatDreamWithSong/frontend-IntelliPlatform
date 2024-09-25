<script setup lang="ts">
import WelcomeItem from './WelcomeItem.vue'

import EcosystemIcon from './icons/IconEcosystem.vue'

import { getWeather } from '@/api/weather.api'

import { pinyin } from 'pinyin-pro'
import { ref, reactive, watch, onMounted, provide } from 'vue'
import { WeatherData } from '../api/weather.api'
import { _data, forced2pump } from '@/api/data.api'
import { ai, type Da } from '@/api/ai'
let wait = ref(false)
const cityname = ref(localStorage.getItem('ct') || '上海')
const pname = ref(localStorage.getItem('f') || '鸢尾花')
const texts = ref('ai正在诊断...')
const keyid = ref('test')

let weatherData = reactive({
  success: true,
  message: {
    text: '阴',
    code: '9',
    temperature: '28'
  }
})
provide('wd', weatherData)
watch(cityname, async (new_value) => {
  if (new_value.length > 1 && new_value.length < 5 && !new_value.includes(' ')) {
    localStorage.setItem('ct', new_value)
    const t: WeatherData = await getWeather(
      pinyin(new_value, { toneType: 'none', type: 'array' }).join('')
    )
    weatherData.success = t.success
    weatherData.message = { ...t.message }
  }
})
watch(pname, async (new_value) => {
  localStorage.setItem('f', new_value)
})
watch(forced2pump, (newv) => {
  if (newv >= 0 && newv <= 2) {
    _data.setEngineStatus(keyid.value, newv)
  }
})
async function aaii() {
  if (wait.value) return
  wait.value = true
  texts.value = 'ai正在诊断'
  const data: Da = {
    name: pname.value,
    location: cityname.value,
    sky: weatherData.message.text,
    skyt: weatherData.message.temperature,
    temp: _data.temp,
    humidity: _data.soilHumidity
  }
  await ai(data, texts)
  wait.value = false
}
onMounted(() => {
  setTimeout(async () => {
    const t: WeatherData = await getWeather(
      pinyin(cityname.value, { toneType: 'none', type: 'array' }).join('')
    )
    weatherData.success = t.success
    weatherData.message = { ...t.message }
  }, 4)
  setTimeout(async () => {
    await _data.refresh(keyid.value)
    setInterval(() => {
      _data.refresh(keyid.value)
    }, 250)
  }, 5)
  setTimeout(aaii, 1000)
})
</script>
<template>
  <WelcomeItem>
    <template #icon>
      <EcosystemIcon />
    </template>
    <template #heading>当地天气</template>
    <div style="display: flex; overflow: hidden; align-items: center">
      <div style="width: 50%">
        <div>
          <h4>盆栽所在城市：<input v-model.lazy.trim="cityname" /></h4>
          <h4>盆栽所种植物：<input v-model.lazy.trim="pname" /></h4>
        </div>
        <div v-show="weatherData.success">
          <h3>{{ `天气：${weatherData.message.text}` }}</h3>
          <h4>{{ `温度：${weatherData.message.temperature}℃` }}</h4>
        </div>
      </div>

      <div id="ait">
        <button :disabled="wait" @click="aaii()">AI诊断</button>
        <h5>{{ texts }}</h5>
      </div>
    </div>

    <h3 v-show="!weatherData.success" style="color: #ff0000">获取城市信息错误。</h3>
  </WelcomeItem>
  <WelcomeItem>
    <template #icon>
      <EcosystemIcon />
    </template>
    <template #heading>盆栽温度</template>

    {{ _data.temp }}℃
  </WelcomeItem>

  <WelcomeItem>
    <template #icon>
      <EcosystemIcon />
    </template>
    <template #heading>湿度</template>

    空气湿度:{{ _data.wet }}%<br />
    土壤湿度:{{ _data.soilHumidity }}%<br />
    当前土壤湿度控制范围：
    <span class="green">{{ _data.getLBCache() }} % 至 {{ _data.getUBCache() }}%</span><br />
    设置土壤湿度控制范围：<input v-model.trim.number="_data.wetLB" />% 至
    <input v-model.trim.number="_data.wetUB" />%
    <br />
    <button
      :disabled="!(_data.wetLB > 0 && _data.wetUB < 100 && _data.wetLB < _data.wetUB)"
      @click="_data.setRange(keyid)"
    >
      设置
    </button>
  </WelcomeItem>

  <WelcomeItem>
    <template #icon>
      <EcosystemIcon />
    </template>
    <template #heading>水箱储水量</template>

    储水量：{{ _data.water === 'adequate' ? '水量充足' : '缺水' }}
  </WelcomeItem>

  <WelcomeItem>
    <template #icon>
      <EcosystemIcon />
    </template>
    <template #heading>水泵</template>
    状态：{{
      _data.forced2pump == null
        ? '未知'
        : _data.forced2pump
          ? _data.forced2pump - 1
            ? '关闭'
            : '开启'
          : '自动'
    }}
    <input type="radio" name="radios" :value="0" v-model="forced2pump" /><label>自动</label>
    <input type="radio" name="radios" :value="1" v-model="forced2pump" /><label>开启</label>
    <input type="radio" name="radios" :value="2" v-model="forced2pump" /><label>关闭</label>
  </WelcomeItem>
</template>
<style scoped>
#ait {
  width: 50%;
  padding-left: 8px;
  overflow-y: scroll;
  max-height: 120px;
  border-left: 2px solid #3f3f3f;
  border-right: 2px solid #3f3f3f;
}

::-webkit-scrollbar {
  display: none;
}

button {
  font-size: 1rem;
  font-weight: 400;
  color: rgb(228, 228, 228);
  border: none;
  border-radius: 4px;
  /* background-color: rgb(76, 156, 109); */
}

button:enabled {
  background-color: rgb(90, 184, 129);
  cursor: pointer;
}
</style>
