import http from 'node:http'
import parseBody from 'co-body'
import { createReadStream } from 'node:fs'

let handler = null

const port = process.env.PORT ?? 8023

export const register = wakeUpSystem => handler = wakeUpSystem

const sendJSON = (res, data, statusCode=200) => {
  res.writeHead(statusCode, {'Content-Type': 'application/json'})
  res.end(JSON.stringify(data))
}

const requestListener = async function (req, res) {
  if(!handler) return sendJSON(res, {error: `No handler registered`}, 500)

  const path = req.url
  const body = await parseBody(req).catch(() => ({}))

  if(path === `/shortcuts.js`) return createReadStream('./client/shortcuts.js').pipe(res)
  if(path === `/shortcuts.js.map`) return createReadStream('./client/shortcuts.js.map').pipe(res)
  if(path === `/shortcuts.html`) return createReadStream('./client/index.html').pipe(res)
  
  if(path === `/schedule`) return handler.schedule(body)
    .then(data => sendJSON(res, data))
    .catch(error => sendJSON(res, {error: error.message, stack: error.stack}, error.code || 500))
  if(path === `/query`) return handler.query(body)
    .then(data => sendJSON(res, data))
    .catch(error => sendJSON(res, { error: error.message, stack: error.stack }, error.code || 500))

  sendJSON(res, [], 404)
}

const server = http.createServer(requestListener)

export default () => server.listen(port, () => console.log(`Wakeup server running on Port`, port))