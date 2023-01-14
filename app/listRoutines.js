import {prisma} from './lib/db.js'

prisma.routine.findMany().then(routines => {
  for (const routine of routines) {
    console.log(`${routine.name} (${routine.id})`)
  }
})
