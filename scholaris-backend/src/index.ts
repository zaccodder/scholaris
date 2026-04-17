import app from './app.js'
import logger from './lib/winston.js'

const PORT = process.env.PORT || 3001

const server = app.listen(PORT, () => {
  const address = server.address()
  const url =
    typeof address === 'object' && address
      ? `http://localhost:${address.port}`
      : `http://localhost:${PORT}`

  logger.info(`Server is listening on ${url}`)
})
