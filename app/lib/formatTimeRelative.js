import {format, isToday, isTomorrow} from 'date-fns'

export default (date, currentDate) => {
  const timePart = date.getSeconds() ? format(date, 'HH:mm:ss') : format(date, 'HH:mm')

  const dayPart = isToday(date, currentDate) ? 'today'
    : isTomorrow(date, currentDate) ? 'tomorrow'
    : format(date, 'yyyy-MM-dd')

  // const tzPart = format(date, 'XXXXX')

  return `${timePart} ${dayPart}`
}