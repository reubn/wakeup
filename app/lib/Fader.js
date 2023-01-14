export default class Fader {
  constructor(routine, wakeUpSystem){
    this.routine = routine
    this.wakeUpSystem = wakeUpSystem

    this.fadeInterval = 2 * 1000

    this.nextTickTimeout = null
  }

  start(onEnd){
    this.onEnd = onEnd

    const now = new Date()

    const startTime = this.routine.timer.wakeUpTime

    const timeUntilStart = startTime - now

    setTimeout(() => {
      this.wakeUpSystem.dispatchEvent(new CustomEvent('fadeStart', {detail: {routine: this.routine}}))
      this.tick()
    }, timeUntilStart)
  }

  stop(){
    this.stopped = true
    clearTimeout(this.nextTickTimeout)

    this.wakeUpSystem.dispatchEvent(new CustomEvent('fadeEnd', {detail: {routine: this.routine}}))
    
    this.onEnd?.()
  }

  tick = this._tick.bind(this)
  _tick(){
    this.nextTickTimeout = null

    if(this.stopped) return 

    const now = new Date()

    const linearProgress = Math.min(1, (now - this.routine.timer.wakeUpTime) / this.routine.timer.wakeUpPeriod)

    console.log('tick', {linearProgress, stopped: this.stopped})

    const detail = {
      routine: this.routine,
      linearProgress
    }

    this.wakeUpSystem.dispatchEvent(new CustomEvent('fadeTick', {detail}))

    const timeOfNextTick = Math.min(now.valueOf() + this.fadeInterval, this.routine.timer.alarmTime.valueOf())
    const timeUntilNextTick = timeOfNextTick - now

    if(linearProgress >= 1) return this.stop()
    else this.nextTickTimeout = setTimeout(this.tick, timeUntilNextTick)
  }
}