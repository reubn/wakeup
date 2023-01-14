export default function FlatPromise(){
  let handlers
  const promise = new Promise((resolve, reject) => handlers = [resolve, reject])

  return [promise, ...handlers]
}
