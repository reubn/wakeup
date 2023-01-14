import ws from 'ws'
globalThis.WebSocket = ws

import {createConnection, createLongLivedTokenAuth, callService} from 'home-assistant-js-websocket'

let connection
export const getConnection = async () => {
  if(connection) return connection

  if(!process.env.HA_URL) throw new Error(`Missing HA_URL`)
  if(!process.env.HA_TOKEN) throw new Error(`Missing HA_TOKEN`)

  const auth = createLongLivedTokenAuth(process.env.HA_URL, process.env.HA_TOKEN)

  connection = await createConnection({auth})

  console.log(`Connected to Home Assistant`)

  connection.addEventListener('ready', () => console.log(`Home Assistant connection ready`))
  connection.addEventListener('disconnected', () => console.log(`Home Assistant connection disconnected`))
  connection.addEventListener('reconnect-error', () => console.log(`Home Assistant connection reconnect-error`))

  return connection
}

export const getDispatch = async () => {
  const connection = await getConnection()

  const _cS = ({domain, service, service_data, target}) => callService(connection, domain, service, service_data, target)

  const dispatch = x => Array.isArray(x) ? Promise.all(x.map(a => _cS(a))) : _cS(x)

  return dispatch
}
