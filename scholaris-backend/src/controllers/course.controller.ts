import crypto from 'crypto'
import db from '@/drizzle/db.js'
import { courses } from '@/drizzle/schema.js'
import BadRequestError from '@/errors/bad-request.error.js'
import NotFoundError from '@/errors/notfound.error.js'
import type { Course } from '@/types/global.js'
import type { Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import { eq } from 'drizzle-orm'

// CREATE COURSE
export const createCourse = async (
  req: Request<unknown, unknown, Course>,
  res: Response,
) => {
  const { name, schoolId, credits, departmentId, description } = req.body

  if (!name || !schoolId) {
    throw new BadRequestError('name and schoolId are required')
  }

  const courseExist = await db.query.courses.findFirst({
    where: (fields, { and, eq }) =>
      and(eq(fields.schoolId, schoolId), eq(fields.name, name)),
  })

  if (courseExist) {
    throw new BadRequestError('Course already exists in this school')
  }

  const [newCourse] = await db
    .insert(courses)
    .values({
      id: crypto.randomUUID(),
      name,
      schoolId,
      credits,
      departmentId,
      description,
    })
    .returning()

  if (!newCourse) {
    throw new BadRequestError('Failed to create course')
  }

  res.status(StatusCodes.CREATED).json({
    success: true,
    message: 'Course created successfully',
    data: newCourse,
  })
}

// GET SINGLE COURSE
export const getCourse = async (
  req: Request<{ id: string }>,
  res: Response,
) => {
  const course = await db.query.courses.findFirst({
    where: (fields, { eq }) => eq(fields.id, req.params.id),
  })

  if (!course) {
    throw new NotFoundError('Course not found')
  }

  res.status(StatusCodes.OK).json({
    success: true,
    data: course,
  })
}

// UPDATE COURSE
export const updateCourse = async (
  req: Request<{ id: string }, unknown, Course>,
  res: Response,
) => {
  const { name, schoolId } = req.body

  // check if course exists
  const existingCourse = await db.query.courses.findFirst({
    where: (fields, { eq }) => eq(fields.id, req.params.id),
  })

  if (!existingCourse) {
    throw new NotFoundError('Course not found')
  }

  const effectiveName = name ?? existingCourse.name
  const effectiveSchoolId = schoolId ?? existingCourse.schoolId

  if (
    (name !== undefined || schoolId !== undefined) &&
    effectiveName &&
    effectiveSchoolId
  ) {
    const duplicate = await db.query.courses.findFirst({
      where: (fields, { and, eq, ne }) =>
        and(
          eq(fields.schoolId, effectiveSchoolId),
          eq(fields.name, effectiveName),
          ne(fields.id, req.params.id),
        ),
    })

    if (duplicate) {
      throw new BadRequestError('Course with this name already exists')
    }
  }

  const updateData: Partial<Course> = {}
  if (req.body.name !== undefined) updateData.name = req.body.name
  if (req.body.schoolId !== undefined) updateData.schoolId = req.body.schoolId
  if (req.body.departmentId !== undefined)
    updateData.departmentId = req.body.departmentId
  if (req.body.description !== undefined)
    updateData.description = req.body.description
  if (req.body.credits !== undefined) updateData.credits = req.body.credits

  const [updatedCourse] = await db
    .update(courses)
    .set(updateData)
    .where(eq(courses.id, req.params.id))
    .returning()

  if (!updatedCourse) {
    throw new BadRequestError('Failed to update course')
  }

  res.status(StatusCodes.OK).json({
    success: true,
    message: 'Course updated successfully',
    data: updatedCourse,
  })
}

// DELETE COURSE
export const deleteCourse = async (
  req: Request<{ id: string }>,
  res: Response,
) => {
  const course = await db.query.courses.findFirst({
    where: (fields, { eq }) => eq(fields.id, req.params.id),
  })

  if (!course) {
    throw new NotFoundError('Course not found')
  }

  await db.delete(courses).where(eq(courses.id, req.params.id))

  res.status(StatusCodes.OK).json({
    success: true,
    message: 'Course deleted successfully',
  })
}
