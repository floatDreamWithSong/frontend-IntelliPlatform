import axios from 'axios'
export class SimpleArgs {
  key: string
  value: any
  constructor(key_name: string, value: any) {
    this.key = key_name
    this.value = value
  }
}
export const request = (url: string, args: SimpleArgs[]) => {
  for (let i: number = 0; i < args.length; i++) {
    url += `${i ? '&' : '?'}${args[i].key}=${args[i].value}`
  }
  return axios.get(url)
}
