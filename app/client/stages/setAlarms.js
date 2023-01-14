import { parseISO } from 'date-fns'
import AlarmSystem from '../lib/AlarmSystem.js'

export default ({alarms: rawAlarms, manualMode: manualModeRaw, enabledDescriptions: enabledDescriptionsRaw}, output) => {
  const manualMode = typeof manualModeRaw === 'boolean' ? manualModeRaw : manualModeRaw === 'true'

  const enabledIndexes = manualMode
    ? (Array.isArray(enabledDescriptionsRaw) ? enabledDescriptionsRaw : [enabledDescriptionsRaw])
      .map(description => parseInt(description.split('.')[0]) - 1)
    : undefined

  const currentDate = new Date() //parseISO('2023-03-25T20:00:00Z')

  console.log({ currentDate: currentDate.toISOString() })

  const alarmSystem = new AlarmSystem({rawAlarms, currentDate, enabledIndexes})
  const nextAlarmTime = alarmSystem.nextAlarmTime

  output.nextTime = nextAlarmTime?.time.toISOString()

  console.log({ nextAlarmTime, nextTime: output.nextTime})
}