import type { Request, Response } from 'express'
import db from '@/drizzle/db.js'
import { schools, user } from '@/drizzle/schema.js'
import type { School } from '@/types/global.js'
import { eq } from 'drizzle-orm'
import crypto from 'crypto'
import {
  AuthenticationError,
  BadRequestError,
  ConflictError,
  NotFoundError,
} from '@/errors/index.js'
import { StatusCodes } from 'http-status-codes'

export const createSchool = async (
  req: Request<unknown, unknown, School>,
  res: Response,
) => {
  const { name, address, phone, email } = req.body
  const ownerId = req.user?.id
  const ownerRole = req.user?.role

  if (!ownerId || !ownerRole) {
    throw new AuthenticationError('Not authenticated')
  }

  const existingSchool = await db.query.schools.findFirst({
    where: (fields, { eq }) => eq(fields.email, email),
  })

  if (existingSchool && ownerRole !== 'admin') {
    const updateUserRole = await db
      .update(user)
      .set({ role: 'admin' })
      .where(eq(user.id, ownerId))
      .returning()

    if (!updateUserRole) {
      throw new BadRequestError('Failed to set the user as admin')
    }
  } else if (existingSchool && ownerRole === 'admin') {
    throw new ConflictError('School email already exists')
  }

  const [newSchool] = await db
    .insert(schools)
    .values({
      id: crypto.randomUUID(),
      name,
      address,
      phone,
      email,
      ownerId,
    })
    .returning()

  if (!newSchool) {
    throw new BadRequestError('Failed to create school')
  }

  const [updatedUser] = await db
    .update(user)
    .set({ role: 'admin' })
    .where(eq(user.id, ownerId))
    .returning()

  if (!updatedUser) {
    throw new BadRequestError('Failed to set the user as admin')
  }

  res.status(StatusCodes.CREATED).json({ success: true, data: newSchool })
}

// get school by id
export const getSchoolById = async (
  req: Request<{ id: string }>,
  res: Response,
) => {
  const { id } = req.params

  console.log(id)

  const school = await db.query.schools.findFirst({
    where: (fields, { eq }) => eq(fields.id, id),
  })

  if (!school) {
    throw new NotFoundError('School not found')
  }

  res.status(StatusCodes.OK).json({ success: true, data: school })
}

export const updateSchoolById = async (
  req: Request<{ id: string }, unknown, School>,
  res: Response,
) => {
  const { id } = req.params

  const school = await db.query.schools.findFirst({
    where: (fields, { eq }) => eq(fields.id, id),
  })

  if (!school) {
    throw new NotFoundError('School not found')
  }

  const { name, address, phone, email } = req.body

  if (email && email !== school.email) {
    const existingEmail = await db.query.schools.findFirst({
      where: (fields, { and, eq, ne }) =>
        and(eq(fields.email, email), ne(fields.id, id)),
    })

    if (existingEmail) {
      throw new ConflictError('School email already exists')
    }
  }

  const [updatedSchool] = await db
    .update(schools)
    .set({ name, address, phone, email })
    .where(eq(schools.id, id))
    .returning()

  if (!updatedSchool) {
    throw new BadRequestError('Failed to update school')
  }

  res.status(StatusCodes.OK).json({ success: true, data: updatedSchool })
}

// delete school by id
export const deleteSchoolById = async (
  req: Request<{ id: string }>,
  res: Response,
) => {
  const { id } = req.params

  const school = await db.query.schools.findFirst({
    where: (fields, { eq }) => eq(fields.id, id),
  })

  if (!school) {
    throw new NotFoundError('School not found')
  }

  await db.delete(schools).where(eq(schools.id, id))

  res.status(StatusCodes.NO_CONTENT).send()
}
