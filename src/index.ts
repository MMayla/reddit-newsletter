import dotenv from 'dotenv'
import { app } from './app'
import { job } from './newsletter'

dotenv.config()

const port = 3000

// Start server
app.listen(port, () => console.log(`Server is listening on port ${port}!`))

console.log(`Starting scheduled job ${job.name}`)
