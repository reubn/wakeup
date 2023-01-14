import setAlarmsStage from './setAlarms'
import mapAlarmsToDescriptionsStage from './mapAlarmsToDescriptions'

export const stages = {
  setAlarms: setAlarmsStage,
  mapAlarmsToDescriptions: mapAlarmsToDescriptionsStage,
}

export default (stage, ...args) => {
  const stageFn = stages[stage]
  
  if(stageFn) stageFn(...args)
  else throw new Error(`Unknown stage: ${stage}`)
}