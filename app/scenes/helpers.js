export const toggleLight = (entity_id, data = {}) => ({
  domain: 'light',
  service: 'toggle',
  service_data: {
    entity_id,
    ...data
  }
})

export const turnOnLight = (entity_id, data = {}) => ({
  domain: 'light',
  service: 'turn_on',
  service_data: {
    entity_id,
    ...data
  }
})

export const turnOffLight = (entity_id, data = {}) => ({
  domain: 'light',
  service: 'turn_off',
  service_data: {
    entity_id,
    ...data
  }
})

export const waitToFade = (startAt, fn) => value => {
  const faded = Math.max(0, (value - startAt) * (1 / (1 - startAt)))

  return fn ? fn(faded) : faded
}