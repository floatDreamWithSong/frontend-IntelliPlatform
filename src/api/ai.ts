import OpenAI from 'openai'
import { ref, type Ref } from 'vue'
import { _data } from './data.api'
export interface Da {
  name: string
  humidity: number
  temp: number
  location: string
  sky: string
  skyt: string
}
const keyid = ref('test')
export async function ai(data: Da, text: Ref<string>) {
  const client = new OpenAI({
    apiKey: 'sk-CGu3G7oPGmfKVhV3SvmOdkNj0joznFttXbnxKzYjLz4j2goE',
    baseURL: 'https://api.moonshot.cn/v1',
    dangerouslyAllowBrowser: true
  })
  const completion = await client.chat.completions.create({
    model: 'moonshot-v1-8k',
    messages: [
      {
        role: 'system',
        content:
          '你是一名盆栽植物专家，会根据用户所描述的盆栽栽种植物、盆栽所在地、当地天气、当前盆栽土壤湿度、当前盆栽空气温度，为用户提供安全，有帮助，准确的回答'
      },
      {
        role: 'user',
        content: `我的盆栽种植了${data.name}，位置是${data.location}，天气${data.sky}，当地温度为${data.skyt}摄氏度，盆栽的空气温度为${data.temp}摄氏度，土壤湿度为${data.humidity}%。\
            你的回答内容应该满足如下要求：\
            第一句回答当前环境是否适合当前植物的生长。你的第二句话，回答当前温度是否适合，并给出当前植物的适合温度。你的第三句话，回答当前湿度是否合适，并给出建议湿度环境。\
            你的第四句话，回答当前天气是否合适，并给出相关建议。最后输出如下格式：<建议的土壤湿度范围<xx-xx>%>`
      }
    ],
    temperature: 0.3
  })
  console.log(completion.choices[0].message.content)
  const a = completion.choices[0].message.content?.split('<')[2]
  if (a) {
    _data.setRange(keyid.value, Number(`${a[0]}${a[1]}`), Number(`${a[3]}${a[4]}`))
  }
  text.value =
    completion.choices[0].message.content?.split('<')[0] ||
    completion.choices[0].message.content ||
    '获取失败'
}
