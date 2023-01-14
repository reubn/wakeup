import listen, {register as registerServerHandler} from './server.js'

import wakeUpSystem from './wakeUpSystem.js'

import {register as registerFadeHandler} from './fadeLights.js'

registerFadeHandler(wakeUpSystem)

registerServerHandler(wakeUpSystem)
listen()

export default wakeUpSystem


