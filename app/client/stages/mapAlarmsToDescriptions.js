import AlarmSystem from '../lib/AlarmSystem.js'

export default ({alarms: rawAlarms}, output) => {
  const currentDate = new Date() //parseISO('2023-03-25T20:00:00Z')

  const alarmSystem = new AlarmSystem({rawAlarms, currentDate})

  output.alarmDescriptions = alarmSystem.alarms
    .map((alarm, index) => [alarm, index])
    .filter(([alarm, index]) => alarm.isEnabled(currentDate) !== false)
    .map(([alarm, index]) => `${index + 1}. ${alarm.getDescription(currentDate)}`)
}