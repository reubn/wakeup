export default (run, injectInput) => {
  const _input = input ?? injectInput
  
  const output = {input: _input}

  try {
    run(_input, output)
    document.write(JSON.stringify(output))
  }
  catch(error) {
    document.write(JSON.stringify({error: error.message, stack: error.stack, ...output}))
    throw error
  }
}
