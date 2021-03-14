import dotenv from 'dotenv'
import { app } from './app'

dotenv.config()

const port = 3000

// Start server
app.listen(port, () => console.log(`Server is listening on port ${port}!`))
