const desc = {
  hours: 16,
  minutes: 1,
  seconds: 36,
  milliseconds: 0,

  year: 2018,
  month: 9,
  day: 1
}

const ianaTz = 'Europe/Berlin'//Intl.DateTimeFormat().resolvedOptions().timeZone

const localString = zonelessStringFromDescription(desc)
const date = zonedTimeToUtc(localString, ianaTz)

console.table({
  ianaTz,
  localString,
  isoString: date.toISOString(),
  epoch: date.getTime(),
})

const now = new Date()

const pattern = `yyyy-MM-dd'T'HH:mm:ss`

const todayFITZ = formatInTimeZone(now, ianaTz, pattern)

const todayFakeDateInTzToWorkWithStandardDateFns = utcToZonedTime(now, ianaTz)
const todayF = format(todayFakeDateInTzToWorkWithStandardDateFns, pattern)

const todayDescription = descriptionFromDate(todayFakeDateInTzToWorkWithStandardDateFns)

console.log({ todayFITZ, todayF, todayDescription, ianaTz })
output.ianaTz = ianaTz
