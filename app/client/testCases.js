export default [
  {
    description: 'no alarms',
    alarms: [],
    currentDate: '2023-03-25T20:00:00Z',

    expectedNextAlarm: undefined
  },
  {
    description: 'scheduled alarm for tomorrow',
    alarms: [{ "alarm": "Bedtime", "name": "Bedtime", "time": "0001-01-01T06:30:00-00:01:15", "repeat": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"] }],
    currentDate: '2023-01-08T09:00:00Z',

    expectedNextAlarm: '2023-01-09T06:30:00.000Z'
  },
  {
    description: 'scheduled alarm for today upcoming',
    alarms: [{ "alarm": "Bedtime", "name": "Bedtime", "time": "0001-01-01T06:30:00-00:01:15", "repeat": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"] }],
    currentDate: '2023-01-09T03:00:00Z',

    expectedNextAlarm: '2023-01-09T06:30:00.000Z'
  },
  {
    description: 'scheduled alarm for today passed',
    alarms: [{ "alarm": "Bedtime", "name": "Bedtime", "time": "0001-01-01T06:30:00-00:01:15", "repeat": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"] }],
    currentDate: '2023-01-09T09:00:00Z',

    expectedNextAlarm: '2023-01-10T06:30:00.000Z'
  },
  {
    description: 'scheduled alarm for tomorrow skipped ',
    alarms: [{ "alarm": "Bedtime", "name": "Bedtime", "time": "2023-01-09T06:30:00Z", "repeat": "Never" }, { "alarm": "Bedtime", "name": "Bedtime", "time": "0001-01-01T06:30:00-00:01:15", "repeat": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"] }],
    currentDate: '2023-01-08T09:00:00Z',

    expectedNextAlarm: '2023-01-10T06:30:00.000Z'
  },
  {
    description: 'scheduled alarm for tomorrow changed time ',
    alarms: [{ "alarm": "Bedtime", "name": "Bedtime", "time": "2023-01-09T07:30:00Z", "repeat": "Never" }, { "alarm": "Bedtime", "name": "Bedtime", "time": "0001-01-01T06:30:00-00:01:15", "repeat": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"] }],
    currentDate: '2023-01-08T09:00:00Z',

    expectedNextAlarm: '2023-01-09T07:30:00.000Z'
  },
  {
    description: 'scheduled alarm for tomorrow, fixed alarm today in past',
    alarms: [{"alarm":"Bedtime","name":"Bedtime","time":"2023-01-08T07:30:00Z","repeat":"Never"},{"alarm":"Bedtime","name":"Bedtime","time":"0001-01-01T06:30:00-00:01:15","repeat":["Monday","Tuesday","Wednesday","Thursday","Friday"]}],
    currentDate: '2023-01-08T09:00:00Z',

    expectedNextAlarm: '2023-01-09T06:30:00.000Z'
  },
  {
    description: 'scheduled alarm for today and tomorrow, past time today',
    alarms: [{"alarm":"Bedtime","name":"Bedtime","time":"0001-01-01T06:30:00-00:01:15","repeat":["Monday","Tuesday","Wednesday","Thursday","Friday"]}],
    currentDate: '2023-01-09T09:00:00Z',

    expectedNextAlarm: '2023-01-10T06:30:00.000Z'
  },
  {
    description: 'scheduled alarm turned completely off',
    alarms: [{"alarm":"Bedtime","name":"Bedtime","time":"0001-01-01T06:30:00-00:01:15","repeat":["Monday","Tuesday","Wednesday","Thursday","Friday"]}],
    currentDate: '2023-01-09T09:00:00Z',

    expectedNextAlarm: undefined,
    permissableFail: true
  },
  {
    description: 'scheduled alarm turned completely off, but enabled for tomorrow',
    alarms: [{"alarm":"Bedtime","name":"Bedtime","time":"0001-01-01T06:30:00-00:01:15","repeat":["Monday","Tuesday","Wednesday","Thursday","Friday"]}],
    currentDate: '2023-01-09T09:00:00Z',

    expectedNextAlarm: '2023-01-09T06:30:00.000Z',
    permissableFail: true
  },
] 