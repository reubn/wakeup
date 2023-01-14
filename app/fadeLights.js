import {getDispatch} from './lib/homeAssistant.js'

import scenes from './scenes/index.js'

export const register = async wakeUpSystem => {
  const dispatch = await getDispatch()
  
  wakeUpSystem.addEventListener('fadeTick', ({ detail: { linearProgress, routine } }) => scenes[routine.name]?.(dispatch, linearProgress))
}