import {turnOnLight, turnOffLight, waitToFade} from './helpers.js'

import BezierEasing from 'bezier-easing'

const rgb2Fade = waitToFade(0.1, x => Math.floor(255 * x))
const wakeUp = (value = 1, brightness = Math.floor(255 * value)) => {
  const rgb_color = [255, 106, 0]

  const rgb2Brightness = rgb2Fade(value)

  console.log({ value, brightness, rgb2Brightness })

  return [
    turnOnLight('light.rgb1', { rgb_color, brightness }),
    turnOnLight('light.rgb2', { rgb_color, brightness: rgb2Brightness }),

    (value === 1) ? turnOnLight('light.symfonisk_bulb_rainbow') : null,
    (value === 1) ? turnOnLight('light.symfonisk_bulb', { brightness }) : null,
    (value === 1) ? turnOnLight('light.symfonisk_bulb') : turnOffLight('light.symfonisk_bulb'),

    turnOffLight('light.xiaomi_desk'),

    turnOffLight('light.ceiling_light'),
  ].filter(s => s)
}

const easing = BezierEasing(1, .1, .82, .82)

export default (dispatch, linearProgress) => {
  const easedProgress = Math.max(easing(linearProgress), 1 / 255)

  const serviceCalls = wakeUp(easedProgress)

  return dispatch(serviceCalls).catch(console.error)
}

