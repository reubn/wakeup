import {addDays, differenceInDays, format, isToday, isTomorrow, parseISO, startOfDay} from 'date-fns'
import scheduleUpcomingOnDay from './scheduleUpcomingOnDay'

const weekdays = [
  {long: 'Sunday', short: 'Sun'},
  {long: 'Monday', short: 'Mon'},
  {long: 'Tuesday', short: 'Tue'},
  {long: 'Wednesday', short: 'Wed'},
  {long: 'Thursday', short: 'Thu'},
  {long: 'Friday', short: 'Fri'},
  {long: 'Saturday', short: 'Sat'},
]

export default class Alarm {
  constructor({alarm, name, time, timeReparsed, repeat}, enabled) {
    this.alarm = alarm
    this.name = name
    this.repeat = repeat

    this.timeString = time
    // this.timeReparsedString = timeReparsed

    // if enabled has been provided
    if(enabled !== undefined) this._enabled = enabled
  }

  getDescription(currentDate) {
    if(this.hasSchedule) {
      const {hours, minutes, seconds, daysOfWeek} = this.schedule

      const hoursString = `${hours}`.padStart(2, '0')
      const minutesString = ':' + `${minutes}`.padStart(2, '0')
      const secondsString = seconds ? ':' + `${seconds}`.padStart(2, '0') : ''

      return `${hoursString}${minutesString}${secondsString} every ${daysOfWeek.map(day => weekdays[day].short).join(', ')}`
    }

    const timePart = this.time.getSeconds() ? format(this.time, 'HH:mm:ss') : format(this.time, 'HH:mm')

    const dayPart = isToday(this.time, currentDate) ? 'today'
      : isTomorrow(this.time, currentDate) ? 'tomorrow'
      : format(this.time, 'yyyy-MM-dd')

    return timePart + ' ' + dayPart
  }

  get hasSchedule() {
    return Array.isArray(this.repeat)
  }

  get time() {
    return this._time = this._time ?? parseISO(this.timeString)
  }

  isInPast(currentDate) {
    if(this.hasSchedule) return false
    
    return this.time < currentDate
  }

  isEnabled(currentDate) {
    if(this.hasOwnProperty('_enabled')) return this._enabled
    if(this.hasSchedule) return true
    if(this.isInPast(currentDate)) return false
    
    return undefined
  }

  setEnabled(enabled) {
    this._enabled = enabled
  }

  get schedule() {
    if (this._schedule) return this._schedule

    //0001-01-01T07:05:00-00:01:15
    const [_, h, m, s] = this.timeString.match(/0001-01-01T(\d{2}):(\d{2}):(\d{2})-/) ?? []

    const daysOfWeek = this.repeat.map(name => weekdays.findIndex(day => day.long === name))

    this._schedule = {
      hours: +h,
      minutes: +m,
      seconds: +s,
      daysOfWeek
    } 

    return this._schedule
  }

  nextTimes(currentDate = new Date(), maxDays) {
    if (!this.hasSchedule) {
      // if the time is in the past
      if(this.time < currentDate) return []

      const daysAhead = differenceInDays(this.time, currentDate)

      if(daysAhead > maxDays) return []

      return [this.time]
    }

    return this.scheduledTimes(currentDate, maxDays)
  }

  scheduledTimes(currentDate, maxDays, daysChecked=[], scheduledTimes=[]) {
    const dayOfWeek = currentDate.getDay()

    if(daysChecked.length > maxDays) return scheduledTimes

    const alarmUpcoming = scheduleUpcomingOnDay(this.schedule, currentDate)

    // if(alarmUpcoming) return alarmUpcoming

    const nextDayToCheck = startOfDay(addDays(currentDate, 1))

    const newScheduledTimes = alarmUpcoming ? [...scheduledTimes, alarmUpcoming] : scheduledTimes
    
    return this.scheduledTimes(nextDayToCheck, maxDays, [...daysChecked, dayOfWeek], newScheduledTimes)
  }
}