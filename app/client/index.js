import shortcutsRuntime from './lib/shortcutsRuntime'

import runStage from './stages'

shortcutsRuntime((input, output) => {
  const {stage} = input || {}

  runStage(stage, input, output)
})