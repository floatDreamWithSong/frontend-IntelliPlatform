import { request, SimpleArgs } from './request.fun'
export class WeatherData {
  success: boolean
  message = {
    text: '',
    code: '',
    temperature: ''
  }
  constructor(success: boolean) {
    this.success = success
  }
}
export const getWeather = async (city: string) => {
  const args: SimpleArgs[] = []
  args.push(new SimpleArgs('key', 'Si8cseApYiOya314P'))
  args.push(new SimpleArgs('location', city))
  const weather_data = new WeatherData(false)
  await request('https://api.seniverse.com/v3/weather/now.json', args)
    .then((res) => {
      weather_data.success = true
      weather_data.message = res.data.results[0].now
      console.log(res.data.results[0].now)
    })
    .catch((err) => {
      weather_data.message.text = JSON.parse(err.request.response).status
      console.log(weather_data.message.text)
    })
  return weather_data
}
