import { format, isEqual, startOfDay } from 'date-fns'

import Alarm from './Alarm'

export default class AlarmSystem {
  constructor({rawAlarms, currentDate, maxDays=1 /*today, tomorrow */, enabledIndexes}) {
    this.manualMode = !!enabledIndexes
    this.maxDays = maxDays

    this.currentDate = currentDate
    this.alarms = (Array.isArray(rawAlarms) ? rawAlarms : rawAlarms ? [rawAlarms] : [])
      .filter(alarm => alarm)
      .map((alarm, index) => new Alarm(alarm, this.manualMode ? enabledIndexes.includes(index) : undefined))
  }

  get activeAlarmTimes() {
    if(this._active) return this._active

    const currentDate = this.currentDate

    const currentAlarms = this.alarms.filter(alarm => !alarm.isInPast(this.currentDate))
    const withTimes = currentAlarms.flatMap(alarm => alarm.nextTimes(currentDate, this.maxDays).map(time => ({alarm, time})))

    const byDay = withTimes.reduce((bins, {alarm, time}) => {
      if(!time) return bins
      
      const day = +startOfDay(time)

      const bin = bins[day] ?? []

      return {
        ...bins,
        [day]: [...bin, {alarm, time}],
      }
    }, {})

    // console.log({ byDay: Object.fromEntries(Object.entries(byDay).map(([day, alarms]) => [format(new Date(+day), 'yyyy-MM-dd'), alarms])) })

    const sorted = Object.entries(byDay)
      .sort(([a], [b]) => +a - +b)
      .flatMap(([_, alarmsWithTimes]) => {
        if(this.manualMode) return alarmsWithTimes
          .filter(({alarm}) => alarm.isEnabled(this.currentDate))
          .sort(AlarmSystem.alarmTimeSort)

        const scheduledAlarmTime = alarmsWithTimes.find(({alarm}) => alarm.hasSchedule)
        const fixedAlarmTimes = alarmsWithTimes.filter(({alarm}) => !alarm.hasSchedule)

        // if there is a fixed alarm for same time as scheduled alarm in a day, this means there is no alarm for that day (there can only be one scheduled alarm per day)
        const {matching, notMatching} = fixedAlarmTimes.reduce((_, alarmTime) => {
          const {alarm, time} = alarmTime
      
          const matches = scheduledAlarmTime && isEqual(time, scheduledAlarmTime.time)

          if(matches) return {..._, matching: [..._?.matching ?? [], alarmTime]}
          return {..._, notMatching: [..._?.notMatching ?? [], alarmTime]}
          
        }, {})
        if(scheduledAlarmTime && matching?.length) return []

        // if there is a fixed alarm for different time as scheduled alarm in a day, this means there is an alarm for that day - not with 100% certainty? (may be disabled?) - option to ask?
        if(scheduledAlarmTime && notMatching?.length) return notMatching.sort(AlarmSystem.alarmTimeSort)

        // if there is a fixed alarm alone in a day, we don't know if it is enabled or not - will assume is - option to ask? 
        if(!scheduledAlarmTime && fixedAlarmTimes.length) return fixedAlarmTimes.sort(AlarmSystem.alarmTimeSort)

        // sort alarms so that scheduled alarms take priority, and then by time
        return alarmsWithTimes.sort(AlarmSystem.alarmTimeSort)
      })

      this._active = sorted

      return sorted
  }
  
  get nextAlarmTime() {
    return this.activeAlarmTimes[0]
  }

  static alarmTimeSort(a, b) {
    // if both alarms are scheduled, sort by time, earliest first
    if (a.alarm.hasSchedule === b.alarm.hasSchedule) return a.time - b.time

    // if one alarm is scheduled, it takes priority
    if (a.alarm.hasSchedule) return 1
    if (b.alarm.hasSchedule) return -1

    return 0
  }
}