import {formatDistanceStrict, isValid} from 'date-fns'

import {prisma} from './db.js'

import Fader from './Fader.js'
import formatTimeRelative from './formatTimeRelative.js'

class WakeUpSystem extends EventTarget {
  constructor() {
    super()

    this.wakeUpTimeouts = new Map()
    this.faders = new Map()

    this.restoreFromDatabase()
  }

  async schedule({routine: routineId, alarmTime: _alarmTime, wakeUpPeriod}) {
    const routine = await prisma.routine.findUnique({where: {id: routineId}})

    if(!routine) throw new Error('routine not found')

    const existingTimerForRoutine = await prisma.timer.findUnique({where: {routineId}})

    if(existingTimerForRoutine) {
      this.destroyTimeout(existingTimerForRoutine)
      //this.stopFade(existingTimerForRoutine)
      await prisma.timer.delete({where: {id: existingTimerForRoutine.id}})
    }

    const alarmTime = new Date(_alarmTime)

    if(!isValid(alarmTime)) return this.query({routineId})

    const wakeUpTime = new Date(alarmTime - wakeUpPeriod)

    const timer = {
      routineId,
      wakeUpTime: wakeUpTime.toISOString(),
      alarmTime: alarmTime.toISOString(),
      wakeUpPeriod,
    }

    const record = await prisma.timer.create({data: timer})

    this.createWakeUpTimeout(record)

    return this.query({routineId})
  }

  async destroyTimeout({id}) {
    const timeout = this.wakeUpTimeouts.get(id)

    if(!timeout) return

    clearTimeout(timeout)

    return this.wakeUpTimeouts.delete(id)
  }

  async restoreFromDatabase(){
    const now = new Date()

    const waitingForWakeUp = await prisma.timer.findMany({where: {wakeUpTime: {gt: now}}})
    const fading = await prisma.timer.findMany({where: {wakeUpTime: {lte: now}, alarmTime: {gt: now}}, include: {routine: true}})

    waitingForWakeUp.forEach(this.createWakeUpTimeout.bind(this))
    fading.forEach(timer => {
      const routine = {...timer.routine, timer}

      this.createFader(routine)
    })

    await prisma.timer.deleteMany({where: {alarmTime: {lte: now}}})
  }

  async createWakeUpTimeout(timer) {
    const now = new Date()

    const {id, wakeUpTime} = timer

    if(this.wakeUpTimeouts.has(id)) return

    const timeUntilTrigger = wakeUpTime - now

    const timeout = setTimeout(() => this.onTimerTrigger(timer), timeUntilTrigger)

    this.wakeUpTimeouts.set(id, timeout)

    console.log('timer set', id, 'at', wakeUpTime.toISOString(), 'in', timeUntilTrigger, 'ms')
  }

  async onTimerTrigger(timer) {
    const {id, routineId} = timer

    this.wakeUpTimeouts.delete(id)

    console.log('timer triggered', id)

    const routine = await prisma.routine.findUnique({where: {id: routineId}})
    routine.timer = timer

    this.dispatchEvent(new CustomEvent('startWakeUp', {detail: routine}))

    this.createFader(routine)
  }

  createFader(routine) {
    const {id} = routine

    const fader = this.faders.has(id) ? this.faders.get(id) : new Fader(routine, this)
    this.faders.set(id, fader)

    fader.start(() => this.onFadeEnd(routine))

    console.log('fader created', id)
  }

  onFadeEnd(routine) {
    const {id} = routine

    this.faders.delete(id)

    return prisma.timer.delete({where: {routineId: id}})
  }

  async query({routineId}) {  
    const routine = await prisma.routine.findUnique({where: {id: routineId}, include: {timer: true}})

    if(!routine?.timer) return {}

    const wakeUpTime = new Date(routine.timer.wakeUpTime)
    const wakeUpPeriod = routine.timer.wakeUpPeriod
    
    const alarmTime = new Date(wakeUpTime.valueOf() + wakeUpPeriod)

    return {
      alarmTime: alarmTime.toISOString(),
      alarmTimeString: formatTimeRelative(alarmTime),
      wakeUpTime: wakeUpTime.toISOString(),
      wakeUpPeriod: wakeUpPeriod,
      wakeUpPeriodString: wakeUpTime && alarmTime ? formatDistanceStrict(wakeUpTime, alarmTime) : undefined
    }
  }
}

export default WakeUpSystem