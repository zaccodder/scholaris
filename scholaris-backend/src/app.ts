import { toNodeHandler } from 'better-auth/node'
import express, { type Request, type Response } from 'express'
import cors from 'cors'
import helmet from 'helmet'
import { auth } from '@/lib/auth.js'
import authRouter from '@/routes/auth.route.js'
import schoolRouter from '@/routes/school.route.js'
import unknownEndPoint from '@/middlewares/unknown-end-point.middleware.js'
import errorHandler from '@/middlewares/error.middleware.js'
import limiter from '@/lib/limiter.js'
import morganMiddleware from '@/lib/morgan.js'
import departmentRouter from '@/routes/department.route.js'

const app = express()

app.use(limiter)

app.all('/api/auth/{*any}', toNodeHandler(auth))

app.use(express.json())

app.use(
  cors({
    origin: process.env.BETTER_AUTH_URL,
    methods: ['POST', 'GET', 'PATCH', 'PUT', 'DELETE', 'OPTIONS', 'HEAD'],
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization'],
    exposedHeaders: ['Content-Length'],
    maxAge: 600,
  }),
)
app.use(morganMiddleware)
app.use(helmet())

// Test route
app.get('/health', (req: Request, res: Response) => {
  res.send('Scholaris backend server is running healthy')
})

// application routes
app.use('/api/v1/users', authRouter)
app.use('/api/v1/schools', schoolRouter)
app.use('/api/v1/departments', departmentRouter)

app.use(unknownEndPoint)
// error handler middleware
app.use(errorHandler)

export default app
