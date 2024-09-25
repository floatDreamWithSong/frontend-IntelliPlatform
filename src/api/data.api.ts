import { reactive, ref } from 'vue'
import { request } from './request.fun'
import { SimpleArgs } from './request.fun'

const serverPath = 'http://106.54.198.225:443'
let isfir = true
export class Data {
  modified: boolean = false
  temp: number
  wet: number
  wetUB: number
  wetLB: number
  engine: 'running' | 'stopped' = 'stopped'
  water: 'adequate' | 'inadequate' = 'inadequate'
  forced2pump: number = 3
  soilHumidity: number = 0
  private LBcache: number = -1
  private UBcache: number = -1
  constructor(temp: number, wet: number, wetLB: number, wetUB: number) {
    this.temp = temp
    this.wet = wet
    this.wetLB = wetLB
    this.wetUB = wetUB
  }
  getLBCache() {
    return this.LBcache
  }
  getUBCache() {
    return this.UBcache
  }
  async refresh(key: string) {
    const args: SimpleArgs[] = []
    args.push(new SimpleArgs('key', key))
    const _data = new Data(-1, -1, -1, -1)
    await request(`${serverPath}/getdata`, args)
      .then((res) => {
        console.log(res.data.msg)
        this.temp = res.data.msg.temp
        this.engine = res.data.msg.engine
        this.water = res.data.msg.water
        this.wet = res.data.msg.wet

        this.soilHumidity = res.data.msg.soilHumidity
        this.LBcache = res.data.msg.wetLB
        this.UBcache = res.data.msg.wetUB
        if (isfir) {
          this.forced2pump = res.data.msg.forced2pump
          forced2pump.value = res.data.msg.forced2pump
          isfir = false
        }
      })
      .catch((err) => {
        console.log(err)
      })
    return _data
  }
  async setRange(key: string, a: number = this.wetLB, b: number = this.wetUB) {
    const args: SimpleArgs[] = []
    args.push(new SimpleArgs('key', key))
    args.push(new SimpleArgs('wetLB', a))
    args.push(new SimpleArgs('wetUB', b))
    const _data = new Data(-1, -1, -1, -1)
    await request(`${serverPath}/setdata`, args)
      .then((res) => {
        console.log(res)
        this.temp = res.data.msg.temp
        this.engine = res.data.msg.engine
        this.water = res.data.msg.water
        this.wet = res.data.msg.wet
        this.LBcache = res.data.msg.wetLB
        this.UBcache = res.data.msg.wetUB
      })
      .catch((err) => {
        console.log(err)
      })
    return _data
  }
  async setEngineStatus(key: string, type: number) {
    const args: SimpleArgs[] = []
    args.push(new SimpleArgs('forced2pump', type))
    args.push(new SimpleArgs('key', key))
    const _data = new Data(-1, -1, -1, -1)
    await request(`${serverPath}/setengine`, args)
      .then((res) => {
        this.forced2pump = res.data.msg.forced2pump
        console.log(res)
      })
      .catch((err) => {
        console.log(err)
      })
    return _data
  }
}
export const _data = reactive(new Data(-1, -1, 1, 99))
export const forced2pump = ref(3)
