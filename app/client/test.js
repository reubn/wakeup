import { parseISO } from 'date-fns'
import AlarmSystem from './lib/AlarmSystem.js'

import testCases from './testCases.js'

const test = ({alarms: rawAlarms, currentDate: currentDateString}) => {
  const currentDate = parseISO(currentDateString)

  const alarmSystem = new AlarmSystem({rawAlarms, currentDate, maxDays: 7})
  const nextAlarmTime = alarmSystem.nextAlarmTime

  return nextAlarmTime?.time.toISOString()
}

const runTests = () => {
  for(const testCase of testCases) {
    const result = test(testCase)

    testCase.passed = result === testCase.expectedNextAlarm

    if(testCase.passed) console.log('✅', testCase.description)
    else if(testCase.permissableFail) console.log('⚠️ ', testCase.description, { result, expected: testCase.expectedNextAlarm })
    else console.log('❌', testCase.description, {result, expected: testCase.expectedNextAlarm})
  }

  const passed = testCases.filter(t => t.passed || t.permissableFail).length
  
  console.log(`Passed ${passed}/${testCases.length}`)
}

runTests()