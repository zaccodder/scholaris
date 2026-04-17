import crypto from 'crypto'
import db from '@/drizzle/db.js'
import { classes } from '@/drizzle/schema.js'
import { BadRequestError, NotFoundError } from '@/errors/index.js'
import type { Class } from '@/types/global.js'
import type { Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import { eq, and, ne, sql } from 'drizzle-orm'

// CREATE CLASS
export const createClass = async (
  req: Request<unknown, unknown, Class>,
  res: Response,
) => {
  const { courseId, roomNumber, schedule, semester, teacherId, year } = req.body

  if (!courseId || !semester || year === undefined || year === null) {
    throw new BadRequestError(
      'courseId, semester, and year are required to create a class',
    )
  }

  const classExist = await db.query.classes.findFirst({
    where: (fields, { and, eq }) =>
      and(
        eq(fields.courseId, courseId),
        eq(fields.semester, semester),
        eq(fields.year, year),
      ),
  })

  if (classExist) {
    throw new BadRequestError(
      'Class already exists for this course in this semester/year',
    )
  }

  const [newClass] = await db
    .insert(classes)
    .values({
      id: crypto.randomUUID(),
      courseId,
      roomNumber,
      schedule,
      semester,
      teacherId,
      year,
    })
    .returning()

  if (!newClass) {
    throw new BadRequestError('Failed to create class')
  }

  res.status(StatusCodes.CREATED).json({
    success: true,
    message: 'Class created successfully',
    data: newClass,
  })
}

// GET ALL CLASSES
export const getClasses = async (req: Request, res: Response) => {
  const page = Number(req.query.page ?? 1)
  const limit = Number(req.query.limit ?? 20)
  const maxLimit = 100

  if (
    Number.isNaN(page) ||
    !Number.isInteger(page) ||
    page < 1 ||
    Number.isNaN(limit) ||
    !Number.isInteger(limit) ||
    limit < 1 ||
    limit > maxLimit
  ) {
    throw new BadRequestError('Invalid pagination parameters')
  }

  const skip = (page - 1) * limit
  const countResult = await db
    .select({ total: sql<number>`count(*)` })
    .from(classes)

  const total = countResult[0]?.total ?? 0

  const classesPage = await db.query.classes.findMany({
    orderBy: (fields, { asc }) => asc(fields.createdAt),
    limit,
    offset: skip,
  })

  res.status(StatusCodes.OK).json({
    success: true,
    data: classesPage,
    meta: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  })
}

// GET SINGLE CLASS
export const getClass = async (req: Request<{ id: string }>, res: Response) => {
  const classItem = await db.query.classes.findFirst({
    where: (fields, { eq }) => eq(fields.id, req.params.id),
  })

  if (!classItem) {
    throw new NotFoundError('Class not found')
  }

  res.status(StatusCodes.OK).json({
    success: true,
    data: classItem,
  })
}

// UPDATE CLASS
export const updateClass = async (
  req: Request<{ id: string }, unknown, Class>,
  res: Response,
) => {
  const { courseId, semester, year } = req.body

  const existingClass = await db.query.classes.findFirst({
    where: (fields, { eq }) => eq(fields.id, req.params.id),
  })

  if (!existingClass) {
    throw new NotFoundError('Class not found')
  }

  const effectiveCourseId = courseId ?? existingClass.courseId
  const effectiveSemester = semester ?? existingClass.semester
  const effectiveYear = year ?? existingClass.year

  if (effectiveCourseId && effectiveSemester && effectiveYear) {
    const duplicate = await db.query.classes.findFirst({
      where: (fields, { and, eq, ne }) =>
        and(
          eq(fields.courseId, effectiveCourseId),
          eq(fields.semester, effectiveSemester),
          eq(fields.year, effectiveYear),
          ne(fields.id, req.params.id),
        ),
    })

    if (duplicate) {
      throw new BadRequestError(
        'Another class already exists for this course in this semester/year',
      )
    }
  }

  const allowedFields = [
    'courseId',
    'roomNumber',
    'schedule',
    'semester',
    'teacherId',
    'year',
  ] as const

  const updateData = allowedFields.reduce((acc, field) => {
    const value = req.body[field]
    if (value !== undefined) {
      ;(acc as any)[field] = value
    }
    return acc
  }, {} as Partial<Class>)

  const [updatedClass] = await db
    .update(classes)
    .set(updateData)
    .where(eq(classes.id, req.params.id))
    .returning()

  if (!updatedClass) {
    throw new BadRequestError('Failed to update class')
  }

  res.status(StatusCodes.OK).json({
    success: true,
    message: 'Class updated successfully',
    data: updatedClass,
  })
}

// DELETE CLASS
export const deleteClass = async (
  req: Request<{ id: string }>,
  res: Response,
) => {
  const classItem = await db.query.classes.findFirst({
    where: (fields, { eq }) => eq(fields.id, req.params.id),
  })

  if (!classItem) {
    throw new NotFoundError('Class not found')
  }

  await db.delete(classes).where(eq(classes.id, req.params.id))

  res.status(StatusCodes.OK).json({
    success: true,
    message: 'Class deleted successfully',
  })
}
