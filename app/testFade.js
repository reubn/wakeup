process.on('unhandledRejection', (reason, p) => {
  console.log('Unhandled Rejection at: Promise', p, 'reason:', reason);
  // application specific logging, throwing an error, or other logic here
}) 

import {addMilliseconds, addSeconds} from "date-fns"
import wakeUpSystem from "./wakeUpSystem"

import {register as registerFadeHandler} from './fadeLights.js'

registerFadeHandler(wakeUpSystem)

const currentDate = new Date()
const wakeUpTime = addSeconds(currentDate, 5)

const wakeUpPeriod = 30 * 60 * 1000

const alarmTime = addMilliseconds(wakeUpTime, wakeUpPeriod)

const testRoutine = {
  id: 'test',
  name: 'reubenBedroom',
  timer: {
    id: 'testTimer',
    wakeUpTime,
    alarmTime,
    wakeUpPeriod
  }
}

console.log('test fade', testRoutine)

wakeUpSystem.createFader(testRoutine)