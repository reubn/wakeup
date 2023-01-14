import {prisma} from './lib/db.js'

const name = process.argv[2] ?? `routine-${Math.random().toString(36).substring(7)}`
const id = process.argv[3] 

const createRoutine = async routine => {
  const newRecord = await prisma.routine.upsert({
    create: routine,
    update: routine,
    where: {id: routine.id ?? ""}
  })

  console.log(`Set routine ${newRecord.name}: ${newRecord.id}`)
}

createRoutine({name, id})


