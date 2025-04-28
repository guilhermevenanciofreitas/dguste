import { App } from './app.js'
import serverless from 'serverless-http'

const PORT = process.env.PORT

const app = new App()

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})

export const handler = serverless(app.express)