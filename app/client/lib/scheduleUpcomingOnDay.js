// will the schedule match at some point in the future on the same day as the date

/* this._schedule = {
  hours: +h,
  minutes: +m,
  seconds: +s,
  daysOfWeek
} */

export default (schedule, date) => {
  const weekday = date.getDay()

  if(!schedule.daysOfWeek.includes(weekday)) return undefined

  if(schedule.hours < date.getHours()) return undefined
  if(schedule.hours === date.getHours() && schedule.minutes < date.getMinutes()) return undefined
  if(schedule.hours === date.getHours() && schedule.minutes === date.getMinutes() && schedule.seconds < date.getSeconds()) return undefined

  // work out when schedule will match on this day

  const willMatchAt = new Date(date)
  willMatchAt.setHours(schedule.hours)
  willMatchAt.setMinutes(schedule.minutes)
  willMatchAt.setSeconds(schedule.seconds)
  willMatchAt.setMilliseconds(schedule?.milliseconds ?? 0)

  return willMatchAt
}